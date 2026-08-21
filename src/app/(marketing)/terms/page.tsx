import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms — Relay",
  description: "The agreement between you and Relay when you use the product.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-40">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
        Legal
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-white">Terms</h1>
      <div className="mt-8 space-y-6 text-base leading-7 text-neutral-400">
        <p>
          Relay is provided free while in beta. Features may change as the
          product develops, and we will flag breaking changes in the app before
          they take effect.
        </p>
        <p>
          You are responsible for the accounts you connect and for complying
          with the terms of those services. Relay grants you a personal,
          non-transferable license to use the product for its intended purpose.
        </p>
        <p>
          The service is offered as is during beta, without warranties. Either
          side can end the relationship at any time by deleting the account or
          discontinuing the service.
        </p>
      </div>
    </main>
  );
}
