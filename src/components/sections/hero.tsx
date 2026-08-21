"use client";

import Image from "next/image";
import GetStarted from "../get-started";
import { Reveal } from "../reveal";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ambient cyan glow that bleeds out from the robot */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-170 w-170 -translate-y-1/2 rounded-full bg-[#4CC2E9] opacity-[0.08] blur-[140px] lg:block"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-between px-6 pt-32 pb-16 lg:flex-row lg:py-0">
        {/* Left content (55%) */}
        <div className="z-10 flex w-full flex-col justify-center gap-2 lg:w-[55%] lg:pr-8">
          <Reveal>
            <p className="mb-4 flex w-fit items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CC2E9] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CC2E9]" />
              </span>
              Personal AI assistant
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mb-3 max-w-170 text-balance text-5xl font-bold tracking-[-0.03em] text-transparent md:text-7xl bg-clip-text bg-linear-to-r from-white to-[#9B9B9B]">
              Stop switching tabs.
              <br />
              Start asking Relay
              <span className="text-[#4CC2E9]">.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="max-w-170 text-pretty text-base leading-relaxed text-neutral-400 md:text-lg">
              Relay reads your inbox, checks your calendar, and pulls up your
              notes so you can just ask, instead of digging through five apps
              to find the answer.
            </p>
          </Reveal>

          <Reveal delay={300} className="mt-6">
            <GetStarted />
            <p className="mt-4 font-mono text-xs tracking-wide text-neutral-600">
              Free while in beta · No credit card · Gmail, Calendar &amp; Notion
            </p>
          </Reveal>
        </div>

        {/* Right content — robot hero image (45%) */}
        <Reveal
          delay={200}
          className="relative mt-16 flex h-80 w-full items-center justify-center md:h-125 lg:mt-0 lg:h-dvh lg:w-[45%]"
        >
          <div className="relative aspect-3/4 h-full w-auto max-w-full">
            <Image
              src="/hero.png"
              alt="A sleek white humanoid robot in a thinking pose, lit with glowing cyan accents against a black background."
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
