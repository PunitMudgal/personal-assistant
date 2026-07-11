"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarSearchProps = {
  value: string;
  onChange: (value: string) => void;
  collapsed: boolean;
};

export function SidebarSearch({ value, onChange, collapsed }: SidebarSearchProps) {
  if (collapsed) return null;

  return (
    <div className="px-3 pb-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search chats"
          className={cn(
            "h-8 w-full rounded-lg border border-transparent bg-muted/60 pl-8 pr-7 text-sm text-foreground",
            "placeholder:text-muted-foreground outline-none transition-colors",
            "focus-visible:border-border focus-visible:bg-background"
          )}
        />
        {value.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
