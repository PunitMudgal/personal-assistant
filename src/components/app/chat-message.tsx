"use client";

import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import type { UIMessage } from "ai";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";
import {
  getMessageReasoning,
  getMessageText,
  getReasoningSteps,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase() || "U";
  }
  if (email?.trim()) return email.trim().slice(0, 2).toUpperCase();
  return "U";
}

function MessageReasoning({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const steps = !isStreaming ? getReasoningSteps(text) : [];

  if (steps.length >= 2) {
    return (
      <ChainOfThought className="mb-1">
        {steps.map((step) => (
          <ChainOfThoughtStep key={step.title}>
            <ChainOfThoughtTrigger>{step.title}</ChainOfThoughtTrigger>
            <ChainOfThoughtContent>
              <ChainOfThoughtItem className="whitespace-pre-wrap">
                {step.body || step.title}
              </ChainOfThoughtItem>
            </ChainOfThoughtContent>
          </ChainOfThoughtStep>
        ))}
      </ChainOfThought>
    );
  }

  return (
    <Reasoning className="mb-1" isStreaming={isStreaming}>
      <ReasoningTrigger className="text-xs text-muted-foreground">
        Thought process
      </ReasoningTrigger>
      <ReasoningContent
        className="text-muted-foreground"
        markdown
      >
        {text}
      </ReasoningContent>
    </Reasoning>
  );
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const { data: session } = useSession();
  const isUser = message.role === "user";
  const userName = session?.user?.name ?? "You";
  const userInitials = getInitials(session?.user?.name, session?.user?.email);
  const text = getMessageText(message);
  const reasoning = getMessageReasoning(message);

  return (
    <Message className="gap-3">
      {isUser ? (
        <MessageAvatar
          src={session?.user?.image ?? ""}
          alt={userName}
          fallback={userInitials}
          className="mt-1 bg-foreground text-background"
        />
      ) : (
        <MessageAvatar
          src="/logo-white.png"
          alt="Relay"
          fallback="R"
          className="mt-1 invert dark:invert-0"
        />
      )}

      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {isUser ? userName : "Relay"}
        </span>

        {!isUser && reasoning ? (
          <MessageReasoning
            text={reasoning.text}
            isStreaming={reasoning.isStreaming}
          />
        ) : null}

        {text ? (
          <MessageContent
            markdown={!isUser}
            className={cn(
              "max-w-2xl text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground rounded-2xl rounded-tl-sm"
                : "prose-sm bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm dark:prose-invert",
            )}
          >
            {text}
          </MessageContent>
        ) : null}

        {!isUser && text ? (
          <MessageActions className="mt-1">
            <MessageAction tooltip="Copy">
              <button
                type="button"
                aria-label="Copy"
                onClick={() => {
                  void navigator.clipboard.writeText(text);
                }}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Copy className="size-3.5" />
              </button>
            </MessageAction>
            <MessageAction tooltip="Regenerate">
              <button
                type="button"
                aria-label="Regenerate"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </MessageAction>
            <MessageAction tooltip="Good response">
              <button
                type="button"
                aria-label="Good response"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ThumbsUp className="size-3.5" />
              </button>
            </MessageAction>
            <MessageAction tooltip="Bad response">
              <button
                type="button"
                aria-label="Bad response"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ThumbsDown className="size-3.5" />
              </button>
            </MessageAction>
          </MessageActions>
        ) : null}
      </div>
    </Message>
  );
}
