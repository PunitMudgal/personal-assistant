"use client";

import { useCallback, useState } from "react";

import { listChatsAction } from "@/app/actions/chats";
import type { Conversation } from "@/lib/types";

/** Sidebar list: seeded from the server, refreshable after title/create events. */
export function useConversations(initialConversations: Conversation[]) {
  const [refreshedConversations, setRefreshedConversations] = useState<
    Conversation[] | null
  >(null);
  const [prevInitialConversations, setPrevInitialConversations] = useState(
    initialConversations,
  );

  if (initialConversations !== prevInitialConversations) {
    setPrevInitialConversations(initialConversations);
    setRefreshedConversations(null);
  }

  const conversations = refreshedConversations ?? initialConversations;

  const refresh = useCallback(async () => {
    const result = await listChatsAction();
    if (result.success) setRefreshedConversations(result.data);
  }, []);

  return { conversations, refresh };
}
