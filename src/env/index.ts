import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().min(1),
  GOOGLE_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().optional(),
  OPENROTUER_API_KEY: z.string().optional(),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.union([z.string().url(), z.literal("")]).optional(),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
});

const result = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY || undefined,
  OPENROTUER_API_KEY: process.env.OPENROTUER_API_KEY || undefined,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL || undefined,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
});

if (!result.success) {
  throw new Error(
    `Invalid environment variables for ${process.env.NODE_ENV ?? "development"}:\n${result.error.message}`,
  );
}

export const env = result.data;
export type Env = typeof env;
