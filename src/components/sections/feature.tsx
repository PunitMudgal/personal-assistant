import React from "react";
import { FeatureCardIntegration } from "../feature-card-integration";
import { FeatureCardReply } from "../feature-card-reply";
import { FeatureCardSocial } from "../feature-card-social";
import { FeatureCardGraph } from "../feature-card-graph";

const Feature = () => {
  return (
    <section className="relative w-full overflow-hidden px-6 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-neutral-300 backdrop-blur">
            Built for focus
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Connected to your world
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base md:text-lg">
            Relay talks to Gmail, Calendar, and Notion directly — no
            copy-pasting context into a chat box.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
          <div className="h-full">
            <FeatureCardIntegration />
          </div>
          <div className="h-full">
            <FeatureCardReply />
          </div>
          <div className="h-full">
            <FeatureCardSocial />
          </div>
          <div className="h-full">
            <FeatureCardGraph />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
