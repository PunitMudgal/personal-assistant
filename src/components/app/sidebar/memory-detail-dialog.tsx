"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deactivateMemoryAction } from "@/app/actions/memories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Memory } from "@/db/schema";

function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

type MemoryDetailDialogProps = {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemoryDetailDialog({
  memory,
  open,
  onOpenChange,
}: MemoryDetailDialogProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!memory || pending) return;
    setPending(true);
    setError(null);

    const result = await deactivateMemoryAction({ id: memory.id });
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Memory</DialogTitle>
          <DialogDescription>
            {memory?.category
              ? `Category: ${memory.category}`
              : "Saved memory details"}
          </DialogDescription>
        </DialogHeader>

        {memory ? (
          <div className="mt-2 flex flex-col gap-3 text-sm">
            <p className="whitespace-pre-wrap text-foreground">
              {memory.content}
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
              <dt>Importance</dt>
              <dd className="text-foreground">{memory.importance}</dd>
              <dt>Updated</dt>
              <dd className="text-foreground">
                {formatDate(memory.updatedAt)}
              </dd>
            </dl>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={pending || !memory}
          >
            {pending ? "Removing…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
