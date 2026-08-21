"use client";

import {
  Brain,
  PlugsConnected,
  Clock,
  Lock,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../reveal";

const benefits = [
  {
    icon: Brain,
    title: "Ask, don't dig",
    body: "Get the answer, not five tabs to check yourself. Relay reads your inbox and calendar and replies in plain language.",
  },
  {
    icon: PlugsConnected,
    title: "Connected everywhere",
    body: "Gmail, Calendar, and Notion connect in one click and are read directly. No copy pasting context into a chat box.",
  },
  {
    icon: Clock,
    title: "Actually remembers",
    body: "Every conversation persists. Ask about last week and Relay still knows what you meant, without you restating it.",
  },
  {
    icon: Sparkle,
    title: "Fast where it matters",
    body: "A capable model for real answers, a faster one for the small stuff. Nothing feels laggy when you just need a name.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Credentials are encrypted at rest and never re-shared. Disconnect an integration or delete your account anytime.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
              Why Relay
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              One assistant for the apps you already live in
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="font-mono text-xs leading-relaxed tracking-wide text-neutral-600 lg:pb-1 lg:text-right">
              Gmail · Calendar · Notion
              <br />
              read directly, never re-shared
            </p>
          </Reveal>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={(i % 3) * 100}>
                <article className="group relative h-full overflow-hidden rounded-lg border border-white/10 bg-[#181818] p-8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-white/20 [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#4CC2E9] opacity-0 blur-[60px] transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-20"
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black text-[#4CC2E9]">
                    <Icon size={24} weight="duotone" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-neutral-400 text-pretty">
                    {benefit.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
