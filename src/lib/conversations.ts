import type { Chat } from "@/db/schema";
import type { Conversation } from "@/lib/types";

/** Map a DB chat row to the sidebar conversation shape. */
export function toConversation(chat: Chat): Conversation {
  return {
    id: chat.id,
    title: chat.title?.trim() || "New conversation",
    preview: "",
    updatedAt: chat.updatedAt.toISOString(),
    favourite: false,
  };
}
