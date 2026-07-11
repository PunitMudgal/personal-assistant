import type { Conversation } from "@/lib/types";

export const mockConversations: Conversation[] = [
  {
    id: "c-1",
    title: "Plan a focused work week",
    preview: "Here's a realistic plan that blocks deep work…",
    updatedAt: "2m",
    favourite: true,
  },
  {
    id: "c-2",
    title: "Summarize the Q3 roadmap doc",
    preview: "The roadmap centers on three initiatives…",
    updatedAt: "1h",
    favourite: true,
  },
  {
    id: "c-3",
    title: "Debug a sticky CSS grid layout",
    preview: "Your columns are collapsing because…",
    updatedAt: "3h",
    favourite: false,
  },
  {
    id: "c-4",
    title: "Draft a polite follow-up email",
    preview: "Here's a warm, low-pressure follow-up…",
    updatedAt: "Yesterday",
    favourite: false,
  },
  {
    id: "c-5",
    title: "Compare Postgres vs SQLite for notes",
    preview: "For a local-first notes app, SQLite is…",
    updatedAt: "Yesterday",
    favourite: true,
  },
  {
    id: "c-6",
    title: "Ideas for a weekend side project",
    preview: "A few small, shippable ideas that play to…",
    updatedAt: "2d",
    favourite: false,
  },
  {
    id: "c-7",
    title: "Explain async/await simply",
    preview: "Think of async/await as a way to pause…",
    updatedAt: "3d",
    favourite: false,
  },
  {
    id: "c-8",
    title: "Refactor a long React component",
    preview: "Start by extracting the row into its own…",
    updatedAt: "5d",
    favourite: false,
  },
];
