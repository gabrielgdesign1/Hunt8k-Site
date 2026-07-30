"use client";

import Image from "next/image";
import { SITE } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden">
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
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[var(--color-ash)] transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red-bright)]"
              >
                <SocialIcon icon={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-dim)] md:flex-row">
          <span>© {new Date().getFullYear()} Hunt8K. All rights reserved.</span>
          <span>Designed to stop the scroll.</span>
        </div>
      </div>
    </footer>
  );
}
