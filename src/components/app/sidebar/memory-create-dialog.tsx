"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMemoryAction } from "@/app/actions/memories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MemoryCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemoryCreateDialog({
  open,
  onOpenChange,
}: MemoryCreateDialogProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [importance, setImportance] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setContent("");
    setCategory("");
    setImportance("0");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || pending) return;

    setPending(true);
    setError(null);

    const importanceNum = Number.parseInt(importance, 10);
    const result = await createMemoryAction({
      content: trimmed,
      category: category.trim() || null,
      importance: Number.isFinite(importanceNum)
        ? Math.min(100, Math.max(0, importanceNum))
        : 0,
    });

    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    reset();
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle>Add memory</DialogTitle>
            <DialogDescription>
              Save a preference, fact, or note Relay can keep for you.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="memory-content">Content</Label>
              <Textarea
                id="memory-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. Prefers concise answers…"
                className="min-h-24"
                required
                disabled={pending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="memory-category">Category (optional)</Label>
              <Input
                id="memory-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="preference, fact, goal…"
                disabled={pending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="memory-importance">Importance (0–100)</Label>
              <Input
                id="memory-importance"
                type="number"
                min={0}
                max={100}
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                disabled={pending}
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !content.trim()}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
