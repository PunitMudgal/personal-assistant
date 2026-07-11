"use client";

import { useState } from "react";

import { ChatEmptyState } from "@/components/app/chat-empty-state";
import { ChatHeader } from "@/components/app/chat-header";
import { ChatMessages } from "@/components/app/chat-messages";
import { ChatPromptInput } from "@/components/app/chat-prompt-input";
import { useAppShell } from "@/components/app/app-shell";

export default function ChatPage() {
  const { activeConversation } = useAppShell();
  const [input, setInput] = useState("");

  const hasThread = activeConversation !== null;

  const handleSubmit = () => {
    // UI only — no AI logic, backend, or streaming.
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      {hasThread ? (
        <ChatMessages />
      ) : (
        <ChatEmptyState onPick={(text) => setInput(text)} />
      )}
      <ChatPromptInput
        value={input}
        onValueChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
