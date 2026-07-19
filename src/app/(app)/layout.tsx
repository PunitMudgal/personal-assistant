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

  const [chats, memories] = await Promise.all([
    listChatsByUserId(session.user.id),
    listMemoriesByUserId(session.user.id, { activeOnly: true, limit: 50 }),
  ]);

  const initialConversations = chats.map(toConversation);

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
