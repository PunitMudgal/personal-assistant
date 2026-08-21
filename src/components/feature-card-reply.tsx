"use client";

import { cubicBezier, motion } from "motion/react";
import Image from "next/image";

export function FeatureCardReply() {
  const variant1 = {
    initial: {
      y: 4,
      scale: 0.5,
      opacity: 0,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      y: -2,
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  const variant2 = {
    initial: {
      y: -2,
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.05,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      y: 8,
      opacity: 1,
      scale: 1.05,
      boxShadow:
        "rgba(76,194,233,0.15) 10px 20px 70px -20px, rgba(36,42,66,0.04) 0px 10px 24px -8px, rgba(36,42,66,0.06) 0px 1px 4px -1px",
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
    <div className="relative h-full w-full transform-gpu rounded-lg border bg-black [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex h-full w-full cursor-pointer flex-col justify-between"
      >
        <motion.div className="flex min-h-75 w-full cursor-pointer flex-col items-center justify-center gap-y-2 overflow-hidden rounded-t-xl p-6">
          <motion.div
            variants={variant1}
            className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-neutral-800 px-4 py-2.5"
          >
            <p className="text-sm text-neutral-200">
              What did I promise Dana for Tuesday?
            </p>
          </motion.div>
          <motion.div
            variants={variant2}
            className="mr-auto flex w-fit max-w-[85%] items-start gap-x-2 rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 p-4"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black">
              <Image
                className="h-full w-full rounded-full object-cover"
                src="/logo-white.png"
                width={24}
                height={24}
                alt=""
              />
            </div>
            <p className="text-sm text-neutral-300">
              You emailed Dana on Friday confirming the draft proposal by Tuesday
              morning — it&apos;s in your Notion under{" "}
              <span className="text-[#4CC2E9]">Client work</span>.
            </p>
          </motion.div>
        </motion.div>
        <div className="flex w-full flex-col items-start border-t border-neutral-800 p-4">
          <h2 className="text-xl font-semibold">Ask, don&apos;t dig</h2>
          <p className="text-base font-normal text-neutral-400">
            Relay reads your inbox and calendar so you get an answer, not five
            tabs to check yourself
          </p>
        </div>
      </motion.div>
    </div>
  );
}
