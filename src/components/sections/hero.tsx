"use client";
import Orb from "../Orb";
import { AnimatedGradientText } from "../ui/animated-gradient-text";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen w-full max-w-7xl mx-auto px-6 py-20 lg:py-0">
      {/* Left Content (55%) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center z-10 lg:pr-8">
        {/* eyebrow text */}
        <AnimatedGradientText>
          Your AI assistant, wired into the tools you already use
        </AnimatedGradientText>

        {/* main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-8 leading-[1.05]">
          Stop switching tabs. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Start asking Relay.
          </span>
        </h1>

        {/* sub heading */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
          Relay is a personal AI assistant that reads your inbox, checks your
          calendar, and pulls up your notes — so you can just ask, instead of
          digging through five apps to find the answer.
        </p>
      </div>

      {/* Right Content - Orb (45%) */}
      <div className="w-full lg:w-[45%] h-[400px] md:h-[500px] lg:h-[700px] relative mt-16 lg:mt-0 flex items-center justify-center">
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
