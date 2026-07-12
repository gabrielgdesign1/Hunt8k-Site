"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CREATORS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

// bento tile sizing — a few creators get feature tiles, the rest are compact
const SIZE: Record<string, "lg" | "wide" | "sm"> = {
  sypherpk: "lg",
  ishowspeed: "lg",
  kreekcraft: "wide",
  replays: "wide",
};

const SIZE_CLASS = {
  lg: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  sm: "col-span-1 row-span-1",
};

const NAME_CLASS = {
  lg: "text-2xl md:text-4xl",
  wide: "text-xl md:text-2xl",
  sm: "text-base md:text-lg",
};

export default function CreatorGrid() {
  return (
    <section
      id="creators"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,33,22,0.12),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mb-14 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <Reveal>
              <SectionLabel>Clients</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                Trusted by{" "}
                <span className="text-gradient-red italic">creators.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <div>
              <p className="text-[var(--color-ash)]">
                I have worked with numerous creators in all kinds of niches,
                from rising creators to multi-million subscriber channels across
                all types of niches like gaming, IRL, and everything in between.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="font-display text-4xl text-[var(--color-bone)] md:text-5xl">
                  50M+
                </span>
                <span className="font-mono text-[11px] uppercase leading-tight tracking-widest text-[var(--color-ash)]">
                  combined
                  <br />
                  subscribers
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* bento grid */}
        <div
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          style={{ gridAutoFlow: "dense", gridAutoRows: "minmax(120px, auto)" }}
        >
          {CREATORS.map((c, i) => {
            const size = SIZE[c.slug] ?? "sm";
            return (
              <motion.a
                key={c.slug}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.6,
                  delay: (i % 5) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-ink-2)] ${SIZE_CLASS[size]}`}
              >
                <Image
                  src={`/creators/${c.slug}.webp`}
                  alt={c.name}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/95" />
                {/* red ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-transparent transition-colors duration-300 group-hover:ring-[var(--color-red)]" />

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                  <div
                    className={`font-display uppercase leading-none text-[var(--color-bone)] ${NAME_CLASS[size]}`}
                  >
                    {c.name}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-ash)] md:text-[10px]">
                    <span className="text-[var(--color-red-bright)]">
                      {c.subs}
                    </span>
                    <span className="opacity-40">·</span>
                    <span className="truncate">{c.handle}</span>
                  </div>
                </div>

                {/* corner arrow */}
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
