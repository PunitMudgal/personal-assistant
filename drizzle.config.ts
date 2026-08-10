import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const nodeEnv = process.env.NODE_ENV ?? "development";
config({ path: `.env.${nodeEnv}`, override: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
