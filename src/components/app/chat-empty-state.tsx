"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { mockSuggestions } from "@/lib/mock/suggestions";

type ChatEmptyStateProps = {
  onPick: (text: string) => void;
};

export function ChatEmptyState({ onPick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <Image
          src="/logo2.png"
          alt="Relay"
          width={120}
          height={40}
          priority
          className="mb-6 h-9 w-auto object-contain dark:invert dark:opacity-90"
        />

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          How can I help today?
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Ask Relay to plan your day, summarize notes, draft replies, or dig
          through your inbox and calendar.
        </p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {mockSuggestions.map((s) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PromptSuggestion
                highlight={s.highlight}
                className="h-auto w-full items-start whitespace-normal py-3 text-left"
                onClick={() => onPick(s.label)}
              >
                {s.label}
              </PromptSuggestion>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
