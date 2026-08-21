"use client";

import { cubicBezier, motion } from "motion/react";
import { SpotlightCard } from "@/components/spotlight-card";

export function FeatureCardGraph() {
  const variant1 = {
    initial: {
      viewBox: "0 -950 366 1408",
      filter: "saturate(0.3)",
      opacity: 0.5,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      viewBox: "0 -60 366 310",
      filter: "saturate(1)",
      opacity: 1,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  const variant2 = {
    initial: {
      y: 0,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      y: 0,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <SpotlightCard>
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex h-full w-full cursor-pointer flex-col items-start justify-between"
      >
        <div className="relative flex min-h-75 w-full cursor-pointer items-center justify-center overflow-hidden rounded-t-xl bg-transparent p-10">
          <div className="relative h-[150px] w-full max-w-xs cursor-pointer overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-900">
            <motion.p
              variants={variant2}
              className="absolute left-5 top-5 w-fit font-mono text-[15px] tabular-nums text-neutral-200"
            >
              0.9s median
            </motion.p>
            <motion.svg
              variants={variant1}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              viewBox="0 -950 366 1408"
            >
              <path
                fill="url(#a)"
                d="M0 193c109.5 0 260.5-52.5 366-192.5v907H0V193Z"
              />
              <defs>
                <linearGradient
                  id="a"
                  x1={183}
                  x2={183}
                  y1={0.5}
                  y2={262}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4CC2E9" />
                  <stop offset={1} stopColor="#155e75" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>
        </div>
        <div className="flex w-full flex-col items-start border-t border-neutral-800 p-4">
          <h2 className="text-xl font-semibold">Fast where it matters</h2>
          <p className="text-base font-normal text-neutral-400">
            A capable model for real answers, a faster one for the small stuff —
            nothing feels laggy
          </p>
        </div>
      </motion.div>
    </SpotlightCard>
  );
}
