"use client";

import { Reveal } from "../reveal";

const steps = [
  {
    number: "01",
    title: "Connect your accounts",
    body: "Sign in with Gmail, Google Calendar, and Notion in one click. Relay reads only what it needs to answer you.",
  },
  {
    number: "02",
    title: "Ask in plain language",
    body: "Type your question the way you would ask a colleague. No special syntax, no copying context into the box.",
  },
  {
    number: "03",
    title: "Get the answer with the source",
    body: "Relay replies with the email, event, or note it pulled from, so you can trust the answer in under a second.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <Reveal className="max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            From signup to your first answer in under two minutes
          </h2>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 xl:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 120}>
              <article className="relative flex h-full flex-col rounded-lg border border-white/10 bg-[#181818] p-8 [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
                <span className="font-mono text-sm tracking-wide text-[#4CC2E9]">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-neutral-400 text-pretty">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
