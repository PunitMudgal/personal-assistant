"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { isChatBusy, type ChatUIMessage } from "@/lib/chat";

type UseChatThreadOptions = {
  chatId: string;
  userId: string;
  /** True when URL has no ?id= (brand-new thread). */
  isNewChat: boolean;
  initialMessages: ChatUIMessage[];
  onRefreshSidebar: () => void | Promise<void>;
  /** Soft-update `/chat?id=` without remounting the page. */
  onSyncChatIdToUrl?: (id: string) => void;
};

/**
 * One chat thread powered by AI SDK v7 `useChat`.
 * Remount with `key={chatId}` when the URL chat changes.
 */
export function useChatThread({
  chatId,
  userId,
  isNewChat,
  initialMessages,
  onRefreshSidebar,
  onSyncChatIdToUrl,
}: UseChatThreadOptions) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport<ChatUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages, id }) {
          return {
            body: { messages, id, userId },
          };
        },
      }),
    [userId],
  );

  const { messages, sendMessage, status, stop } = useChat<ChatUIMessage>({
    id: chatId,
    messages: initialMessages,
    transport,
    onData(part) {
      if (
        part.type === "data-frontend-action" &&
        part.data === "refresh-sidebar"
      ) {
        void onRefreshSidebar();
      }
    },
  });

  const isBusy = isChatBusy(status);

  async function submit() {
    const text = input.trim();
    if (!text || isBusy) return;

    setInput("");

    // Soft-update the URL so Next does not remount this page mid-stream.
    if (isNewChat) {
      onSyncChatIdToUrl?.(chatId);
    }

    await sendMessage({ text });
  }

  return {
    messages,
    input,
    setInput,
    submit,
    isBusy,
    stop,
  };
}
