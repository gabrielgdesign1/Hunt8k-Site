"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import MagneticButton from "./ui/MagneticButton";
import { SITE } from "@/lib/site";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href) as HTMLElement | null;
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
          <button
            onClick={() => go("#top")}
            className="group flex items-center gap-2.5"
            data-cursor="top"
          >
            <Image
              src="/branding/logo.png"
              alt="Hunt8K"
              width={54}
              height={32}
              priority
              className="h-7 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(255,33,22,0.7)]"
            />
            <span className="font-display text-lg leading-none tracking-tight">
              HUNT8K
            </span>
          </button>

          <div
            className={`hidden items-center gap-1 rounded-full border px-2 py-2 backdrop-blur-xl transition-colors md:flex ${
              scrolled
                ? "border-white/10 bg-white/[0.03]"
                : "border-transparent bg-transparent"
            }`}
          >
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-full px-4 py-1.5 text-sm text-[var(--color-ash)] transition-colors hover:bg-white/[0.06] hover:text-[var(--color-bone)]"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton
              as="button"
              onClick={() => go("#contact")}
              cursor="let's talk"
              className="group hidden overflow-hidden rounded-full bg-[var(--color-red)] px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex"
            >
              <span className="relative z-10">Hire Me</span>
              <span className="absolute inset-0 -translate-y-full bg-white transition-transform duration-300 group-hover:translate-y-0" />
              <span className="absolute inset-0 z-10 flex -translate-y-full items-center justify-center text-[var(--color-ink)] transition-transform duration-300 group-hover:translate-y-0">
                Hire Me
              </span>
            </MagneticButton>

            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] md:hidden"
              aria-label="Menu"
            >
              <span
                className={`h-px w-4 bg-white transition-transform ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-4 bg-white transition-transform ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-[var(--color-ink)]/95 px-8 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((l, i) => (
          <button
            key={l.href}
            onClick={() => go(l.href)}
            className="font-display text-5xl uppercase text-left leading-none text-[var(--color-bone)] transition-colors hover:text-[var(--color-red)]"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => go("#contact")}
          className="mt-6 w-fit rounded-full bg-[var(--color-red)] px-6 py-3 font-semibold text-white"
        >
          Hire Me →
        </button>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-8 font-mono text-xs uppercase tracking-widest text-[var(--color-ash)]"
        >
          {SITE.email}
        </a>
      </div>
    </>
  );
}
