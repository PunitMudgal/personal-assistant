import { createHash } from "node:crypto";
import { cosineSimilarity, embed, embedMany } from "ai";
import { inArray } from "drizzle-orm";

import { db } from "@/db";
import type { EmailRow } from "@/db/queries";
import { emailEmbeddings } from "@/db/schema";
import {
  EMAIL_EMBEDDING_CACHE_KEY,
  emailEmbeddingModel,
  emailEmbeddingProviderOptions,
  emailQueryEmbeddingProviderOptions,
} from "../../models";

export type CachedEmailEmbedding = {
  id: string;
  embedding: number[];
};

export type EmailEmbeddingSearchHit = {
  score: number;
  email: EmailRow;
};

const BATCH_SIZE = 99;

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

/**
 * Load email embeddings from Postgres (pgvector), generating and upserting
 * any misses (missing row, model change, or content change).
 *
 * Replaces the course's local JSON file cache with a DB-backed cache.
 */
export async function loadOrGenerateEmailEmbeddings(
  emails: EmailRow[],
): Promise<CachedEmailEmbedding[]> {
  if (emails.length === 0) return [];

  const ids = emails.map((e) => e.id);
  const cachedRows = await db
    .select({
      emailId: emailEmbeddings.emailId,
      model: emailEmbeddings.model,
      contentHash: emailEmbeddings.contentHash,
      embedding: emailEmbeddings.embedding,
    })
    .from(emailEmbeddings)
    .where(inArray(emailEmbeddings.emailId, ids));

  const cachedById = new Map(
    cachedRows.map((row) => [row.emailId, row] as const),
  );

  const results: CachedEmailEmbedding[] = [];
  const uncached: EmailRow[] = [];

  for (const email of emails) {
    const cached = cachedById.get(email.id);
    const contentHash = hashEmailContent(email);

    if (
      cached &&
      cached.model === EMAIL_EMBEDDING_CACHE_KEY &&
      cached.contentHash === contentHash
    ) {
      results.push({
        id: email.id,
        embedding: cached.embedding,
      });
    } else {
      uncached.push(email);
    }
  }

  if (uncached.length === 0) {
    return results;
  }

  console.log(
    `Generating embeddings for ${uncached.length} email(s) [${EMAIL_EMBEDDING_CACHE_KEY}]`,
  );

  for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
    const batch = uncached.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batchTotal = Math.ceil(uncached.length / BATCH_SIZE);
    console.log(`Embedding batch ${batchNum}/${batchTotal}`);

    const { embeddings } = await embedMany({
      model: emailEmbeddingModel,
      values: batch.map(emailEmbeddingText),
      providerOptions: emailEmbeddingProviderOptions,
    });

    const now = new Date();

    await Promise.all(
      batch.map(async (email, j) => {
        const embedding = embeddings[j]!;
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

        results.push({ id: email.id, embedding });
      }),
    );
  }

  return results;
}

/**
 * Semantic search: embed the query, score against DB-cached email vectors
 * via cosine similarity, return hits sorted by score descending.
 */
export async function searchEmailsWithEmbeddings(
  query: string,
  emails: EmailRow[],
): Promise<EmailEmbeddingSearchHit[]> {
  const q = query.trim();
  if (!q || emails.length === 0) return [];

  const cached = await loadOrGenerateEmailEmbeddings(emails);
  const emailById = new Map(emails.map((email) => [email.id, email] as const));

  const { embedding: queryEmbedding } = await embed({
    model: emailEmbeddingModel,
    value: q,
    providerOptions: emailQueryEmbeddingProviderOptions,
  });

  const results: EmailEmbeddingSearchHit[] = [];

  for (const { id, embedding } of cached) {
    const email = emailById.get(id);
    if (!email) continue;

    const score = cosineSimilarity(queryEmbedding, embedding);
    if (score > 0) {
      results.push({ score, email });
    }
  }

  results.sort((a, b) => b.score - a.score);
  console.log("Embedding search results:", results.length);
  return results;
}
