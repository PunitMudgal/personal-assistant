"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";
import { ChatMessage } from "@/components/app/chat-message";
import { mockMessages } from "@/lib/mock/messages";

export function ChatMessages() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
          {mockMessages.map((message) => (
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
