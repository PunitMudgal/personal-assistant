"use client";

import { useAppShell } from "@/components/app/app-shell";
import { ChatEmptyState } from "@/components/app/chat-empty-state";
import { ChatHeader } from "@/components/app/chat-header";
import { ChatMessages } from "@/components/app/chat-messages";
import { ChatPromptInput } from "@/components/app/chat-prompt-input";
import { useChatThread } from "@/hooks/use-chat-thread";
import type { ChatUIMessage } from "@/lib/chat";

type ChatViewProps = {
  chatId: string;
  userId: string;
  isNewChat: boolean;
  initialMessages: ChatUIMessage[];
};

/** Client chat UI — receives server-loaded props */
export function ChatView({
  chatId,
  userId,
  isNewChat,
  initialMessages,
}: ChatViewProps) {
  const { refreshConversations, syncChatIdToUrl } = useAppShell();

  const chat = useChatThread({
    chatId,
    userId,
    isNewChat,
    initialMessages,
    onRefreshSidebar: refreshConversations,
    onSyncChatIdToUrl: syncChatIdToUrl,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />

      {chat.messages.length > 0 ? (
        <ChatMessages messages={chat.messages} />
      ) : (
        <ChatEmptyState onPick={chat.setInput} />
      )}

      <ChatPromptInput
        value={chat.input}
        onValueChange={chat.setInput}
        onSubmit={() => {
          void chat.submit();
        }}
        isLoading={chat.isBusy}
      />
    </div>
  );
}
