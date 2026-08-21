import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Features", href: "/#features" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden px-6 pb-14">
      {/* watermark wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-8 select-none text-center text-[22vw] font-bold leading-none tracking-[-0.05em] text-transparent sm:text-[18vw] lg:text-[15rem]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.045)" }}
      >
        Relay
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
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
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
