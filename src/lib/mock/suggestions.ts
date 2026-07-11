import type { PromptSuggestion } from "@/lib/types";

export const mockSuggestions: PromptSuggestion[] = [
  {
    id: "s-1",
    label: "Plan my focused work for tomorrow",
    highlight: "focused work",
  },
  {
    id: "s-2",
    label: "Summarize my last meeting notes",
    highlight: "meeting notes",
  },
  {
    id: "s-3",
    label: "Draft a reply to today's important email",
    highlight: "important email",
  },
  {
    id: "s-4",
    label: "Suggest a small side project for the weekend",
    highlight: "side project",
  },
];
