"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader } from "@/components/app/sidebar/sidebar-header";
import { SidebarSearch } from "@/components/app/sidebar/sidebar-search";
import { SidebarSection } from "@/components/app/sidebar/sidebar-section";
import { SidebarChatItem } from "@/components/app/sidebar/sidebar-chat-item";
import { SidebarFooter } from "@/components/app/sidebar/sidebar-footer";
import { mockConversations } from "@/lib/mock/conversations";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat?: () => void;
  inSheet?: boolean;
};

const EXPANDED_WIDTH = 288;
const COLLAPSED_WIDTH = 72;

export function Sidebar({
  collapsed,
  onToggleCollapse,
  activeId,
  onSelectConversation,
  onNewChat,
  inSheet,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Conversation[]>(mockConversations);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
    );
  }, [items, query]);

  const favourites = useMemo(
    () => visible.filter((c) => c.favourite),
    [visible]
  );
  const recent = useMemo(
    () => visible.filter((c) => !c.favourite),
    [visible]
  );

  const toggleFavourite = (id: string) => {
    setItems((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, favourite: !c.favourite } : c
      )
    );
  };

  const handleNewChat = () => {
    onNewChat?.();
  };

  const hasResults = visible.length > 0;

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground"
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        inSheet={inSheet}
        onToggleCollapse={onToggleCollapse}
        onNewChat={handleNewChat}
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
                    active={c.id === activeId}
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
                    active={c.id === activeId}
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
              No chats found for &ldquo;{query}&rdquo;.
            </p>
          )
        )}
      </ScrollArea>

      <SidebarFooter collapsed={collapsed} />
    </motion.aside>
  );
}
