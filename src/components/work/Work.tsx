"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { WORK, workSrc, type Work as WorkType } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

const FILTERS = [
  { key: "all", label: "All Work" },
  { key: "gaming", label: "Gaming" },
  { key: "irl", label: "IRL & Streams" },
] as const;

export default function Work() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [active, setActive] = useState<number | null>(null);

  const items = WORK.filter((w) => filter === "all" || w.category === filter);

  const open = (w: WorkType) => setActive(WORK.indexOf(w));
  const close = () => setActive(null);
  const step = (dir: number) => {
    setActive((a) => {
      if (a === null) return a;
      return (a + dir + WORK.length) % WORK.length;
    });
  };

  return (
    <section id="work" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        {/* header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Selected Work</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                Thumbnails that
                <br />
                <span className="text-outline-red">earn the click.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    filter === f.key
                      ? "border-[var(--color-red)] bg-[var(--color-red)] text-white"
                      : "border-white/12 text-[var(--color-ash)] hover:border-white/30 hover:text-[var(--color-bone)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((w, i) => (
              <motion.button
                layout
                key={w.slug}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => open(w)}
                className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[var(--color-ink-3)] text-left"
              >
                <Image
                  src={workSrc(w)}
                  alt={w.title}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-red-bright)]">
                    {w.client} · {w.tag}
                  </div>
                  <div className="font-display text-2xl uppercase leading-none">
                    {w.title}
                  </div>
                </div>
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)] md:left-8"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)] md:right-8"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <motion.figure
              key={WORK[active].slug}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 glow-red">
                <Image
                  src={workSrc(WORK[active])}
                  alt={WORK[active].title}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl uppercase">{WORK[active].title}</div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-ash)]">
                    {WORK[active].client} · {WORK[active].category}
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--color-ash-dim)]">
                  {String(active + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
