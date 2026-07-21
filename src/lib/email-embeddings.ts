import { createHash } from "node:crypto";
import { embed, embedMany } from "ai";
import { and, asc, cosineDistance, eq, gt, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import type { EmailRow } from "@/db/queries";
import { emailEmbeddings, emails } from "@/db/schema";
import {
  EMAIL_EMBEDDING_CACHE_KEY,
  emailEmbeddingModel,
  emailEmbeddingProviderOptions,
  emailQueryEmbeddingProviderOptions,
} from "../../models";

export type EmailEmbeddingSearchHit = {
  score: number;
  email: EmailRow;
};

const BATCH_SIZE = 16;
/** Max new embeddings to generate per search request (protects free-tier quota). */
const DEFAULT_EMBED_BUDGET = 16;
const DEFAULT_VECTOR_TOP_K = 50;
const DEFAULT_MIN_SIMILARITY = 0.25;

function emailEmbeddingText(email: Pick<EmailRow, "subject" | "body">): string {
  return `${email.subject ?? ""} ${email.body ?? ""}`.trim();
}

export function hashEmailContent(
  email: Pick<EmailRow, "subject" | "body">,
): string {
  return createHash("sha256")
    .update(emailEmbeddingText(email))
    .digest("hex");
}

async function findEmailsNeedingEmbeddings(
  corpus: EmailRow[],
): Promise<EmailRow[]> {
  if (corpus.length === 0) return [];

  const cachedRows = await db
    .select({
      emailId: emailEmbeddings.emailId,
      model: emailEmbeddings.model,
      contentHash: emailEmbeddings.contentHash,
    })
    .from(emailEmbeddings)
    .where(
      inArray(
        emailEmbeddings.emailId,
        corpus.map((e) => e.id),
      ),
    );

  const cachedById = new Map(
    cachedRows.map((row) => [row.emailId, row] as const),
  );

  return corpus.filter((email) => {
    const cached = cachedById.get(email.id);
    if (!cached) return true;
    if (cached.model !== EMAIL_EMBEDDING_CACHE_KEY) return true;
    return cached.contentHash !== hashEmailContent(email);
  });
}

/**
 * Upsert embeddings for missing/stale emails, capped by `budget` per call.
 * Returns how many were newly written.
 */
export async function ensureEmailEmbeddings(
  corpus: EmailRow[],
  options: { budget?: number } = {},
): Promise<number> {
  const budget = options.budget ?? DEFAULT_EMBED_BUDGET;
  const needing = await findEmailsNeedingEmbeddings(corpus);
  if (needing.length === 0 || budget <= 0) return 0;

  const toGenerate = needing.slice(0, budget);
  console.log(
    `Embedding ${toGenerate.length}/${needing.length} missing email(s) [${EMAIL_EMBEDDING_CACHE_KEY}]`,
  );

  let written = 0;

  for (let i = 0; i < toGenerate.length; i += BATCH_SIZE) {
    const batch = toGenerate.slice(i, i + BATCH_SIZE);

    let vectors: number[][];
    try {
      const result = await embedMany({
        model: emailEmbeddingModel,
        values: batch.map(emailEmbeddingText),
        providerOptions: emailEmbeddingProviderOptions,
        maxRetries: 1,
      });
      vectors = result.embeddings;
    } catch (err) {
      console.warn(
        "Embedding backfill stopped:",
        err instanceof Error ? err.message : err,
      );
      break;
    }

    const now = new Date();
    await Promise.all(
      batch.map(async (email, j) => {
        const embedding = vectors[j]!;
        const contentHash = hashEmailContent(email);

        await db
          .insert(emailEmbeddings)
          .values({
            emailId: email.id,
            model: EMAIL_EMBEDDING_CACHE_KEY,
            contentHash,
            embedding,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: emailEmbeddings.emailId,
            set: {
              model: EMAIL_EMBEDDING_CACHE_KEY,
              contentHash,
              embedding,
              updatedAt: now,
            },
          });
        written += 1;
      }),
    );
  }

  return written;
}

/**
 * Semantic top-K via pgvector (HNSW) — does not load all vectors into Node.
 */
export async function searchEmailsWithEmbeddings(
  query: string,
  userId: string,
  options: { topK?: number; minScore?: number } = {},
): Promise<EmailEmbeddingSearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const topK = options.topK ?? DEFAULT_VECTOR_TOP_K;
  const minScore = options.minScore ?? DEFAULT_MIN_SIMILARITY;

  try {
    const { embedding: queryEmbedding } = await embed({
      model: emailEmbeddingModel,
      value: q,
      providerOptions: emailQueryEmbeddingProviderOptions,
      maxRetries: 1,
    });

    const distance = cosineDistance(
      emailEmbeddings.embedding,
      queryEmbedding,
    );
    const similarity = sql<number>`1 - (${distance})`;

    const rows = await db
      .select({
        id: emails.id,
        from: emails.from,
        to: emails.to,
        subject: emails.subject,
        body: emails.body,
        sentAt: emails.sentAt,
        createdAt: emails.createdAt,
        score: similarity,
      })
      .from(emailEmbeddings)
      .innerJoin(emails, eq(emails.id, emailEmbeddings.emailId))
      .where(
        and(
          eq(emails.userId, userId),
          eq(emailEmbeddings.model, EMAIL_EMBEDDING_CACHE_KEY),
          gt(similarity, minScore),
        ),
      )
      .orderBy(asc(distance))
      .limit(topK);

    const results = rows.map((row) => ({
      score: Number(row.score),
      email: {
        id: row.id,
        from: row.from,
        to: row.to,
        subject: row.subject,
        body: row.body,
        sentAt: row.sentAt,
        createdAt: row.createdAt,
      },
    }));

    console.log("Embedding search results:", results.length);
    return results;
  } catch (err) {
    console.warn(
      "Embedding search unavailable; falling back to BM25-only.",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}
