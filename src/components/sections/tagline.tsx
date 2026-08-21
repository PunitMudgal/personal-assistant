"use client";

import { useEffect, useRef } from "react";

const TAGLINE =
  "Your answer is already in your inbox. Relay just knows where to look.";

export function Tagline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = Array.from(container.querySelectorAll<HTMLElement>("[data-word]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      words.forEach((w) => w.classList.add("tagline-word--active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const word = entry.target as HTMLElement;
            const index = Number(word.dataset.index ?? 0);
            const delay = Math.min(index * 70, 1400);
            window.setTimeout(() => {
              word.classList.add("tagline-word--active");
            }, delay);
            observer.unobserve(word);
          }
        }
      },
      { threshold: 0.6, rootMargin: "0px 0px -20% 0px" }
    );

    words.forEach((w) => observer.observe(w));
    return () => observer.disconnect();
  }, []);

  const tokens = TAGLINE.split(" ");

  return (
    <section className="relative w-full px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-4xl">
        <p
          ref={containerRef}
          className="text-balance text-4xl font-semibold tracking-[-0.02em] text-neutral-700 sm:text-5xl md:text-6xl"
        >
          {tokens.map((word, i) => (
            <span key={i} className="inline-block">
              <span
                data-word
                data-index={i}
                className="tagline-word inline-block"
              >
                {word}
              </span>
              {i < tokens.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>

      <style>{`
        .tagline-word {
          color: rgba(155, 155, 155, 0.32);
          transition: color 900ms cubic-bezier(0.32, 0.72, 0, 1);
        }
        .tagline-word--active {
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
