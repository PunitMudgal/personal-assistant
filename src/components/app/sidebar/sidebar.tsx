"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader } from "@/components/app/sidebar/sidebar-header";
import { SidebarSearch } from "@/components/app/sidebar/sidebar-search";
import { SidebarSection } from "@/components/app/sidebar/sidebar-section";
import { SidebarChatItem } from "@/components/app/sidebar/sidebar-chat-item";
import { SidebarFooter } from "@/components/app/sidebar/sidebar-footer";
import { SidebarMemories } from "@/components/app/sidebar/sidebar-memories";
import type { Memory } from "@/db/schema";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  /** null = new chat (no ?id= in the URL). */
  chatId: string | null;
  conversations: Conversation[];
  memories: Memory[];
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  inSheet?: boolean;
  memoriesSheetOpen?: boolean;
  onMemoriesSheetOpenChange?: (open: boolean) => void;
};

const EXPANDED_WIDTH = 288;
const COLLAPSED_WIDTH = 72;

export function Sidebar({
  collapsed,
  onToggleCollapse,
  chatId,
  conversations,
  memories,
  onSelectConversation,
  onNewChat,
  inSheet,
  memoriesSheetOpen,
  onMemoriesSheetOpenChange,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(
    () => new Set(),
  );

  const items = useMemo(
    () =>
      conversations.map((c) => ({
        ...c,
        favourite: favouriteIds.has(c.id),
      })),
    [conversations, favouriteIds],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [items, query]);

  const favourites = visible.filter((c) => c.favourite);
  const recent = visible.filter((c) => !c.favourite);

  function toggleFavourite(id: string) {
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hasResults = visible.length > 0;
  const hasQuery = query.trim().length > 0;

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground",
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        inSheet={inSheet}
        onToggleCollapse={onToggleCollapse}
        onNewChat={onNewChat}
      />

      <SidebarSearch value={query} onChange={setQuery} collapsed={collapsed} />

      <ScrollArea className="flex-1 px-2 py-2">
        {hasResults ? (
          <div className="flex flex-col gap-4">
            {favourites.length > 0 && (
              <SidebarSection title="Favourites" collapsed={collapsed}>
                {favourites.map((c) => (
                  <SidebarChatItem
                    key={c.id}
                    conversation={c}
                    active={c.id === chatId}
                    collapsed={collapsed}
                    onSelect={onSelectConversation}
                    onToggleFavourite={toggleFavourite}
                  />
                ))}
              </SidebarSection>
            )}
            {recent.length > 0 && (
              <SidebarSection title="Recent" collapsed={collapsed}>
                {recent.map((c) => (
                  <SidebarChatItem
                    key={c.id}
                    conversation={c}
                    active={c.id === chatId}
                    collapsed={collapsed}
                    onSelect={onSelectConversation}
                    onToggleFavourite={toggleFavourite}
                  />
                ))}
              </SidebarSection>
            )}
          </div>
        ) : (
          !collapsed && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {hasQuery
                ? `No chats found for “${query.trim()}”.`
                : "No conversations yet. Start a new chat."}
            </p>
          )
        )}
      </ScrollArea>

      <SidebarMemories
        collapsed={collapsed}
        memories={memories}
        sheetOpen={memoriesSheetOpen}
        onSheetOpenChange={onMemoriesSheetOpenChange}
      />

      <SidebarFooter
        collapsed={collapsed}
        onOpenMemories={() => onMemoriesSheetOpenChange?.(true)}
      />
    </motion.aside>
  );
}
