"use client";

import { useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { SITE } from "@/lib/site";

// Order mirrors the order the sections appear on the page.
const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Stats", href: "#stats" },
  { label: "Clients", href: "#creators" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "About Me", href: "#about" },
  { label: "Let’s Work", href: "#contact" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href) as HTMLElement | null;
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 py-5">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
          <button
            onClick={() => go("#top")}
            className="group flex items-center"
            data-intro="drop"
          >
            <Image
              src="/branding/logo.png"
              alt="Hunt8K"
              width={124}
              height={73}
              priority
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(228,0,1,0.7)]"
            />
          </button>

          <div
            className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-black/45 px-2 py-2 backdrop-blur-xl md:flex lg:gap-1"
            data-intro="drop"
            style={{ "--intro-delay": "110ms" } as React.CSSProperties}
          >
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] text-[var(--color-ash)] transition-colors hover:bg-white/[0.06] hover:text-[var(--color-bone)] lg:px-4 lg:text-sm"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
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
            className="font-display text-4xl uppercase text-left leading-none text-[var(--color-bone)] transition-colors hover:text-[var(--color-red)]"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {l.label}
          </button>
        ))}
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
