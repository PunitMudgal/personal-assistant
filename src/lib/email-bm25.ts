import BM25 from "okapibm25";

export type Bm25EmailDoc = {
  id: string;
  from: string | null;
  subject: string | null;
  body: string | null;
  sentAt: Date | null;
  createdAt: Date;
};

/**
 * Rank emails with Okapi BM25 over subject + from + body.
 * Returns matches sorted by score descending (score > 0 only).
 */
export function searchEmailsWithBM25<T extends Bm25EmailDoc>(
  keywords: string[],
  emails: T[],
): Array<{ score: number; email: T }> {
  if (keywords.length === 0 || emails.length === 0) return [];

  // Lowercase corpus so keyword matching is case-insensitive.
  const corpus = emails.map((email) =>
    `${email.subject ?? ""} ${email.from ?? ""} ${email.body ?? ""}`.toLowerCase(),
  );

  const scores = BM25(corpus, keywords) as number[];

  return scores
    .map((score, idx) => ({ score, email: emails[idx]! }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Split a free-text query into BM25 keywords (alphanumeric tokens). */
export function tokenizeQuery(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter(Boolean);
}
