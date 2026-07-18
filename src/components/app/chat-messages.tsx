"use client";

import type { UIMessage } from "ai";

import { ChatMessage } from "@/components/app/chat-message";
import { ThinkingBar } from "@/components/ui/thinking-bar";
import { shouldShowThinkingBar } from "@/lib/chat";

type ChatMessagesProps = {
  messages: UIMessage[];
  isBusy?: boolean;
  onStop?: () => void;
};

export function ChatMessages({
  messages,
  isBusy = false,
  onStop,
}: ChatMessagesProps) {
  const showThinking = shouldShowThinkingBar(messages, isBusy);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {showThinking ? (
          <ThinkingBar
            text="Thinking"
            stopLabel="Stop"
            onStop={onStop}
          />
        ) : null}
      </div>
    </div>
  );
}
