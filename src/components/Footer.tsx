"use client";

import Image from "next/image";
import Lenis from "lenis";
import { SITE } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

function toTop() {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.07] bg-[var(--color-ink-2)]">
      {/* giant wordmark */}
      <div className="relative flex justify-center pt-16">
        <h2 className="font-display text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] select-none">
          HUNT8K
        </h2>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-ink-2)] to-transparent" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-10 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/8 pt-10 md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/branding/logo.png"
              alt="Hunt8K"
              width={48}
              height={28}
              className="h-6 w-auto"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ash)]">
              {SITE.role}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor={s.label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[var(--color-ash)] transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red-bright)]"
              >
                <SocialIcon icon={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button
            onClick={toTop}
            data-cursor="top"
            className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-[var(--color-ash)] transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-bone)]"
          >
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-dim)] md:flex-row">
          <span>© {new Date().getFullYear()} Hunt8K. All rights reserved.</span>
          <span>Designed to stop the scroll.</span>
        </div>
      </div>
    </footer>
  );
}
