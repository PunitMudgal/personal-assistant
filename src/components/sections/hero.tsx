"use client";

import GetStarted from "../get-started";
import Orb from "../Orb";
import { Reveal } from "../reveal";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-dvh w-full max-w-7xl mx-auto px-6 pt-32 pb-20 lg:py-0">
      {/* Left Content (55%) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center z-10 lg:pr-8 gap-2">
        <Reveal>
          {/* eyebrow */}
          <p className="mb-4 flex w-fit items-center gap-2.5 font-mono text-xs tracking-[0.18em] text-neutral-500 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CC2E9] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CC2E9]" />
            </span>
            Personal AI assistant
          </p>
        </Reveal>

        {/* main heading */}
        <Reveal delay={100}>
          <h1 className="max-w-xl text-balance text-5xl md:text-7xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-linear-to-r from-white to-[#9B9B9B]">
            Stop switching tabs.
            <br />
            Start asking Relay
            <span className="text-[#4CC2E9]">.</span>
          </h1>
        </Reveal>

        {/* sub heading */}
        <Reveal delay={200}>
          <p className="max-w-lg text-pretty text-base md:text-lg text-neutral-400 leading-relaxed">
            Relay reads your inbox, checks your calendar, and pulls up your
            notes — so you can just ask, instead of digging through five apps
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

      {/* Right Content - Orb (45%) */}
      <Reveal
        delay={200}
        className="w-full lg:w-[45%] h-80 md:h-125 lg:h-175 relative mt-16 lg:mt-0 flex items-center justify-center"
      >
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </Reveal>
    </div>
  );
};

export default Hero;
