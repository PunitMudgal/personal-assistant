import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Relay",
  description:
    "What Relay stores, what it reads, and who it shares your data with.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-40">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
        Legal
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-white">Privacy</h1>
      <div className="mt-8 space-y-6 text-base leading-7 text-neutral-400">
        <p>
          Relay connects to the accounts you choose — Gmail, Google Calendar,
          and Notion — and reads only what it needs to answer your questions:
          messages, events, and pages you ask about.
        </p>
        <p>
          Your conversations are stored so Relay can remember context across
          sessions. Connection credentials are encrypted at rest and are never
          shown in the app. We do not sell your data, and we do not use your
          content for advertising.
        </p>
        <p>
          You can disconnect an integration or delete your account at any time
          from settings, which removes stored conversations and memories.
        </p>
        <p className="text-neutral-500">
          Questions about your data? Reach out before signing up — we answer
          every one.
        </p>
      </div>
    </main>
  );
}
