import type { UIMessage } from "ai";
import { redirect } from "next/navigation";

import { ChatView } from "@/components/app/chat-view";
import { getChatById, getMessagesByChatId } from "@/db/queries";
import type { ChatUIMessage } from "@/lib/chat";
import { auth } from "@/server/auth";

function mapMessages(messages: UIMessage[]): ChatUIMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: msg.parts,
    ...(msg.metadata != null ? { metadata: msg.metadata } : {}),
  })) as ChatUIMessage[];
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/chat");
  }

  const { id } = await searchParams;
  const userId = session.user.id;

  const chatId = id ?? crypto.randomUUID();
  const isNewChat = !id;

  let initialMessages: ChatUIMessage[] = [];

  if (id) {
    const chat = await getChatById(id);
    if (chat && chat.userId === userId) {
      initialMessages = mapMessages(await getMessagesByChatId(id));
    }
  }

  return (
    <ChatView
      key={chatId}
      chatId={chatId}
      userId={userId}
      isNewChat={isNewChat}
      initialMessages={initialMessages}
    />
  );
}
