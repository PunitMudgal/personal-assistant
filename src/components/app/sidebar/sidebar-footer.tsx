"use client";

import {
  Brain,
  Database,
  LogOut,
  Settings as SettingsIcon,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

type SidebarFooterProps = {
  collapsed: boolean;
  onOpenMemories?: () => void;
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase() || "U";
  }
  if (email?.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return "U";
}

export function SidebarFooter({
  collapsed,
  onOpenMemories,
}: SidebarFooterProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const name = user?.name ?? "Relay user";
  const email = user?.email ?? "";
  const initials = getInitials(user?.name, user?.email);
  const isDataActive = pathname === "/data";

  return (
    <div className="border-t border-border p-3">
      <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            !collapsed && "flex-1 justify-start gap-2 text-muted-foreground"
          )}
          aria-label="Memory"
          onClick={onOpenMemories}
        >
          <Brain className="size-4" />
          {!collapsed && <span>Memory</span>}
        </Button>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            !collapsed && "flex-1 justify-start gap-2",
            isDataActive
              ? "bg-muted text-foreground"
              : "text-muted-foreground"
          )}
          aria-label="Data"
          aria-current={isDataActive ? "page" : undefined}
          asChild
        >
          <Link href="/data">
            <Database className="size-4" />
            {!collapsed && <span>Data</span>}
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      {!collapsed && <Separator className="my-3" />}

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
              {user?.image ? (
                <AvatarImage src={user.image} alt={name} />
              ) : null}
              <AvatarFallback className="bg-foreground text-xs font-medium text-background">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {name}
                </span>
                {email ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                ) : null}
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
            <span className="text-sm font-medium text-foreground">{name}</span>
            {email ? (
              <span className="text-xs font-normal text-muted-foreground">
                {email}
              </span>
            ) : null}
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
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              void signOutAction();
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
