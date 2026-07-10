import { and, asc, desc, eq, isNull } from "drizzle-orm";
import type { UIMessage } from "ai";
import { db } from "./index";
import {
  chats,
  messages,
  memories,
  type Chat,
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

export async function listMemoriesByUserId(
  userId: string,
  options?: { category?: string; activeOnly?: boolean; limit?: number },
) {
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
