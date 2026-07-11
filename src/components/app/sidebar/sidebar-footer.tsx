"use client";

import { Brain, LogOut, Settings as SettingsIcon, UserCog } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { mockUser } from "@/lib/mock/user";
import { cn } from "@/lib/utils";

type SidebarFooterProps = {
  collapsed: boolean;
};

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="border-t border-border p-3">
      {/* Quick nav */}
      <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(!collapsed && "flex-1 justify-start gap-2 text-muted-foreground")}
          aria-label="Memory"
        >
          <Brain className="size-4" />
          {!collapsed && <span>Memory</span>}
        </Button>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(!collapsed && "flex-1 justify-start gap-2 text-muted-foreground")}
          aria-label="Settings"
        >
          <SettingsIcon className="size-4" />
          {!collapsed && <span>Settings</span>}
        </Button>
        <ThemeToggle />
      </div>

      {!collapsed && <Separator className="my-3" />}

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "mt-2 flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-muted",
              collapsed && "justify-center"
            )}
          >
            <Avatar size="sm" className="bg-foreground text-background">
              <AvatarFallback className="bg-foreground text-xs font-medium text-background">
                {mockUser.initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {mockUser.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {mockUser.email}
                </span>
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align={collapsed ? "center" : "start"}
          sideOffset={8}
          className="w-56"
        >
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{mockUser.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{mockUser.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserCog className="size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon className="size-4" />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
