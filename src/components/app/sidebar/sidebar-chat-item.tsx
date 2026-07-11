"use client";

import { MoreHorizontal, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarChatItemProps = {
  conversation: Conversation;
  active: boolean;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onToggleFavourite: (id: string) => void;
};

export function SidebarChatItem({
  conversation,
  active,
  collapsed,
  onSelect,
  onToggleFavourite,
}: SidebarChatItemProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        aria-label={conversation.title}
        onClick={() => onSelect(conversation.id)}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
          active
            ? "border-border bg-muted text-foreground"
            : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        {conversation.title.charAt(0)}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group/item relative flex items-center rounded-lg transition-colors",
        active ? "bg-muted text-foreground" : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {conversation.title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {conversation.preview}
          </span>
        </span>
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {conversation.updatedAt}
        </span>
      </button>

      {/* Hover actions */}
      <div className="absolute right-1.5 flex items-center opacity-0 transition-opacity group-hover/item:opacity-100 data-[active=true]:opacity-100" data-active={active}>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={conversation.favourite ? "Remove from favourites" : "Add to favourites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(conversation.id);
          }}
          className={cn(
            conversation.favourite && "text-foreground",
            "hover:bg-background"
          )}
        >
          <Star className={cn("size-3.5", conversation.favourite && "fill-current")} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
              className="hover:bg-background"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onSelect={() => onToggleFavourite(conversation.id)}
            >
              {conversation.favourite ? "Remove favourite" : "Add to favourites"}
            </DropdownMenuItem>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
