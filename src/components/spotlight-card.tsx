"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-lg border border-white/10 bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1",
        className
      )}
    >
      {/* cursor-lit border ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100"
      >
        <div
          className="absolute inset-0 rounded-lg p-px"
          style={{
            background:
              "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(76,194,233,0.55), transparent 70%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          }}
        />
        {/* soft interior pool of light */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(76,194,233,0.06), transparent 65%)",
          }}
        />
      </div>
      {children}
    </div>
  );
}
