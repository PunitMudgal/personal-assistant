"use client";

import { cubicBezier, motion } from "motion/react";

const memories = [
  {
    initials: "DK",
    hue: "bg-[#4CC2E9]/15 text-[#4CC2E9]",
    lines: ["Prefers async", "standups, GMT+4"],
  },
  {
    initials: "MA",
    hue: "bg-white/10 text-neutral-300",
    lines: ["Reports are due", "Friday noon"],
  },
  {
    initials: "JT",
    hue: "bg-[#4CC2E9]/10 text-neutral-300",
    lines: ["Books flights via", "the travel card"],
  },
];

const cardVariants = (side: "left" | "center" | "right") => {
  if (side === "left") {
    return {
      initial: {
        x: 35,
        y: 5,
        scale: 0.8,
        rotate: -3,
        zIndex: 1,
        transition: {
          delay: 0.05,
          duration: 0.1,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
      },
      whileHover: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        boxShadow:
          "rgba(76,194,233,0.15) 10px 20px 70px -20px, rgba(36,42,66,0.04) 0px 10px 24px -8px",
        transition: {
          delay: 0.05,
          duration: 0.1,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
      },
    };
  }
  if (side === "right") {
    return {
      initial: {
        x: -35,
        y: 5,
        scale: 0.8,
        rotate: 3,
        zIndex: 1,
        transition: {
          delay: 0.05,
          duration: 0.1,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
      },
      whileHover: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        boxShadow:
          "rgba(76,194,233,0.15) 0px 20px 70px -10px, rgba(36,42,66,0.04) 0px 10px 24px -8px",
        transition: {
          delay: 0.05,
          duration: 0.1,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
      },
    };
  }
  return {
    initial: {
      scale: 1.1,
      zIndex: 2,
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      scale: 1,
      boxShadow:
        "rgba(76,194,233,0.15) 0px 20px 70px -10px, rgba(36,42,66,0.04) 0px 10px 24px -8px",
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
};

export function FeatureCardSocial() {
  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative h-full w-full transform-gpu rounded-lg border bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)]">
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex h-full w-full cursor-pointer flex-col items-start justify-between"
      >
        <div className="flex min-h-75 w-full items-center justify-center rounded-t-xl bg-transparent p-10">
          <motion.div className="flex h-fit w-full items-stretch justify-between gap-x-4">
            {memories.map((memory, i) => (
              <motion.div
                key={memory.initials}
                variants={cardVariants(
                  i === 0 ? "left" : i === 1 ? "center" : "right"
                )}
                className={`${
                  i === 2 ? "z-[3]" : "z-[3]"
                } flex h-fit w-full flex-col items-center gap-y-3 rounded-md border border-neutral-800 bg-neutral-900 p-5 px-2.5`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium ${memory.hue}`}
                >
                  {memory.initials}
                </div>
                <p className="text-center text-xs leading-relaxed text-neutral-400">
                  {memory.lines[0]}
                  <br />
                  {memory.lines[1]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex w-full flex-col items-start border-t border-neutral-800 p-4">
          <h2 className="text-xl font-semibold">Actually remembers</h2>
          <p className="text-base font-normal text-neutral-400">
            Every conversation persists — ask about last week and Relay still
            knows what you meant
          </p>
        </div>
      </motion.div>
    </div>
  );
}
