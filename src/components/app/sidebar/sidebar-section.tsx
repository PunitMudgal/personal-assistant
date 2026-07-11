"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SidebarSectionProps = {
  title: string;
  collapsed: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SidebarSection({
  title,
  collapsed,
  defaultOpen = true,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) {
    return <div className="flex flex-col items-center gap-1">{children}</div>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group/section flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground",
          "transition-colors hover:text-foreground"
        )}
      >
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open ? "" : "-rotate-90"
          )}
        />
        {title}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
