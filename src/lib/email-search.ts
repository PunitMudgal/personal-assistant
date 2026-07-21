import {
  listEmailRowsByUserId,
  listEmailsByUserId,
  type EmailRow,
} from "@/db/queries";
import { searchEmailsWithEmbeddings } from "@/lib/email-embeddings";

export type EmailListItem = {
  id: string;
  from: string | null;
  subject: string | null;
  preview: string;
  body: string | null;
  sentAt: string | null;
};

function truncateEmailPreview(body: string | null, max = 160): string {
  if (!body) return "";
  const t = body.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function toEmailListItem(row: EmailRow): EmailListItem {
  return {
    id: row.id,
    from: row.from,
    subject: row.subject,
    preview: truncateEmailPreview(row.body),
    body: row.body,
    sentAt: (row.sentAt ?? row.createdAt)?.toISOString() ?? null,
  };
}

/**
 * Email archive lookup for the Data page.
 * - No query: newest-first pagination from the DB
 * - With query: semantic ranking via cached pgvector embeddings + cosine similarity
 */
export async function searchUserEmails(
  userId: string,
  options: { q?: string; page: number; perPage: number },
): Promise<{ items: EmailListItem[]; total: number }> {
  const page = Math.max(1, options.page);
  const perPage = options.perPage;
  const offset = (page - 1) * perPage;
  const q = options.q?.trim() ?? "";

  if (!q) {
    const { items, total } = await listEmailsByUserId(userId, {
      page,
      perPage,
    });
    return { total, items: items.map(toEmailListItem) };
  }

  const corpus = await listEmailRowsByUserId(userId);
  const ranked = await searchEmailsWithEmbeddings(q, corpus);
  const pageRows = ranked.slice(offset, offset + perPage);

  return {
    total: ranked.length,
    items: pageRows.map(({ email }) => toEmailListItem(email)),
  };
}
