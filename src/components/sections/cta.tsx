import GetStarted from "../get-started";
import { Reveal } from "../reveal";

const Cta = () => {
  return (
    <section className="relative w-full px-6 pb-28 pt-8">
      <Reveal className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-[#181818] px-8 py-16 text-center [box-shadow:0_-40px_80px_-40px_#ffffff14_inset] sm:py-20">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your answer is already in your inbox
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-7 text-neutral-400 md:text-lg md:leading-8">
            Connect your accounts and ask your first question in under two
            minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <GetStarted />
            <p className="font-mono text-xs tracking-wide text-neutral-500">
              Free while in beta · No credit card
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Cta;
