"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { STATS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

function Counter({ value, suffix, run }: { value: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    const dur = 1700;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, value]);

  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}

// interleave the four data bars with thin decorative "equalizer" bars
type Col =
  | { type: "main"; idx: number }
  | { type: "deco"; h: number };

const COLUMNS: Col[] = [
  { type: "deco", h: 26 },
  { type: "deco", h: 48 },
  { type: "main", idx: 0 },
  { type: "deco", h: 38 },
  { type: "deco", h: 66 },
  { type: "main", idx: 1 },
  { type: "deco", h: 56 },
  { type: "deco", h: 32 },
  { type: "main", idx: 2 },
  { type: "deco", h: 46 },
  { type: "deco", h: 24 },
  { type: "main", idx: 3 },
  { type: "deco", h: 40 },
  { type: "deco", h: 20 },
];

const barGradient =
  "linear-gradient(to top, #a60400 0%, #ff2116 45%, #ff7a6e 100%)";

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="stats"
      className="relative z-10 overflow-hidden border-b border-white/[0.07] bg-[var(--color-ink)] py-24 md:py-32"
    >
      {/* radial red glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_78%,rgba(255,33,22,0.22),transparent_65%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>By the Numbers</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                Results that
                <br />
                <span className="text-gradient-red">speak for me.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <p className="max-w-sm text-[var(--color-ash)]">
              A few years of packaging videos for creators — and the numbers to
              back it up.
            </p>
          </Reveal>
        </div>

        {/* chart */}
        <div ref={ref} className="relative pb-16">
          {/* glowing reflection band at the baseline */}
          <div className="pointer-events-none absolute inset-x-0 bottom-16 h-24 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(255,60,45,0.35),transparent_70%)] blur-lg" />

          {/* bars */}
          <div className="relative flex h-[300px] items-end justify-center gap-2 sm:gap-4 md:h-[380px]">
            {COLUMNS.map((col, i) => {
              if (col.type === "deco") {
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${col.h}%` } : { height: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.1 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-2 shrink-0 rounded-full opacity-60 shadow-[0_0_14px_rgba(255,40,30,0.5)] sm:w-3"
                    style={{ backgroundImage: barGradient }}
                  />
                );
              }
              const s = STATS[col.idx];
              return (
                <div
                  key={i}
                  className="relative flex h-full w-16 shrink-0 flex-col items-center justify-end sm:w-24"
                >
                  {s.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="mb-2 flex items-center gap-1 whitespace-nowrap rounded-full border border-[var(--color-red)]/50 bg-[var(--color-red)]/20 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--color-red-bright)] shadow-[0_0_16px_rgba(255,40,30,0.5)] sm:text-[10px]"
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7.1-1z" />
                      </svg>
                      {s.badge}
                    </motion.div>
                  )}

                  <div className="mb-3 font-display text-2xl leading-none text-[var(--color-bone)] drop-shadow-[0_0_12px_rgba(255,40,30,0.5)] sm:text-4xl md:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} run={inView} />
                  </div>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${s.height}%` } : { height: 0 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2 + col.idx * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative w-full max-w-[70px] overflow-hidden rounded-full shadow-[0_0_28px_rgba(255,40,30,0.6)]"
                    style={{ backgroundImage: barGradient }}
                  >
                    <span className="absolute inset-y-0 left-1/2 w-1/3 -translate-x-1/2 bg-white/25 blur-[2px]" />
                  </motion.div>

                  {/* label */}
                  <div className="absolute -bottom-14 w-24 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.18em] text-[var(--color-ash)] sm:text-[11px]">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* baseline */}
          <div className="relative h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
