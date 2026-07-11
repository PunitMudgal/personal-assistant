"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { MotionConfig } from "motion/react";
import type { Conversation } from "@/lib/types";
import { mockConversations } from "@/lib/mock/conversations";
import { Sidebar } from "@/components/app/sidebar/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AppShellContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  activeConversation: Conversation | null;
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
    () => false // SSR snapshot
  );

  const toggle = useCallback(() => {
    const next = !(window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true");
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
    window.dispatchEvent(new Event(COLLAPSED_EVENT));
  }, []);

  return [collapsed, toggle];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, toggleCollapsed] = useCollapsedPreference();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(mockConversations[0].id);

  const activeConversation = useMemo(
    () => mockConversations.find((c) => c.id === activeId) ?? null,
    [activeId]
  );

  const value = useMemo<AppShellContextValue>(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      activeId,
      setActiveId,
      activeConversation,
    }),
    [collapsed, toggleCollapsed, mobileOpen, activeId, activeConversation]
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  const handleNewChat = () => {
    setActiveId(null);
    setMobileOpen(false);
  };

  return (
    <AppShellContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <Sidebar
              collapsed={collapsed}
              onToggleCollapse={toggleCollapsed}
              activeId={activeId}
              onSelectConversation={handleSelect}
              onNewChat={handleNewChat}
            />
          </aside>

          {/* Mobile sidebar */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="left"
              className="w-[300px] border-border p-0 [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Conversations</SheetTitle>
              <Sidebar
                collapsed={false}
                activeId={activeId}
                onSelectConversation={handleSelect}
                onNewChat={handleNewChat}
                inSheet
              />
            </SheetContent>
          </Sheet>

          <main className={cn("flex min-w-0 flex-1 flex-col")}>{children}</main>
        </div>
      </MotionConfig>
    </AppShellContext.Provider>
  );
}
