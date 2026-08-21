import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full px-6 pb-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] rounded-full"
        >
          <Image
            src="/logo-white.png"
            alt=""
            width={20}
            height={20}
            className="h-4 w-4 object-contain"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            Relay
          </span>
        </Link>

        <p className="order-last font-mono text-xs text-neutral-600 sm:order-none">
          © 2026 Relay
        </p>

        <nav
          aria-label="Footer"
          className="flex items-center gap-5 text-sm text-neutral-500"
        >
          <Link
            href="/#features"
            className="transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] rounded"
          >
            Features
          </Link>
          <Link
            href="/privacy"
            className="transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] rounded"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] rounded"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
