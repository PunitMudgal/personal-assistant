"use client";

import Image from "next/image";
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import type { UIMessage } from "ai";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessageReasoning, getMessageText } from "@/lib/chat";
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

export function ChatMessage({ message }: { message: UIMessage }) {
  const { data: session } = useSession();
  const isUser = message.role === "user";
  const userName = session?.user?.name ?? "You";
  const userInitials = getInitials(session?.user?.name, session?.user?.email);
  const text = getMessageText(message);
  const reasoning = getMessageReasoning(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Message className="gap-3">
        {isUser ? (
          <Avatar
            size="sm"
            className="mt-1 shrink-0 bg-foreground text-background"
          >
            {session?.user?.image ? (
              <AvatarImage src={session.user.image} alt={userName} />
            ) : null}
            <AvatarFallback className="bg-foreground text-xs font-medium text-background">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Image
            src="/logo-white.png"
            alt="Relay"
            width={84}
            height={28}
            priority
            className="mt-1 h-6 w-auto object-contain invert dark:invert-0 dark:opacity-90"
          />
        )}

        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? userName : "Relay"}
          </span>

          {!isUser && reasoning ? (
            <Reasoning className="mb-1" isStreaming={reasoning.isStreaming}>
              <ReasoningTrigger className="text-xs text-muted-foreground">
                Thought process
              </ReasoningTrigger>
              <ReasoningContent className="text-muted-foreground">
                {reasoning.text}
              </ReasoningContent>
            </Reasoning>
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

          {!isUser && (
            <MessageActions className="mt-1">
              <MessageAction tooltip="Copy">
                <button
                  type="button"
                  aria-label="Copy"
                  onClick={() => {
                    if (text) void navigator.clipboard.writeText(text);
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
          )}
        </div>
      </Message>
    </motion.div>
  );
}
