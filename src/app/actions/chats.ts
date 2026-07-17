"use server";

import type { UIMessage } from "ai";

import {
  getChatById,
  getMessagesByChatId,
  listChatsByUserId,
} from "@/db/queries";
import { toConversation } from "@/lib/conversations";
import type { Conversation } from "@/lib/types";
import { auth } from "@/server/auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

function fail(error: string): ActionResult<never> {
  return { success: false, error };
}

async function requireUserId(): Promise<ActionResult<string>> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail("Unauthorized");
  return ok(userId);
}

/** Sidebar refresh from the client. */
export async function listChatsAction(): Promise<ActionResult<Conversation[]>> {
  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  try {
    const chats = await listChatsByUserId(authResult.data);
    return ok(chats.map(toConversation)); 
  } catch {
    return fail("Failed to list chats")
  }
}

/**
 * Load messages for a chat.
 * Returns [] when the chat does not exist yet (new draft before first send).
 */
export async function getChatMessagesAction(
  chatId: string,
): Promise<ActionResult<UIMessage[]>> {
  if (!chatId.trim()) return fail("chatId is required");

  const authResult = await requireUserId();
  if (!authResult.success) return authResult;

  try {
    const chat = await getChatById(chatId);
    if (!chat) return ok([]);
    if (chat.userId !== authResult.data) return fail("Chat not found");
    return ok(await getMessagesByChatId(chatId));
  } catch {
    return fail("Failed to load messages");
  }
}
