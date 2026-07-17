"use client";

import type { UIMessage } from "ai";

import { ChatMessage } from "@/components/app/chat-message";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";

export function ChatMessages({ messages }: { messages: UIMessage[] }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ChatContainerContent>
        <ChatContainerScrollAnchor />
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <ScrollButton className="pointer-events-auto shadow-md" />
        </div>
      </ChatContainerRoot>
    </div>
  );
}
