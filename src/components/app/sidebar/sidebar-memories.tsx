"use client";

import { useState } from "react";
import { Brain, Plus } from "lucide-react";

import { MemoryCreateDialog } from "@/components/app/sidebar/memory-create-dialog";
import { MemoryDetailDialog } from "@/components/app/sidebar/memory-detail-dialog";
import { SidebarSection } from "@/components/app/sidebar/sidebar-section";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Memory } from "@/db/schema";
import { cn } from "@/lib/utils";

type SidebarMemoriesProps = {
  collapsed: boolean;
  memories: Memory[];
  sheetOpen?: boolean;
  onSheetOpenChange?: (open: boolean) => void;
};

function truncate(text: string, max = 48): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function MemoryList({
  memories,
  onSelect,
  compact,
}: {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  compact?: boolean;
}) {
  if (memories.length === 0) {
    return (
      <p
        className={cn(
          "px-2 text-xs text-muted-foreground",
          compact ? "py-2 text-center" : "py-1",
        )}
      >
        No memories yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {memories.map((memory) => (
        <button
          key={memory.id}
          type="button"
          onClick={() => onSelect(memory)}
          className="flex w-full flex-col gap-0.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
        >
          <span className="line-clamp-2 text-sm text-foreground">
            {truncate(memory.content)}
          </span>
          {memory.category ? (
            <span className="text-[11px] text-muted-foreground">
              {memory.category}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function SidebarMemories({
  collapsed,
  memories,
  sheetOpen: controlledSheetOpen,
  onSheetOpenChange,
}: SidebarMemoriesProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [internalSheetOpen, setInternalSheetOpen] = useState(false);

  const sheetOpen = controlledSheetOpen ?? internalSheetOpen;
  const setSheetOpen = onSheetOpenChange ?? setInternalSheetOpen;

  function openDetail(memory: Memory) {
    setSelected(memory);
    setDetailOpen(true);
  }

  return (
    <>
      {collapsed ? (
        <div className="flex flex-col items-center gap-1 px-2 py-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Memories"
            onClick={() => setSheetOpen(true)}
          >
            <Brain className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="border-t border-border px-2 py-2">
          <SidebarSection title="Memories" collapsed={false} defaultOpen>
            <div className="mb-1 flex justify-end px-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Add memory"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            <MemoryList memories={memories} onSelect={openDetail} />
          </SidebarSection>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[300px] border-border p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between gap-2 pr-6">
              <SheetTitle className="text-sm font-medium">Memories</SheetTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Add memory"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="max-h-[70vh] overflow-y-auto p-2">
            <MemoryList memories={memories} onSelect={openDetail} compact />
          </div>
        </SheetContent>
      </Sheet>

      <MemoryCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <MemoryDetailDialog
        memory={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
