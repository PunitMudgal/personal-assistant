import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  uuid,
  jsonb,
  index,
  uniqueIndex,
  boolean,
  vector,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import type { UIMessage } from "ai";

/** Must match `providerOptions.google.outputDimensionality` when embedding. */
export const EMAIL_EMBEDDING_DIMENSIONS = 768;

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index("account_user_id_idx").on(account.userId),
  ],
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => [index("session_user_id_idx").on(session.userId)],
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [
    primaryKey({ columns: [vt.identifier, vt.token] }),
  ],
);

/** Synced mailbox messages for the assistant to search/act on. */
export const emails = pgTable(
  "email",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // External provider id (e.g. Gmail) — kept for sync / dedupe
    sourceId: text("source_id").notNull(),
    threadId: text("thread_id"),
    from: text("from"),
    to: text("to"),
    subject: text("subject"),
    body: text("body"),
    sentAt: timestamp("sent_at", { mode: "date" }),
    raw: jsonb("raw"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("email_user_id_source_id_uidx").on(table.userId, table.sourceId),
    index("email_user_id_idx").on(table.userId),
    index("email_user_id_sent_at_idx").on(table.userId, table.sentAt),
    index("email_thread_id_idx").on(table.threadId),
  ],
);

/**
 * Cached email embeddings for semantic / hybrid search (pgvector).
 * One row per email; regenerated when model or content hash changes.
 */
export const emailEmbeddings = pgTable(
  "email_embedding",
  {
    emailId: uuid("email_id")
      .primaryKey()
      .references(() => emails.id, { onDelete: "cascade" }),
    /** Cache key, e.g. google-gemini-embedding-001-768 */
    model: text("model").notNull(),
    /** sha256 of subject + body — invalidate when email text changes */
    contentHash: text("content_hash").notNull(),
    embedding: vector("embedding", {
      dimensions: EMAIL_EMBEDDING_DIMENSIONS,
    }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("email_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

/**
 * A conversation thread with the personal assistant.
 * IDs are text so they stay compatible with AI SDK / client-generated ids.
 */
export const chats = pgTable(
  "chat",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title"),
    /** Rolling summary for long threads — used when rebuilding agent context. */
    summary: text("summary"),
    /** Extensible agent state (pinned tools, preferences for this thread, etc.). */
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    archivedAt: timestamp("archived_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("chat_user_id_idx").on(table.userId),
    index("chat_user_id_updated_at_idx").on(table.userId, table.updatedAt),
    index("chat_user_id_archived_at_idx").on(table.userId, table.archivedAt),
  ],
);

export const messageRoleEnum = ["system", "user", "assistant", "tool"] as const;
export type MessageRole = (typeof messageRoleEnum)[number];

/** Persisted AI SDK UIMessage rows for a chat. */
export const messages = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    chatId: text("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    role: text("role", { enum: messageRoleEnum }).notNull(),
    parts: jsonb("parts").$type<UIMessage["parts"]>().notNull(),
    metadata: jsonb("metadata").$type<UIMessage["metadata"]>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("message_chat_id_idx").on(table.chatId),
    index("message_chat_id_created_at_idx").on(table.chatId, table.createdAt),
  ],
);

/**
 * Long-term memories the assistant can recall across conversations.
 * Distinct from chat messages — durable facts, preferences, and goals.
 */
export const memories = pgTable(
  "memory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    /** e.g. preference | fact | goal | person | project */
    category: text("category"),
    /** Higher = more likely to surface in agent context. */
    importance: integer("importance").default(0).notNull(),
    sourceChatId: text("source_chat_id").references(() => chats.id, {
      onDelete: "set null",
    }),
    sourceMessageId: text("source_message_id").references(() => messages.id, {
      onDelete: "set null",
    }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("memory_user_id_idx").on(table.userId),
    index("memory_user_id_updated_at_idx").on(table.userId, table.updatedAt),
    index("memory_user_id_category_idx").on(table.userId, table.category),
    index("memory_user_id_active_importance_idx").on(
      table.userId,
      table.isActive,
      table.importance,
    ),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  chats: many(chats),
  memories: many(memories),
  emails: many(emails),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  user: one(users, { fields: [emails.userId], references: [users.id] }),
  embedding: one(emailEmbeddings, {
    fields: [emails.id],
    references: [emailEmbeddings.emailId],
  }),
}));

export const emailEmbeddingsRelations = relations(emailEmbeddings, ({ one }) => ({
  email: one(emails, {
    fields: [emailEmbeddings.emailId],
    references: [emails.id],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, { fields: [chats.userId], references: [users.id] }),
  messages: many(messages),
  memories: many(memories),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  user: one(users, { fields: [memories.userId], references: [users.id] }),
  sourceChat: one(chats, {
    fields: [memories.sourceChatId],
    references: [chats.id],
  }),
  sourceMessage: one(messages, {
    fields: [memories.sourceMessageId],
    references: [messages.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type Email = typeof emails.$inferSelect;
export type EmailEmbedding = typeof emailEmbeddings.$inferSelect;
