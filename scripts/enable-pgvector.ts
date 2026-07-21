/**
 * Enable pgvector on Neon, then apply pending Drizzle migrations.
 *
 * Usage: npx tsx scripts/enable-pgvector.ts
 *
 * CREATE EXTENSION often cannot run inside drizzle-kit's migration transaction,
 * so we enable it first, then run `drizzle-kit migrate`.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(url);

  console.log("Enabling pgvector extension…");
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  const rows = await sql`
    SELECT extname, extversion
    FROM pg_extension
    WHERE extname = 'vector'
  `;
  console.log("pgvector:", rows[0] ?? "(missing)");

  console.log(
    "Extension ready. Next: npm run db:migrate  (or npm run db:apply-email-embeddings if migrate fails)",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
