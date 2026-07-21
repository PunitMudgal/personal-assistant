/**
 * Apply email_embedding table + record migration 0002.
 * Use when drizzle-kit migrate stalls after pgvector is enabled.
 *
 * Usage: npx tsx scripts/apply-email-embeddings.ts
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const sql = neon(url);

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log("pgvector ready");

  await sql`
    CREATE TABLE IF NOT EXISTS "email_embedding" (
      "email_id" uuid PRIMARY KEY NOT NULL,
      "model" text NOT NULL,
      "content_hash" text NOT NULL,
      "embedding" vector(768) NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `;
  console.log("email_embedding table ready");

  try {
    await sql`
      ALTER TABLE "email_embedding"
      ADD CONSTRAINT "email_embedding_email_id_email_id_fk"
      FOREIGN KEY ("email_id") REFERENCES "public"."email"("id")
      ON DELETE cascade ON UPDATE no action
    `;
    console.log("FK added");
  } catch (err) {
    console.log("FK skipped:", (err as Error).message);
  }

  try {
    await sql`
      CREATE INDEX IF NOT EXISTS "email_embedding_hnsw_idx"
      ON "email_embedding" USING hnsw ("embedding" vector_cosine_ops)
    `;
    console.log("HNSW index ready");
  } catch (err) {
    console.log("Index skipped:", (err as Error).message);
  }

  // Ensure drizzle migrations schema/table exist, then record 0002
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const migrationPath = path.join(
    process.cwd(),
    "drizzle",
    "0002_email_embeddings.sql",
  );
  const migrationSql = readFileSync(migrationPath, "utf8");
  const hash = createHash("sha256").update(migrationSql).digest("hex");

  const existing = await sql`
    SELECT id FROM "drizzle"."__drizzle_migrations" WHERE hash = ${hash} LIMIT 1
  `;

  if (existing.length === 0) {
    await sql`
      INSERT INTO "drizzle"."__drizzle_migrations" ("hash", "created_at")
      VALUES (${hash}, ${Date.now()})
    `;
    console.log("Recorded migration 0002_email_embeddings");
  } else {
    console.log("Migration 0002 already recorded");
  }

  const check = await sql`
    SELECT COUNT(*)::int AS n FROM "email_embedding"
  `;
  console.log("email_embedding rows:", check[0]?.n ?? 0);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
