import type { EmailRow } from "@/db/queries";
import { searchEmailsWithBM25, tokenizeQuery } from "@/lib/email-bm25";
import { searchEmailsWithEmbeddings } from "@/lib/email-embeddings";

export type RankedEmail = {
  score: number;
  email: EmailRow;
};

/** Standard RRF constant — dampens the impact of very high ranks. */
const RRF_K = 60;

/**
 * Reciprocal Rank Fusion: merge multiple ranked lists by position, not raw score.
 * Each list contributes `1 / (k + rank)` per document (rank is 0-based).
 */
export function reciprocalRankFusion(
  rankings: RankedEmail[][],
): RankedEmail[] {
  const rrfScores = new Map<string, number>();
  const emailById = new Map<string, EmailRow>();

  for (const ranking of rankings) {
    ranking.forEach((item, rank) => {
      const prev = rrfScores.get(item.email.id) ?? 0;
      rrfScores.set(item.email.id, prev + 1 / (RRF_K + rank));
      emailById.set(item.email.id, item.email);
    });
  }

  return Array.from(rrfScores.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({
      score,
      email: emailById.get(id)!,
    }));
}

/**
 * Hybrid search: BM25 (keyword) + embedding (semantic) fused with RRF.
 * If embeddings fail (e.g. API quota), returns BM25-only ranking.
 */
export async function searchEmailsWithRRF(
  query: string,
  emails: EmailRow[],
): Promise<RankedEmail[]> {
  const q = query.trim();
  if (!q || emails.length === 0) return [];

  const keywords = tokenizeQuery(q);
  const bm25Ranking = searchEmailsWithBM25(keywords, emails);

  const embeddingsRanking = await searchEmailsWithEmbeddings(q, emails);
  if (embeddingsRanking.length === 0) {
    return bm25Ranking;
  }

  return reciprocalRankFusion([bm25Ranking, embeddingsRanking]);
}
