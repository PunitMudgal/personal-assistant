import { and, asc, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import type { UIMessage } from "ai";
import { db } from "./index";
import {
  chats,
  emails,
  messages,
  memories,
  type Chat,
  type Memory,
  type MessageRole,
} from "./schema";

function toMessageRows(chatId: string, uiMessages: UIMessage[]) {
  return uiMessages.map((message) => ({
    id: message.id,
    chatId,
    role: message.role as MessageRole,
    parts: message.parts,
    metadata: message.metadata ?? null,
  }));
}

export async function getChatById(id: string): Promise<Chat | null> {
  const [chat] = await db.select().from(chats).where(eq(chats.id, id)).limit(1);
  return chat ?? null;
}

export async function getChatWithMessages(id: string) {
  return db.query.chats.findFirst({
    where: eq(chats.id, id),
    with: {
      messages: {
        orderBy: (m, { asc: orderAsc }) => [orderAsc(m.createdAt)],
      },
    },
  });
}

export async function getMessagesByChatId(chatId: string): Promise<UIMessage[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: row.parts,
    ...(row.metadata != null ? { metadata: row.metadata } : {}),
  })) as UIMessage[];
}

export async function listChatsByUserId(
  userId: string,
  options?: { includeArchived?: boolean; limit?: number },
) {
  const includeArchived = options?.includeArchived ?? false;
  const limit = options?.limit ?? 50;

  const conditions = includeArchived
    ? [eq(chats.userId, userId)]
    : [eq(chats.userId, userId), isNull(chats.archivedAt)];

  return db
    .select()
    .from(chats)
    .where(and(...conditions))
    .orderBy(desc(chats.updatedAt))
    .limit(limit);
}

export async function createChat({
  id,
  userId,
  title,
  initialMessages,
  initialMessage,
}: {
  id: string;
  userId: string;
  title?: string;
  initialMessages?: UIMessage[];
  /** Alias used by the prompt-kit route template. */
  initialMessage?: UIMessage[];
}): Promise<Chat> {
  const seedMessages = initialMessages ?? initialMessage ?? [];

  const [chat] = await db
    .insert(chats)
    .values({
      id,
      userId,
      title: title ?? null,
    })
    .returning();

  if (!chat) {
    throw new Error("Failed to create chat");
  }

  if (seedMessages.length > 0) {
    await db
      .insert(messages)
      .values(toMessageRows(id, seedMessages))
      .onConflictDoNothing({ target: messages.id });
  }

  return chat;
}

export async function appendToChatMessages(
  chatId: string,
  newMessages: UIMessage[],
): Promise<void> {
  if (newMessages.length === 0) return;

  await db
    .insert(messages)
    .values(toMessageRows(chatId, newMessages))
    .onConflictDoNothing({ target: messages.id });

  await db
    .update(chats)
    .set({ updatedAt: new Date() })
    .where(eq(chats.id, chatId));
}

export async function updateChat(
  id: string,
  data: {
    title?: string | null;
    summary?: string | null;
    metadata?: Record<string, unknown>;
    archivedAt?: Date | null;
  },
): Promise<Chat | null> {
  const [updated] = await db
    .update(chats)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(chats.id, id))
    .returning();

  return updated ?? null;
}

// Memories
export async function getMemoryById(id: string): Promise<Memory | null> {
  const [memory] = await db
    .select()
    .from(memories)
    .where(eq(memories.id, id))
    .limit(1);
  return memory ?? null;
}

/** Ownership-scoped read — prefer this over getMemoryById in request handlers. */
export async function getMemoryByIdForUser(
  id: string,
  userId: string,
): Promise<Memory | null> {
  const [memory] = await db
    .select()
    .from(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .limit(1);
  return memory ?? null;
}

export async function listMemoriesByUserId(
  userId: string,
  options?: { category?: string; activeOnly?: boolean; limit?: number },
): Promise<Memory[]> {
  const activeOnly = options?.activeOnly ?? true;
  const limit = options?.limit ?? 50;

  const conditions = [eq(memories.userId, userId)];
  if (activeOnly) conditions.push(eq(memories.isActive, true));
  if (options?.category) conditions.push(eq(memories.category, options.category));

  return db
    .select()
    .from(memories)
    .where(and(...conditions))
    .orderBy(desc(memories.importance), desc(memories.updatedAt))
    .limit(limit);
}

export async function createMemory({
  userId,
  content,
  category,
  importance,
  sourceChatId,
  sourceMessageId,
  metadata,
}: {
  userId: string;
  content: string;
  category?: string | null;
  importance?: number;
  sourceChatId?: string | null;
  sourceMessageId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<Memory> {
  const [memory] = await db
    .insert(memories)
    .values({
      userId,
      content,
      category: category ?? null,
      importance: importance ?? 0,
      sourceChatId: sourceChatId ?? null,
      sourceMessageId: sourceMessageId ?? null,
      metadata: metadata ?? {},
    })
    .returning();

  if (!memory) {
    throw new Error("Failed to create memory");
  }

  return memory;
}

export async function updateMemory(
  id: string,
  userId: string,
  data: {
    content?: string;
    category?: string | null;
    importance?: number;
    metadata?: Record<string, unknown>;
    isActive?: boolean;
    sourceChatId?: string | null;
    sourceMessageId?: string | null;
  },
): Promise<Memory | null> {
  const [updated] = await db
    .update(memories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .returning();

  return updated ?? null;
}

/** Soft-delete: keeps the row for audit/history but hides it from active recall. */
export async function deactivateMemory(
  id: string,
  userId: string,
): Promise<Memory | null> {
  return updateMemory(id, userId, { isActive: false });
}

/** Re-enable a previously deactivated memory. */
export async function activateMemory(
  id: string,
  userId: string,
): Promise<Memory | null> {
  return updateMemory(id, userId, { isActive: true });
}

/** Permanent delete — prefer deactivateMemory unless the row must be removed. */
export async function deleteMemory(
  id: string,
  userId: string,
): Promise<Memory | null> {
  const [deleted] = await db
    .delete(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .returning();

  return deleted ?? null;
}

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

/** User-scoped email archive: optional substring search, newest first, paginated. */
export async function listEmailsByUserId(
  userId: string,
  options: { q?: string; page: number; perPage: number },
): Promise<{ items: EmailListItem[]; total: number }> {
  const page = Math.max(1, options.page);
  const perPage = options.perPage;
  const offset = (page - 1) * perPage;
  const q = options.q?.trim() ?? "";

  const conditions = [eq(emails.userId, userId)];
  if (q) {
    const pattern = `%${q}%`;
    conditions.push(
      or(
        ilike(emails.subject, pattern),
        ilike(emails.from, pattern),
        ilike(emails.body, pattern),
      )!,
    );
  }

  const where = and(...conditions);

  const [totalRow] = await db
    .select({ value: count() })
    .from(emails)
    .where(where);

  const rows = await db
    .select({
      id: emails.id,
      from: emails.from,
      subject: emails.subject,
      body: emails.body,
      sentAt: emails.sentAt,
      createdAt: emails.createdAt,
    })
    .from(emails)
    .where(where)
    .orderBy(desc(sql`coalesce(${emails.sentAt}, ${emails.createdAt})`))
    .limit(perPage)
    .offset(offset);

  return {
    total: totalRow?.value ?? 0,
    items: rows.map((row) => ({
      id: row.id,
      from: row.from,
      subject: row.subject,
      preview: truncateEmailPreview(row.body),
      body: row.body,
      sentAt: (row.sentAt ?? row.createdAt)?.toISOString() ?? null,
    })),
  };
}

