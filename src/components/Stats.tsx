"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/site";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const reduce = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;
            if (reduce) {
              setN(value);
              return;
            }
            const dur = 1600;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(eased * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative z-10 border-y border-white/[0.07] bg-[var(--color-ink-2)] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="group text-center md:text-left">
            <div className="font-display text-5xl leading-none text-[var(--color-bone)] transition-colors duration-300 group-hover:text-[var(--color-red-bright)] md:text-7xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ash)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
