import { tool } from "ai";
import { z } from "zod";

import { listEmailRowsByUserId } from "@/db/queries";
import { searchEmailsWithBM25 } from "@/lib/email-bm25";
import {
  ensureEmailEmbeddings,
  searchEmailsWithEmbeddings,
} from "@/lib/email-embeddings";
import { reciprocalRankFusion } from "@/lib/email-rrf";

const TOOL_TOP_K = 30;
const TOOL_RESULT_LIMIT = 10;

/**
 * Factory so the tool is always scoped to the signed-in user.
 */
export function createSearchTool(userId: string) {
  return tool({
    description:
      "Search the user's email archive with keyword (BM25) and semantic (embedding) search, fused by reciprocal rank fusion. Use for questions about emails, senders, subjects, or past conversations in mail.",
    inputSchema: z.object({
      keywords: z
        .array(z.string())
        .describe(
          "Exact keywords for BM25 search (names, amounts, IDs, specific terms)",
        )
        .optional(),
      searchQuery: z
        .string()
        .describe(
          "Natural language query for semantic search (broader concepts and paraphrases)",
        )
        .optional(),
    }),
    execute: async ({ keywords, searchQuery }) => {
      const keywordList =
        keywords?.map((k) => k.trim().toLowerCase()).filter(Boolean) ?? [];
      const semanticQuery = searchQuery?.trim() ?? "";

      if (keywordList.length === 0 && !semanticQuery) {
        return {
          emails: [],
          error: "Provide keywords and/or searchQuery.",
        };
      }

      const corpus = await listEmailRowsByUserId(userId);
      if (corpus.length === 0) {
        return { emails: [], message: "No emails in archive." };
      }

      // Warm a small batch of missing embeddings when doing semantic search.
      if (semanticQuery) {
        await ensureEmailEmbeddings(corpus, { budget: 16 });
      }

      const [bm25Results, embeddingResults] = await Promise.all([
        Promise.resolve(
          keywordList.length > 0
            ? searchEmailsWithBM25(keywordList, corpus)
            : [],
        ),
        semanticQuery
          ? searchEmailsWithEmbeddings(semanticQuery, userId, {
              topK: TOOL_TOP_K,
              minScore: 0.2,
            })
          : Promise.resolve([]),
      ]);

      const rankings = [
        bm25Results.slice(0, TOOL_TOP_K),
        embeddingResults.slice(0, TOOL_TOP_K),
      ].filter((list) => list.length > 0);

      if (rankings.length === 0) {
        return { emails: [] };
      }

      const fused =
        rankings.length === 1
          ? rankings[0]!
          : reciprocalRankFusion(rankings, {
              topKPerList: TOOL_TOP_K,
              weights: [1, 1.2],
            });

      const emails = fused
        .filter((r) => r.score > 0)
        .slice(0, TOOL_RESULT_LIMIT)
        .map(({ email, score }) => ({
          id: email.id,
          from: email.from,
          to: email.to,
          subject: email.subject,
          body: email.body,
          sentAt: (email.sentAt ?? email.createdAt)?.toISOString() ?? null,
          score,
        }));

      return { emails };
    },
  });
}
