"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { CREATORS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { prefersReducedMotion } from "@/lib/motion";

const CARD_W = 220;
const CARD_H = 280;

export default function CreatorGrid() {
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Cursor position, trailed by a spring so the card lags behind the pointer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 34, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 320, damping: 34, mass: 0.7 });

  // Tilt is driven by horizontal speed and unwinds to flat on its own as soon
  // as the pointer settles, because velocity decays to zero.
  const velocity = useVelocity(sx);
  const tilt = useTransform(velocity, [-1600, 0, 1600], [-16, 0, 16], {
    clamp: true,
  });
  const smoothTilt = useSpring(tilt, { stiffness: 180, damping: 22 });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches && !prefersReducedMotion());
    apply();
    mq.addEventListener("change", apply);

    // Bound natively rather than via onPointerLeave so the card is dismissed
    // by the element's own event, independent of React's enter/leave
    // synthesis — which is easy to miss on a fast flick out of the list.
    const el = listRef.current;
    const clear = () => setActive(null);
    el?.addEventListener("pointerleave", clear);

    return () => {
      mq.removeEventListener("change", apply);
      el?.removeEventListener("pointerleave", clear);
    };
  }, []);

  // One handler on the list rather than an onPointerEnter per row: the row
  // under the cursor is resolved from the event target, which stays correct
  // when the pointer moves fast enough to skip a row's enter event.
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover) return;
    x.set(e.clientX);
    y.set(e.clientY);
    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    const idx = row ? Number(row.dataset.row) : null;
    setActive((prev) => (prev === idx ? prev : idx));
  };

  const current = active === null ? null : CREATORS[active];

  return (
    <section
      id="creators"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(228,0,1,0.12),transparent_65%)] blur-2xl" />

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

        {/* ledger header */}
        <Reveal i={3}>
          <div className="flex items-end justify-between border-b border-white/20 pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-ash-dim)]">
            <span>{CREATORS.length} Creators</span>
            <span>Subscribers</span>
          </div>
        </Reveal>

        {/* the roster */}
        <div
          ref={listRef}
          className="roster"
          onPointerMove={track}
        >
          {CREATORS.map((c, i) => (
            <motion.a
              key={c.slug}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              data-row={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{
                duration: 0.6,
                delay: Math.min(i, 8) * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="roster-row group relative flex items-center gap-4 border-b border-white/10 py-4 md:gap-8 md:py-6"
            >
              {/* red wash sweeping in from the left */}
              <span className="pointer-events-none absolute inset-y-0 -inset-x-4 origin-left scale-x-0 bg-gradient-to-r from-[var(--color-red)]/20 via-[var(--color-red)]/6 to-transparent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 md:-inset-x-8" />

              <span className="relative w-6 shrink-0 font-mono text-[10px] tracking-widest text-[var(--color-ash-dim)] transition-colors duration-300 group-hover:text-[var(--color-red-bright)] md:w-10 md:text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* small marker portrait — colour arrives on hover */}
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/15 md:h-11 md:w-11">
                <Image
                  src={`/creators/${c.slug}.webp`}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover opacity-55 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </span>

              <span className="relative min-w-0 flex-1">
                <span className="roster-name block font-display text-[clamp(1.3rem,4.6vw,3.5rem)] uppercase leading-[1.06] transition-transform duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-3">
                  {c.name}
                </span>
              </span>

              <span className="relative hidden shrink-0 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ash-dim)] transition-colors duration-300 group-hover:text-[var(--color-ash)] lg:block">
                {c.handle}
              </span>

              <span className="relative shrink-0 font-mono text-[11px] tracking-widest text-[var(--color-red-bright)] md:text-sm">
                {c.subs}
              </span>

              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center text-[var(--color-ash-dim)] transition-all duration-300 group-hover:text-[var(--color-red-bright)] md:h-9 md:w-9">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Cursor-trailing portrait. Portalled to <body> because this section is
          `relative z-10` inside another `relative z-10` wrapper — anything
          fixed in here is capped at z-10 and would slide under the navbar. */}
      {mounted &&
        canHover &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                key="roster-preview"
                className="pointer-events-none fixed left-0 top-0 z-[70]"
                style={{ x: sx, y: sy }}
              >
                <motion.div
                  style={{ rotate: smoothTilt }}
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.95)]"
                >
                  {/* Centred on the cursor via negative margins, not a
                      -translate utility: motion owns `transform` on the
                      wrapper above, so a Tailwind translate would be
                      clobbered by the rotate. */}
                  <div
                    className="relative"
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      marginLeft: -CARD_W / 2,
                      marginTop: -CARD_H / 2,
                    }}
                  >
                    <AnimatePresence>
                      <motion.div
                        key={current.slug}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Image
                          src={`/creators/${current.slug}.webp`}
                          alt=""
                          fill
                          sizes="220px"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="font-display text-lg uppercase leading-none text-[var(--color-bone)]">
                        {current.name}
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-red-bright)]">
                        {current.subs} subs
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
