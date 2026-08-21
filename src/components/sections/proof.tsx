"use client";

import { Reveal } from "../reveal";

const testimonials = [
  {
    quote:
      "I asked Relay what I owed the caterer for the offsite. It pulled the email, the calendar event, and the Notion budget doc and just told me. That used to be a fifteen minute hunt.",
    name: "Priya Raman",
    role: "Operations lead, Northwind Labs",
    initials: "PR",
  },
  {
    quote:
      "Half my job is remembering who said what. Relay remembers for me. I asked it what Dana and I agreed on last Friday and it quoted the thread back.",
    name: "Marcus Bell",
    role: "Account director, Halcyon",
    initials: "MB",
  },
  {
    quote:
      "The first thing I do on Monday is ask Relay what landed over the weekend and what I actually have to respond to. It cut my inbox triage from an hour to maybe six minutes.",
    name: "Sofia Kastner",
    role: "Founder, Threadline",
    initials: "SK",
  },
];

export function Proof() {
  return (
    <section id="proof" className="relative w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <Reveal className="max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            In their words
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            People who stopped switching tabs
          </h2>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 xl:gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-[#181818] p-8 [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
                <blockquote className="text-base leading-7 text-neutral-300 text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black font-mono text-xs font-medium text-[#4CC2E9]">
                    {t.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {t.name}
                    </span>
                    <span className="text-sm text-neutral-500">{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* stat strip */}
        <Reveal>
          <div className="grid grid-cols-1 gap-8 rounded-lg border border-white/10 bg-[#181818] p-10 [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] sm:grid-cols-3">
            {[
              { stat: "0.9s", label: "median time to first token" },
              { stat: "3", label: "integrations, one click each" },
              { stat: "47.2%", label: "less time spent in the inbox" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <span className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                  {item.stat}
                </span>
                <span className="mt-2 font-mono text-xs tracking-wide text-neutral-500">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
