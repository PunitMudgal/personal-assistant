import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { listChatsByUserId, listMemoriesByUserId } from "@/db/queries";
import { toConversation } from "@/lib/conversations";
import { auth } from "@/server/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/chat");
  }

  let initialConversations: ReturnType<typeof toConversation>[] = [];
  let memories: Awaited<ReturnType<typeof listMemoriesByUserId>> = [];

  try {
    const [chats, memoryRows] = await Promise.all([
      listChatsByUserId(session.user.id),
      listMemoriesByUserId(session.user.id, { activeOnly: true, limit: 50 }),
    ]);
    initialConversations = chats.map(toConversation);
    memories = memoryRows;
  } catch (err) {
    console.error("[app/layout] Failed to load chats/memories:", err);
    // Keep the shell usable even if sidebar data fails (e.g. schema lag).
  }

  return (
    <Suspense fallback={<div className="h-dvh bg-background" />}>
      <AppShell
        initialConversations={initialConversations}
        initialMemories={memories}
      >
        {children}
      </AppShell>
    </Suspense>
  );
}
