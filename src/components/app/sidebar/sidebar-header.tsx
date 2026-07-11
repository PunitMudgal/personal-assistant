"use client";

import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarHeaderProps = {
  collapsed: boolean;
  inSheet?: boolean;
  onToggleCollapse?: () => void;
  onNewChat: () => void;
};

export function SidebarHeader({
  collapsed,
  inSheet,
  onToggleCollapse,
  onNewChat,
}: SidebarHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      {/* Logo + collapse row */}
      <div className={cn("flex h-9 items-center", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? (
          <Image src="/logo-white.png" alt="Relay" width={84} height={28} priority className="h-6 w-auto object-contain invert dark:invert-0 dark:opacity-90" />
           
        ) : (
          <Image
            src="/logo2.png"
            alt="Relay"
            width={84}
            height={28}
            priority
            className="h-6 w-auto object-contain dark:invert dark:opacity-90"
          />
        )}

        {!inSheet && !collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Collapse sidebar"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      {/* New chat */}
      {collapsed ? (
        <Button
          variant="outline"
          size="icon"
          aria-label="New chat"
          onClick={onNewChat}
          className="mx-auto"
        >
          <SquarePen className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onNewChat}
        >
          <SquarePen className="size-4" />
          New chat
        </Button>
      )}

      {/* Expand toggle when collapsed (desktop only) */}
      {!inSheet && collapsed && onToggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Expand sidebar"
          onClick={onToggleCollapse}
          className="mx-auto"
        >
          <PanelLeftOpen className="size-4" />
        </Button>
      )}
    </div>
  );
}
