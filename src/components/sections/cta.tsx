"use client";

import GetStarted from "../get-started";
import Orb from "../Orb";
import { Reveal } from "../reveal";

const Cta = () => {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-28 pt-8">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#181818] [box-shadow:0_-40px_80px_-40px_#ffffff14_inset]">
          <div className="grid grid-cols-1 items-center gap-8 px-8 py-16 sm:py-20 lg:grid-cols-2 lg:gap-4 lg:px-16">
            {/* Left: copy */}
            <div className="flex flex-col items-start text-left">
              <p className="mb-4 flex w-fit items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CC2E9] opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CC2E9]" />
                </span>
                Ready when you are
              </p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Your answer is already in your inbox
              </h2>
              <p className="mt-4 max-w-md text-pretty text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
                Connect your accounts and ask your first question in under two
                minutes.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4">
                <GetStarted />
                <p className="font-mono text-xs tracking-wide text-neutral-500">
                  Free while in beta · No credit card
                </p>
              </div>
            </div>

            {/* Right: Orb as the ending visual */}
            <div className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4CC2E9] opacity-[0.08] blur-[100px]"
              />
              <Orb
                hoverIntensity={2}
                rotateOnHover
                hue={0}
                forceHoverState={false}
                backgroundColor="#181818"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Cta;
