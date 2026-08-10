import type { Chat } from "@/db/schema";
import type { Conversation } from "@/lib/types";

/** Map a DB chat row to the sidebar conversation shape. */
export function toConversation(chat: Chat): Conversation {
  const updatedAt =
    chat.updatedAt instanceof Date
      ? chat.updatedAt.toISOString()
      : new Date(chat.updatedAt as string | number).toISOString();

  return {
    id: chat.id,
    title: chat.title?.trim() || "New conversation",
    preview: "",
    updatedAt,
    favourite: false,
  };
}
