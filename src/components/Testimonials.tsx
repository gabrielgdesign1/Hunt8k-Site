"use client";

import Image from "next/image";
import { TESTIMONIALS, type Testimonial } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

function Card({ t }: { t: Testimonial }) {
  // The fill is deliberately almost nothing — on an ink background even 5%
  // white reads as a solid grey panel rather than glass. The card is defined
  // by its lit edges and the blur of whatever passes behind it.
  return (
    <figure className="group relative flex w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.14] bg-white/[0.012] p-7 backdrop-blur-2xl transition-colors duration-300 hover:border-[var(--color-red)]/45 sm:w-[400px]">
      {/* glass highlights — a lit top edge and a soft diagonal sheen */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <span className="pointer-events-none absolute -left-1/3 -top-1/2 h-[180%] w-[60%] rotate-12 bg-gradient-to-b from-white/[0.05] to-transparent blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex gap-0.5 text-[var(--color-red)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7.1-1z" />
            </svg>
          ))}
        </div>
        <blockquote className="text-[15px] leading-relaxed text-[var(--color-bone)]/90">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>

      <figcaption className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
          <Image
            src={`/reviews/${t.avatar}.webp`}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
        <div className="font-semibold leading-tight">{t.name}</div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  // Duplicated once so the -50% marquee keyframe loops seamlessly.
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      id="reviews"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto mb-14 max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Testimonials</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                <span className="text-gradient-red">Reviews.</span>
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

      {/* One track, one direction. The edges are faded with gradient scrims
          rather than a CSS mask: a mask on an ancestor forms a backdrop root,
          which would stop the cards' backdrop-blur from picking up the
          particle field behind them — and there goes the glass. */}
      <div className="relative flex overflow-hidden">
        <div
          className="animate-marquee flex shrink-0 gap-5 pr-5"
          style={{ ["--duration" as string]: "62s" }}
        >
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[18%] min-w-24 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[18%] min-w-24 bg-gradient-to-l from-[var(--color-ink)] via-[var(--color-ink)]/55 to-transparent" />
      </div>
    </section>
  );
}
