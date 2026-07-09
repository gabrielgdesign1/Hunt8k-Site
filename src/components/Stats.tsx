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
      className="relative z-10 border-b border-white/[0.07] bg-[var(--color-ink-2)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
        <div ref={ref} className="relative">
          {/* gridlines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-px w-full bg-white/[0.06]" />
            ))}
          </div>

          {/* bars */}
          <div className="relative grid h-[300px] grid-cols-4 items-end gap-3 sm:gap-8 md:h-[380px]">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex h-full flex-col items-center justify-end"
              >
                {s.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9 + i * 0.12, duration: 0.5 }}
                    className="mb-2 flex items-center gap-1 rounded-full border border-[var(--color-red)]/40 bg-[var(--color-red)]/15 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--color-red-bright)] sm:text-[10px]"
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7.1-1z" />
                    </svg>
                    {s.badge}
                  </motion.div>
                )}

                <div className="mb-3 font-display text-2xl leading-none text-[var(--color-bone)] sm:text-4xl md:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} run={inView} />
                </div>

                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${s.height}%` } : { height: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative w-full max-w-[110px] overflow-hidden rounded-t-xl bg-gradient-to-t from-[var(--color-red-deep)] to-[var(--color-red-bright)]"
                >
                  <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent" />
                </motion.div>
              </div>
            ))}
          </div>

          {/* baseline */}
          <div className="h-px w-full bg-[var(--color-red)]/40" />

          {/* labels */}
          <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-8">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ash)] sm:text-[11px] sm:tracking-[0.25em]"
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
