"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { WORK, SITE, workSrc, type Work as WorkType } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

const FILTERS = [
  { key: "all", label: "All Work" },
  { key: "gaming", label: "Gaming" },
  { key: "irl", label: "IRL & Desktop" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** One full 3x3 before the reveal. */
const INITIAL = 9;

const GAMING = WORK.filter((w) => w.category === "gaming");
const IRL = WORK.filter((w) => w.category === "irl");

// "All" alternates the two categories so the opening 3x3 is a genuine mix
// rather than the first nine gaming pieces. Falls back gracefully whenever
// one category is longer than the other.
function interleave(a: WorkType[], b: WorkType[]): WorkType[] {
  const out: WorkType[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

const SETS: Record<FilterKey, WorkType[]> = {
  all: interleave(GAMING, IRL),
  gaming: GAMING,
  irl: IRL,
};

const BEHANCE =
  SITE.socials.find((s) => s.icon === "behance")?.href ??
  "https://www.behance.net/Hunt8K";

export default function Work() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const items = SETS[filter];
  const visible = expanded ? items : items.slice(0, INITIAL);
  const remaining = items.length - visible.length;

  const pickFilter = (key: FilterKey) => {
    setFilter(key);
    setExpanded(false);
    setActive(null);
  };

  // `active` indexes the current filtered set, so prev/next stay within it.
  const open = (w: WorkType) => setActive(items.indexOf(w));
  const close = () => setActive(null);
  const step = (dir: number) =>
    setActive((a) => (a === null ? a : (a + dir + items.length) % items.length));

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items.length]);

  const current = active === null ? null : items[active];

  const lightbox = (
    <AnimatePresence>
      {current && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
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
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)] md:left-8"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)] md:right-8"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <motion.figure
            key={current.slug}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            <div className="glow-red relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
              <Image
                src={workSrc(current)}
                alt={current.title}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex justify-end font-mono text-xs text-[var(--color-ash-dim)]">
              {String(active! + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
                  onClick={() => pickFilter(f.key)}
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

        {/* grid — thumbnails only, no captions */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((w, i) => (
              <motion.button
                layout
                key={w.slug}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  duration: 0.5,
                  // stagger across each row rather than the whole list, so a
                  // revealed batch doesn't trail in for a second and a half
                  delay: (i % 3) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => open(w)}
                className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[var(--color-ink-3)]"
                aria-label={`View ${w.title}`}
              >
                <Image
                  src={workSrc(w)}
                  alt={w.title}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* reveal + portfolio */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <AnimatePresence>
            {remaining > 0 && (
              <motion.button
                key="view-more"
                onClick={() => setExpanded(true)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-[var(--color-bone)] transition-colors duration-300 hover:border-[var(--color-red)] hover:bg-[var(--color-red)]/10"
              >
                View more
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Only appears once the grid is fully expanded — before that,
              "View more" is already offering the next step. */}
          <AnimatePresence>
            {expanded && (
              <motion.a
                key="portfolio"
                href={BEHANCE}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #ff2424 0%, #e40001 45%, #420101 100%)",
                }}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/40 to-transparent" />
                <span className="pointer-events-none absolute inset-0 rounded-full border border-white/25" />
                <span className="relative flex items-center gap-2">
                  View full portfolio
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Portalled to <body>: this section is `relative z-10` inside another
          `relative z-10` wrapper, so anything rendered in here is capped at
          z-10 against the fixed navbar (z-50) no matter how high its own
          z-index is — which is what stopped the close button receiving
          clicks. Escaping to the body puts it in the same stacking context
          as the navbar, where z-120 actually wins. */}
      {mounted && createPortal(lightbox, document.body)}
    </section>
  );
}
