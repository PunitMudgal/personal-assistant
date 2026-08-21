"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { SpotlightCard } from "@/components/spotlight-card";
import { motion, useAnimation, useInView } from "motion/react";
import {
  BarChart,
  File,
  Globe,
  HeartHandshake,
  Rss,
  Shield,
} from "lucide-react";
import { JSX, useEffect, useId, useRef, useState } from "react";

const tiles = [
  {
    icon: <HeartHandshake className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-[#4CC2E9] opacity-20 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <Globe className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-white opacity-10 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <File className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-[#4CC2E9] opacity-15 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <Shield className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-white opacity-10 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <Rss className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-[#4CC2E9] opacity-20 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <BarChart className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-white opacity-10 blur-[20px] filter"></div>
    ),
  },
];

const createSeededRandom = (seed: number) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const shuffleArray = <T,>(array: T[], seed: number) => {
  const random = createSeededRandom(seed);
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const Card = (card: { icon: JSX.Element; bg: JSX.Element }) => {
  const id = useId();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { delay: 0.15, ease: "easeOut", duration: 1 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      key={id}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        "relative size-20 cursor-pointer overflow-hidden rounded-2xl border p-4",
        "transform-gpu bg-transparent [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      {card.icon}
      {card.bg}
    </motion.div>
  );
};

export function FeatureCardIntegration() {
  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const [randomTiles1] = useState(() => shuffleArray([...tiles], 1));
  const [randomTiles2] = useState(() => shuffleArray([...tiles], 2));
  const [randomTiles3] = useState(() => shuffleArray([...tiles], 3));
  const [randomTiles4] = useState(() => shuffleArray([...tiles], 4));

  return (
    <SpotlightCard>
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex h-full w-full cursor-pointer flex-col items-start justify-between"
      >
        <div className="group relative flex h-75 w-full cursor-pointer flex-col items-center justify-center gap-y-1 overflow-hidden rounded-t-xl p-4">
          <div className="relative flex flex-col items-center justify-center gap-y-2 px-10">
            <Marquee
              reverse
              className="-delay-[200ms] [--duration:20s]"
              repeat={4}
            >
              {randomTiles1.map((review, idx) => (
                <Card key={idx} {...review} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={4}>
              {randomTiles2.map((review, idx) => (
                <Card key={idx} {...review} />
              ))}
            </Marquee>
            <Marquee
              reverse
              className="-delay-[200ms] [--duration:20s]"
              repeat={4}
            >
              {randomTiles3.map((review, idx) => (
                <Card key={idx} {...review} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={4}>
              {randomTiles4.map((review, idx) => (
                <Card key={idx} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-black"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start border-t border-neutral-800 p-4">
          <h2 className="text-xl font-semibold">Connected everywhere</h2>
          <p className="text-base font-normal text-neutral-400">
            Gmail, Calendar, and Notion connect in one click — Relay reads them
            directly, no copy-pasting context
          </p>
        </div>
      </motion.div>
    </SpotlightCard>
  );
}
