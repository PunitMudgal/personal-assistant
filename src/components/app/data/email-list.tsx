"use client";

import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { EmailListItem } from "@/lib/email-search";
import { cn } from "@/lib/utils";

type EmailListProps = {
  items: EmailListItem[];
};

function formatSentAt(iso: string | null): string {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function EmailList({ items }: EmailListProps) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((email) => (
        <li key={email.id}>
          <Collapsible>
            <CollapsibleTrigger
              className={cn(
                "group flex w-full flex-col gap-1 px-1 py-3 text-left transition-colors hover:bg-muted/50",
                "outline-none focus-visible:bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                  {email.subject?.trim() || "(No subject)"}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  {formatSentAt(email.sentAt)}
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {email.from?.trim() || "Unknown sender"}
              </p>
              {email.preview ? (
                <p className="line-clamp-2 text-xs text-muted-foreground/90">
                  {email.preview}
                </p>
              ) : null}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-1 pb-3">
              <div className="rounded-md bg-muted/40 px-3 py-2 text-sm whitespace-pre-wrap text-foreground">
                {email.body?.trim() || "(No body)"}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </li>
      ))}
    </ul>
  );
}
