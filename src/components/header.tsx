"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.02)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* <div className="relative h-8 w-8 md:h-9 md:w-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-0.5 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-indigo-500/40 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <div className="h-full w-full rounded-[10px] bg-[#0a0a0b] flex items-center justify-center"> */}
            <Image
              src="/logo-white.png"
              alt="Relay"
              width={40}
              height={40}
              className="h-4 w-4 md:h-7 md:w-7 object-contain"
            />
            {/* </div>
            </div> */}
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              Relay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-neutral-400 rounded-lg transition-all duration-200 hover:text-white hover:bg-white/[0.06] group"
              >
                {link.label}
                <span className="absolute inset-x-4 bottom-0 h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}

            {/* Get Started + Sign In / Open Chat */}
            <div className="ml-3 pl-3 border-l border-white/[0.06] flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  href="/chat"
                  className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-px shadow-2xl transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-1 text-sm font-medium text-neutral-200 backdrop-blur-3xl transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                    Open chat
                    <svg
                      className="ml-2 h-3.5 w-3.5 text-emerald-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-px shadow-2xl transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-1 text-sm font-medium text-neutral-200 backdrop-blur-3xl transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                      Get Started
                      <svg
                        className="ml-2 h-3.5 w-3.5 text-emerald-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Link>

                  <Link
                    href="/sign-in"
                    className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full p-px shadow-2xl transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-40 group-hover:opacity-70 transition-opacity" />
                    <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-1 text-sm font-medium text-neutral-200 backdrop-blur-3xl">
                      Sign In
                      <svg
                        className="ml-2 h-3.5 w-3.5 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden relative h-9 w-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-[#0a0a0b]/95 backdrop-blur-2xl transition-all duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-2 px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`w-full max-w-xs text-center px-6 py-4 text-lg font-medium text-neutral-400 rounded-xl transition-all duration-200 hover:text-white hover:bg-white/[0.06] hover:scale-[1.02] ${
                isMobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isMobileOpen ? `${i * 60}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Get Started + Sign In / Open Chat */}
          <div
            className={`w-full max-w-xs mt-4 flex flex-col gap-3 transition-all duration-300 ${
              isMobileOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileOpen
                ? `${navLinks.length * 60}ms`
                : "0ms",
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/chat"
                onClick={() => setIsMobileOpen(false)}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-px shadow-2xl"
              >
                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-6 py-3.5 text-base font-medium text-neutral-200 backdrop-blur-3xl transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                  Open chat
                  <svg
                    className="ml-2 h-4 w-4 text-emerald-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileOpen(false)}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-px shadow-2xl"
                >
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-6 py-3.5 text-base font-medium text-neutral-200 backdrop-blur-3xl transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                    Get Started
                    <svg
                      className="ml-2 h-4 w-4 text-emerald-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>

                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileOpen(false)}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full p-px shadow-2xl"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-50" />
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-6 py-3.5 text-base font-medium text-neutral-200 backdrop-blur-3xl">
                    Sign In
                    <svg
                      className="ml-2 h-4 w-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
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
