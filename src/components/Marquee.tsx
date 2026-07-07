"use client";

import { CLIENTS } from "@/lib/site";

export default function Marquee() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <section className="relative z-10 border-y border-white/[0.07] bg-[var(--color-ink-2)] py-6">
      <div className="mb-5 flex justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-ash-dim)]">
          Trusted by creators with 100M+ combined subscribers
        </span>
      </div>
      <div className="marquee-paused relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div
          className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
          style={{ ["--duration" as string]: "38s" }}
        >
          {row.map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap font-display text-3xl uppercase tracking-tight text-[var(--color-ash-dim)] transition-colors hover:text-[var(--color-bone)] sm:text-4xl"
            >
              {c}
              <span className="text-[var(--color-red)]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
