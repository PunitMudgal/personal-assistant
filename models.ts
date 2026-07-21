import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createGroq } from "@ai-sdk/groq";

import { EMAIL_EMBEDDING_DIMENSIONS } from "@/db/schema";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROTUER_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const primaryProvider = google("gemini-3.5-flash");
export const secondaryProvider = openrouter("google/gemma-4-31b-it:free");
export const tertiaryProvider = groq("llama-3.3-70b-versatile"); // generate title

/** Embedding model id (Google). text-embedding-004 is deprecated — use gemini-embedding-001. */
export const EMAIL_EMBEDDING_MODEL_ID = "gemini-embedding-001" as const;

/** Cache key stored in DB — bump when model or dimensions change. */
export const EMAIL_EMBEDDING_CACHE_KEY = `google-${EMAIL_EMBEDDING_MODEL_ID}-${EMAIL_EMBEDDING_DIMENSIONS}`;

export const emailEmbeddingModel = google.embedding(EMAIL_EMBEDDING_MODEL_ID);

export const emailEmbeddingProviderOptions = {
  google: {
    outputDimensionality: EMAIL_EMBEDDING_DIMENSIONS,
    taskType: "RETRIEVAL_DOCUMENT" as const,
  },
};

/** Query-side embedding options (pair with RETRIEVAL_DOCUMENT docs). */
export const emailQueryEmbeddingProviderOptions = {
  google: {
    outputDimensionality: EMAIL_EMBEDDING_DIMENSIONS,
    taskType: "RETRIEVAL_QUERY" as const,
  },
};
