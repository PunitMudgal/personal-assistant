"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MotionConfig } from "motion/react";

import { Sidebar } from "@/components/app/sidebar/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useConversations } from "@/hooks/use-conversations";
import type { Memory } from "@/db/schema";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type AppShellContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Chat id from `?id=` — null means a new empty chat. */
  activeChatId: string | null;
  openChat: (id: string) => void;
  newChat: () => void;
  /** Soft-set ?id= without remounting the chat page (used on first send). */
  syncChatIdToUrl: (id: string) => void;
  activeConversation: Conversation | null;
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  memories: Memory[];
  memoriesSheetOpen: boolean;
  setMemoriesSheetOpen: (open: boolean) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShell must be used within <AppShell>");
  }
  return ctx;
}

const COLLAPSED_STORAGE_KEY = "relay-sidebar-collapsed";
const COLLAPSED_EVENT = "relay-sidebar-collapsed-change";

function subscribeCollapsed(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(COLLAPSED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(COLLAPSED_EVENT, callback);
  };
}

function readCollapsed(): boolean {
  return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
}

function useCollapsedPreference(): [boolean, () => void] {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  const toggle = useCallback(() => {
    const next = !(
      window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true"
    );
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
    window.dispatchEvent(new Event(COLLAPSED_EVENT));
  }, []);

  return [collapsed, toggle];
}

export function AppShell({
  children,
  initialConversations,
  initialMemories,
}: {
  children: React.ReactNode;
  initialConversations: Conversation[];
  initialMemories: Memory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlChatId = searchParams.get("id");

  const [optimisticChatId, setOptimisticChatId] = useState<string | null>(null);
  // Prefer real URL id; optimistic covers soft replaceState before Next sees ?id=.
  const activeChatId = urlChatId ?? optimisticChatId;

  const [collapsed, toggleCollapsed] = useCollapsedPreference();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [memoriesSheetOpen, setMemoriesSheetOpen] = useState(false);

  const { conversations, refresh: refreshConversations } = useConversations(
    initialConversations,
  );

  const activeConversation = useMemo(
    () =>
      activeChatId
        ? (conversations.find((c) => c.id === activeChatId) ?? null)
        : null,
    [conversations, activeChatId],
  );

  const openChat = useCallback(
    (id: string) => {
      setOptimisticChatId(null);
      router.push(`/chat?id=${id}`);
      setMobileOpen(false);
    },
    [router],
  );

  const newChat = useCallback(() => {
    setOptimisticChatId(null);
    router.push("/chat");
    setMobileOpen(false);
  }, [router]);

  const syncChatIdToUrl = useCallback((id: string) => {
    window.history.replaceState(null, "", `/chat?id=${id}`);
    setOptimisticChatId(id);
  }, []);

  const value = useMemo<AppShellContextValue>(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      activeChatId,
      openChat,
      newChat,
      syncChatIdToUrl,
      activeConversation,
      conversations,
      refreshConversations,
      memories: initialMemories,
      memoriesSheetOpen,
      setMemoriesSheetOpen,
    }),
    [
      collapsed,
      toggleCollapsed,
      mobileOpen,
      activeChatId,
      openChat,
      newChat,
      syncChatIdToUrl,
      activeConversation,
      conversations,
      refreshConversations,
      initialMemories,
      memoriesSheetOpen,
    ],
  );

  return (
    <AppShellContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
          <aside className="hidden lg:block">
            <Sidebar
              collapsed={collapsed}
              onToggleCollapse={toggleCollapsed}
              chatId={activeChatId}
              conversations={conversations}
              memories={initialMemories}
              onSelectConversation={openChat}
              onNewChat={newChat}
              memoriesSheetOpen={memoriesSheetOpen}
              onMemoriesSheetOpenChange={setMemoriesSheetOpen}
            />
          </aside>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="left"
              className="w-[300px] border-border p-0 [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Conversations</SheetTitle>
              <Sidebar
                collapsed={false}
                chatId={activeChatId}
                conversations={conversations}
                memories={initialMemories}
                onSelectConversation={openChat}
                onNewChat={newChat}
                inSheet
              />
            </SheetContent>
          </Sheet>

          <main className={cn("flex min-h-0 min-w-0 flex-1 flex-col")}>
            {children}
          </main>
        </div>
      </MotionConfig>
    </AppShellContext.Provider>
  );
}
