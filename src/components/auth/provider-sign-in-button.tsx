"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProviderButtonProps = {
  provider: "google" | "github";
  className?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.2 14.6 2.2 12 2.2 6.8 2.2 2.6 6.4 2.6 11.6S6.8 21 12 21c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.5l3.2 2.4C8 7.5 9.8 6.2 12 6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.2 14.6 2.2 12 2.2 8.3 2.2 5.1 4.3 3.9 7.5z"
      />
      <path
        fill="#4A90E2"
        d="M12 21c2.5 0 4.6-.8 6.1-2.3l-3-2.5c-.8.6-1.9 1-3.1 1-3.9 0-5.3-2.5-5.5-3.8l-3.2 2.5C4.9 18.8 8.1 21 12 21z"
      />
      <path
        fill="#FBBC05"
        d="M21.1 11.7c0-.6-.1-1.1-.2-1.5H12v3.9h5.5c-.3 1.3-1.1 2.3-2.1 3l3 2.5c1.8-1.6 2.7-4 2.7-7.9z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.01 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function PendingLabel({
  idle,
  pending,
}: {
  idle: React.ReactNode;
  pending: string;
}) {
  const { pending: isPending } = useFormStatus();
  return (
    <span className="inline-flex items-center gap-2">
      {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
      {isPending ? pending : idle}
    </span>
  );
}

export function ProviderSignInButton({
  provider,
  className,
  action,
}: ProviderButtonProps & {
  action: () => Promise<void>;
}) {
  const isGoogle = provider === "google";

  return (
    <form action={action} className="w-full">
      <Button
        type="submit"
        variant="outline"
        size="lg"
        className={cn(
          "h-11 w-full justify-center gap-2 rounded-xl border-border bg-background text-foreground shadow-sm",
          className
        )}
      >
        <PendingLabel
          pending={isGoogle ? "Redirecting to Google…" : "Redirecting to GitHub…"}
          idle={
            <>
              {isGoogle ? (
                <GoogleIcon className="size-4" />
              ) : (
                <GitHubIcon className="size-4" />
              )}
              Continue with {isGoogle ? "Google" : "GitHub"}
            </>
          }
        />
      </Button>
    </form>
  );
}
