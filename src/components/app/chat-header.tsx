"use client";

import { ChevronDown, Menu, Share2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { useAppShell } from "@/components/app/app-shell";
import { mockModels, defaultModelId } from "@/lib/mock/models";

export function ChatHeader() {
  const { activeConversation, setMobileOpen } = useAppShell();
  const [modelId, setModelId] = useState(defaultModelId);

  const selectedModel =
    mockModels.find((m) => m.id === modelId) ?? mockModels[0];

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        aria-label="Open conversations"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-4" />
      </Button>

      {/* Title */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Sparkles className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm font-medium text-foreground">
          {activeConversation?.title ?? "New chat"}
        </span>
      </div>

      {/* Model selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <span className="hidden sm:inline">{selectedModel.name}</span>
            <span className="sm:hidden">Model</span>
            <ChevronDown className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={modelId}
            onValueChange={setModelId}
          >
            {mockModels.map((m) => (
              <DropdownMenuRadioItem
                key={m.id}
                value={m.id}
                className="flex flex-col items-start gap-0.5 py-2 pr-8"
              >
                <span className="text-sm font-medium text-foreground">
                  {m.name}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {m.description}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Share conversation"
        className="hidden text-muted-foreground sm:inline-flex"
      >
        <Share2 className="size-4" />
      </Button>

      <ThemeToggle />
    </header>
  );
}
