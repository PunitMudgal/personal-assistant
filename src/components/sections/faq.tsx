"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../reveal";

const faqs = [
  {
    q: "What does Relay actually read?",
    a: "Relay reads only what it needs to answer your question: the messages, events, and pages you ask about in Gmail, Google Calendar, and Notion. It does not scan your entire account up front.",
  },
  {
    q: "Is my data safe?",
    a: "Connection credentials are encrypted at rest and are never shown in the app. Relay does not sell your data and does not use your content for advertising. You can disconnect an integration or delete your account at any time, which removes stored conversations and memories.",
  },
  {
    q: "Which accounts are supported?",
    a: "Gmail, Google Calendar, and Notion today. More integrations are in progress during beta. If there is one you need, tell us and it moves up the list.",
  },
  {
    q: "Do I need to copy paste context into the chat?",
    a: "No. That is the whole point. Relay talks to your accounts directly, so you ask the question the way you would ask a colleague and it pulls the source itself.",
  },
  {
    q: "Does Relay remember past conversations?",
    a: "Yes. Every conversation persists, so you can ask about last week or last month and Relay still has the context without you restating it.",
  },
  {
    q: "What does it cost?",
    a: "Relay is free while in beta. No credit card is required to start. Pricing will be announced before the beta ends, and everyone in the beta gets advance notice.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 py-6 text-left text-lg font-semibold text-white transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[#4CC2E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
        >
          <span className="text-balance">{faq.q}</span>
          <CaretDown
            size={20}
            weight="bold"
            aria-hidden
            className={`shrink-0 text-[#4CC2E9] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        className="grid transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pr-10 text-base leading-7 text-neutral-400 text-pretty">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            FAQ
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Questions, answered straight
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
