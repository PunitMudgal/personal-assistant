import { FeatureCardIntegration } from "../feature-card-integration";
import { FeatureCardReply } from "../feature-card-reply";
import { FeatureCardSocial } from "../feature-card-social";
import { FeatureCardGraph } from "../feature-card-graph";
import { Reveal } from "../reveal";

const Feature = () => {
  return (
    <section id="features" className="relative w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        {/* Asymmetric section header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
              Why Relay
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Connected to your world
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
              Relay talks to Gmail, Calendar, and Notion directly — no
              copy-pasting context into a chat box.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="font-mono text-xs leading-relaxed tracking-wide text-neutral-600 lg:pb-1 lg:text-right">
              Gmail · Calendar · Notion
              <br />
              read directly, never re-shared
            </p>
          </Reveal>
        </div>

        {/* Asymmetric bento grid */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-6 xl:gap-8">
          <Reveal className="lg:col-span-4" delay={0}>
            <FeatureCardIntegration />
          </Reveal>
          <Reveal className="lg:col-span-2" delay={120}>
            <FeatureCardReply />
          </Reveal>
          <Reveal className="lg:col-span-2" delay={0}>
            <FeatureCardGraph />
          </Reveal>
          <Reveal className="lg:col-span-4" delay={120}>
            <FeatureCardSocial />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Feature;
