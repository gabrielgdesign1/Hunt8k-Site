"use client";

import { TESTIMONIALS, type Testimonial } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

function Card({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <figure className="flex w-[85vw] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-7 transition-colors duration-300 hover:border-[var(--color-red)]/40 sm:w-[420px]">
      <div>
        <div className="mb-4 flex gap-0.5 text-[var(--color-red)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7.1-1z" />
            </svg>
          ))}
        </div>
        <blockquote className="text-[15px] leading-relaxed text-[var(--color-bone)]/90">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-red-bright)] to-[var(--color-red-deep)] font-display text-sm text-white">
          {initials}
        </span>
        <div>
          <div className="font-semibold leading-tight">{t.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-dim)]">
            {t.handle} · {t.subs}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  reverse,
  duration,
}: {
  items: Testimonial[];
  reverse?: boolean;
  duration: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-paused flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
      <div
        className="animate-marquee flex shrink-0 gap-5 pr-5"
        style={{
          ["--duration" as string]: duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  return (
    <section id="reviews" className="relative z-10 overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-14 max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Testimonials</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                What creators
                <br />
                <span className="text-gradient-red">say.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <p className="max-w-sm text-[var(--color-ash)]">
              Honest words from the creators who trust 8K with the first thing
              their audience ever sees.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Row items={TESTIMONIALS.slice(0, half)} duration="46s" />
        <Row items={TESTIMONIALS.slice(half)} reverse duration="52s" />
      </div>
    </section>
  );
}
