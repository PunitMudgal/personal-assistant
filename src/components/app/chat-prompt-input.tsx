"use client";

import { ArrowUp, Mic, Paperclip } from "lucide-react";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";

type ChatPromptInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

export function ChatPromptInput({
  value,
  onValueChange,
  onSubmit,
  isLoading = false,
}: ChatPromptInputProps) {
  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
      <PromptInput
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
        disabled={isLoading}
        className="mx-auto max-w-3xl rounded-3xl border-border bg-card shadow-sm transition-shadow focus-within:shadow-md"
      >
        <PromptInputTextarea
          placeholder="Message Relay…"
          className="min-h-[52px] text-sm"
        />

        <PromptInputActions className="w-full justify-between pt-1.5">
          <div className="flex items-center gap-1">
            <PromptInputAction tooltip="Attach file" side="top">
              <button
                type="button"
                aria-label="Attach file"
                disabled={isLoading}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <Paperclip className="size-4" />
              </button>
            </PromptInputAction>
            <PromptInputAction tooltip="Voice input" side="top">
              <button
                type="button"
                aria-label="Voice input"
                disabled={isLoading}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <Mic className="size-4" />
              </button>
            </PromptInputAction>
          </div>

          <PromptInputAction tooltip="Send message" side="top">
            <button
              type="button"
              aria-label="Send message"
              onClick={onSubmit}
              disabled={!canSend}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-all",
                canSend
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
        Relay can make mistakes. Verify important information.
      </p>
    </div>
  );
}
