import type { EmailRow } from "@/db/queries";
import { searchEmailsWithBM25, tokenizeQuery } from "@/lib/email-bm25";
import {
  ensureEmailEmbeddings,
  searchEmailsWithEmbeddings,
} from "@/lib/email-embeddings";

export type RankedEmail = {
  score: number;
  email: EmailRow;
};

export type RrfOptions = {
  /** RRF dampening constant (default 60). */
  k?: number;
  /** How many hits to keep from each ranking before fusion. */
  topKPerList?: number;
  /** Relative weights per ranking list (same order as `rankings`). */
  weights?: number[];
};

const DEFAULT_RRF_K = 60;
const DEFAULT_TOP_K_PER_LIST = 50;
const DEFAULT_EMBED_BUDGET = 16;

/**
 * Weighted Reciprocal Rank Fusion.
 * Each list contributes `weight / (k + rank)` (rank is 0-based).
 * Only the top `topKPerList` items from each list are fused.
 */
export function reciprocalRankFusion(
  rankings: RankedEmail[][],
  options: RrfOptions = {},
): RankedEmail[] {
  const k = options.k ?? DEFAULT_RRF_K;
  const topKPerList = options.topKPerList ?? DEFAULT_TOP_K_PER_LIST;
  const weights = options.weights;

  const rrfScores = new Map<string, number>();
  const emailById = new Map<string, EmailRow>();

  rankings.forEach((ranking, listIndex) => {
    const weight = weights?.[listIndex] ?? 1;
    if (weight <= 0) return;

    const sliced = ranking.slice(0, topKPerList);
    sliced.forEach((item, rank) => {
      const prev = rrfScores.get(item.email.id) ?? 0;
      rrfScores.set(item.email.id, prev + weight / (k + rank));
      emailById.set(item.email.id, item.email);
    });
  });

  return Array.from(rrfScores.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({
      score,
      email: emailById.get(id)!,
    }));
}

/**
 * Efficient hybrid search:
 * 1. Cap embedding backfill (quota-friendly)
 * 2. BM25 over corpus + pgvector top-K in parallel
 * 3. Weighted top-K RRF fusion
 */
export async function searchEmailsWithRRF(
  query: string,
  userId: string,
  emails: EmailRow[],
): Promise<RankedEmail[]> {
  const q = query.trim();
  if (!q || emails.length === 0) return [];

  const keywords = tokenizeQuery(q);

  // Backfill a small batch of missing vectors, then retrieve.
  await ensureEmailEmbeddings(emails, { budget: DEFAULT_EMBED_BUDGET });

  const [bm25Ranking, embeddingsRanking] = await Promise.all([
    Promise.resolve(searchEmailsWithBM25(keywords, emails)),
    searchEmailsWithEmbeddings(q, userId, {
      topK: DEFAULT_TOP_K_PER_LIST,
      minScore: 0.25,
    }),
  ]);

  if (embeddingsRanking.length === 0) {
    return bm25Ranking;
  }

  // Slightly favor semantic matches while keeping keyword precision.
  return reciprocalRankFusion([bm25Ranking, embeddingsRanking], {
    k: DEFAULT_RRF_K,
    topKPerList: DEFAULT_TOP_K_PER_LIST,
    weights: [1, 1.2],
  });
}
