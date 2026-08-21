import GetStarted from "../get-started";
import { Reveal } from "../reveal";

const Cta = () => {
  return (
    <section className="relative w-full px-6 pb-28 pt-8">
      <Reveal className="mx-auto max-w-3xl border-y border-white/10 py-20 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Your answer is already in your inbox
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
          Connect your accounts and ask your first question in under two
          minutes.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <GetStarted />
          <p className="font-mono text-xs tracking-wide text-neutral-600">
            Free while in beta · No credit card
          </p>
        </div>
      </Reveal>
    </section>
  );
};

export default Cta;
