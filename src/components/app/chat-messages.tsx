"use client";

import type { UIMessage } from "ai";

import { ChatMessage } from "@/components/app/chat-message";

export function ChatMessages({ messages }: { messages: UIMessage[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
