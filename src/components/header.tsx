"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const navLinks = [{ label: "Features", href: "/#features" }];

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mt-6 px-4">
      <div className="mx-auto w-max max-w-full">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 pl-5 pr-2 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
          >
            <Image
              src="/logo-white.png"
              alt="Relay"
              width={28}
              height={28}
              className="h-5 w-5 object-contain"
            />
            <span className="text-base font-semibold tracking-tight text-white">
              Relay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-neutral-400 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-1 flex items-center gap-1">
            {isAuthenticated ? (
              <Link
                href="/chat"
                className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-black transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Open chat
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-full px-3 text-sm font-medium text-neutral-400 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-black transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Start free
                </Link>
              </>
            )}

            {/* Mobile Menu Button — lines morph into a true X */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden relative ml-1 h-9 w-9 rounded-full text-neutral-300 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9]"
            >
              <span
                aria-hidden
                className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isMobileOpen ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
              />
              <span
                aria-hidden
                className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isMobileOpen ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 -z-10 flex items-center justify-center bg-black/80 backdrop-blur-3xl transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex w-full max-w-xs flex-col items-stretch gap-2 px-6 pt-16"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`rounded-2xl px-6 py-4 text-center text-lg font-medium text-neutral-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] hover:text-white ${
                isMobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: isMobileOpen ? `${i * 80}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={`mt-4 flex flex-col gap-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isMobileOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileOpen
                ? `${navLinks.length * 80}ms`
                : "0ms",
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/chat"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-base font-semibold text-black transition-transform active:scale-[0.98]"
              >
                Open chat
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-base font-semibold text-black transition-transform active:scale-[0.98]"
                >
                  Start free
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full text-base font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
