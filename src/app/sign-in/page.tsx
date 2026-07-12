import Image from "next/image";
import Link from "next/link";

import { ProviderSignInButton } from "@/components/auth/provider-sign-in-button";
import { signIn } from "@/server/auth";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Use the original provider.",
  OAuthSignin: "Could not start the OAuth sign-in. Check your provider credentials.",
  OAuthCallback: "OAuth callback failed. Please try again.",
  AccessDenied: "Access was denied. Please try again.",
  Configuration: "Auth is misconfigured. Check AUTH_SECRET and provider env vars.",
  Default: "Something went wrong while signing in. Please try again.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl && params.callbackUrl.startsWith("/")
      ? params.callbackUrl
      : "/chat";
  const errorKey = params.error ?? "";
  const errorMessage =
    errorKey.length > 0
      ? (errorMessages[errorKey] ?? errorMessages.Default)
      : null;

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  };

  const signInWithGitHub = async () => {
    "use server";
    await signIn("github", { redirectTo: callbackUrl });
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.96_0_0),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.22_0_0),transparent_55%)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo2.png"
            alt="Relay"
            width={96}
            height={32}
            priority
            className="mb-5 h-8 w-auto object-contain dark:invert dark:opacity-90"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in to Relay
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue with Google or GitHub to open your personal assistant.
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <ProviderSignInButton provider="google" action={signInWithGoogle} />
          <ProviderSignInButton provider="github" action={signInWithGitHub} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to Relay&apos;s terms of use.
          <br />
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
