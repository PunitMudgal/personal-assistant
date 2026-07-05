"use client";

import GetStarted from "../get-started";
import Orb from "../Orb";

const Hero = () => {
  //   const containerRef = useRef(null);

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-between min-h-screen w-full max-w-7xl mx-auto px-6 py-20 lg:py-0"
      //   ref={containerRef}
    >
      {/* <StickyHeader containerRef={containerRef} /> */}
      {/* Left Content (55%) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center z-10 lg:pr-8 gap-2">
        {/* eyebrow text */}
        <div className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full p-px mb-1 w-fit shadow-2xl transition-transform hover:scale-[1.02]">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-1 text-sm font-medium text-neutral-200 backdrop-blur-3xl">
            <span className="mr-3 flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            </span>
            <span className="bg-linear-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Your AI assistant, wired into the tools you already use
            </span>
            <svg
              className="ml-2 h-3.5 w-3.5 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>

        {/* main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-2 ">
          Stop switching tabs, <br /> Start asking <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
            Relay.
          </span>
        </h1>

        {/* sub heading */}
        <p className="text-md md:text-lg text-neutral-400  leading-relaxed">
          Relay is a personal AI assistant that reads your inbox, checks your
          calendar, and pulls up your notes — so you can just ask, instead of
          digging through five apps to find the answer.
        </p>

        <GetStarted />
      </div>

      {/* Right Content - Orb (45%) */}
      <div className="w-full lg:w-[45%] h-100 md:h-125 lg:h-175 relative mt-16 lg:mt-0 flex items-center justify-center">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>
    </div>
  );
};

export default Hero;
