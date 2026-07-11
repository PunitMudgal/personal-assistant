import type { ChatMessage } from "@/lib/types";

export const mockMessages: ChatMessage[] = [
  {
    id: "m-1",
    role: "user",
    content: "Can you help me set up a focused work plan for tomorrow? I have a few deep-work tasks and two meetings.",
  },
  {
    id: "m-2",
    role: "assistant",
    reasoning:
      "The user wants a realistic schedule. I should protect a long deep-work block in the morning when energy is highest, cluster the two meetings in the early afternoon to avoid fragmenting focus, and leave a lighter admin block at the end of the day. I'll keep it concrete and time-boxed.",
    content: `## Tomorrow's focused work plan

Here's a realistic, time-boxed layout that protects your attention:

- **09:00 – 11:30** — Deep work block 1 (hardest task, no notifications)
- **11:30 – 12:00** — Light admin + inbox triage
- **12:00 – 13:00** — Lunch + a real break
- **13:00 – 14:00** — Meeting 1 and Meeting 2, back to back
- **14:00 – 16:30** — Deep work block 2 (second priority)
- **16:30 – 17:00** — Wrap-up, plan the next day

### Why this works

1. **Single-task mornings** — your most demanding work runs while focus is freshest.
2. **Clustered meetings** — grouping them limits context-switching cost.
3. **A shutdown ritual** — ending on planning reduces lingering mental load.

> Tip: silence notifications during the 09:00 and 14:00 blocks. Even a single ping can cost ~20 minutes of refocus.

If you want, I can turn this into a calendar block you can paste in:

\`\`\`ts
const blocks = [
  { start: "09:00", end: "11:30", type: "deep-work", title: "Priority 1" },
  { start: "13:00", end: "14:00", type: "meetings", title: "Sync x2" },
  { start: "14:00", end: "16:30", type: "deep-work", title: "Priority 2" },
]
\`\`\`

Want me to adjust the durations or swap the deep-work blocks to the afternoon?`,
  },
  {
    id: "m-3",
    role: "user",
    content: "Looks great. Can you make the meetings 30 minutes each instead of an hour?",
  },
  {
    id: "m-4",
    role: "assistant",
    content: `Done — shorter meetings free up real focus time. Here's the updated shape:

- **09:00 – 11:30** — Deep work block 1
- **11:30 – 12:00** — Light admin
- **13:00 – 13:30** — Meeting 1
- **13:30 – 14:00** — Meeting 2
- **14:00 – 16:30** — Deep work block 2
- **16:30 – 17:00** — Wrap-up

That gives you back an extra hour of contiguous focus in the afternoon. Want me to add reminders 5 minutes before each block?`,
  },
];
