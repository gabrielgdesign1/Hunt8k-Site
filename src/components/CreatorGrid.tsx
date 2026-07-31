"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CREATORS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

const STEP_MS = 2400;

export default function CreatorGrid() {
  // `auto` cycles on a timer; `hovered` overrides it while the pointer is on a
  // node. Touch devices never hover, so the cycle is what surfaces every
  // creator's details there — the dial is readable without any interaction.
  const [auto, setAuto] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  const activeIndex = hovered ?? auto;
  const active = CREATORS[activeIndex];
  const angleStep = 360 / CREATORS.length;

  useEffect(() => {
    if (hovered !== null) return; // pause the cycle while pointing at someone

    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      id = setInterval(
        () => setAuto((n) => (n + 1) % CREATORS.length),
        STEP_MS
      );
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };
    // A hidden tab still fires timers but freezes rAF, so the hub's exit
    // animations would never finish and stale entries would pile up behind
    // the current one. Nothing to look at while hidden anyway.
    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hovered]);

  // Cleared by the dial's own native pointerleave rather than React's
  // enter/leave synthesis, which is easy to miss on a fast flick out.
  useEffect(() => {
    const el = dialRef.current;
    const clear = () => setHovered(null);
    el?.addEventListener("pointerleave", clear);
    return () => el?.removeEventListener("pointerleave", clear);
  }, []);

  // One handler on the dial instead of an onPointerEnter per node. Crucially
  // it does NOT clear when the pointer is between nodes — otherwise crossing a
  // gap would drop back to the auto-cycle and flicker.
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>("[data-node]");
    if (!node) return;
    const idx = Number(node.dataset.node);
    setHovered((prev) => (prev === idx ? prev : idx));
  };

  return (
    <section
      id="creators"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(228,0,1,0.12),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* copy */}
          <div>
            <Reveal>
              <SectionLabel>Clients</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-lg text-balance">
                Trusted by{" "}
                <span className="text-gradient-red italic">creators.</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 max-w-md text-[var(--color-ash)]">
                I have worked with numerous creators in all kinds of niches,
                from rising creators to multi-million subscriber channels across
                all types of niches like gaming, IRL, and everything in between.
              </p>
            </Reveal>
            <Reveal i={3}>
              <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6">
                <div>
                  <div className="font-display text-4xl leading-none text-[var(--color-bone)] md:text-5xl">
                    50M+
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                    combined subscribers
                  </div>
                </div>
                <div className="h-10 w-px bg-white/12" />
                <div>
                  <div className="font-display text-4xl leading-none text-[var(--color-bone)] md:text-5xl">
                    {CREATORS.length}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                    creators
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* dial */}
          <Reveal i={2} className="flex justify-center lg:justify-end">
            <div
              ref={dialRef}
              className="dial"
              style={
                {
                  "--size": "clamp(292px, 44vw, 520px)",
                  "--node": "clamp(44px, 6.6vw, 66px)",
                } as React.CSSProperties
              }
              onPointerMove={track}
            >
              {/* rings */}
              <div className="absolute inset-0 rounded-full border border-white/[0.09]" />
              <div className="absolute inset-[13%] rounded-full border border-dashed border-white/[0.07]" />
              <div className="dial-sweep pointer-events-none absolute inset-0 rounded-full" />

              {/* needle pointing at the active creator */}
              <motion.div
                className="pointer-events-none absolute bottom-1/2 left-1/2 w-px origin-bottom"
                style={{
                  height:
                    "calc((var(--size) / 2) - var(--node) - 16px)",
                  marginLeft: "-0.5px",
                  background:
                    "linear-gradient(to top, transparent, var(--color-red))",
                }}
                animate={{ rotate: activeIndex * angleStep }}
                transition={{ type: "spring", stiffness: 110, damping: 17 }}
              />

              {/* hub — the active creator's details */}
              <div className="absolute inset-[25%] overflow-hidden rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                {/* Cross-fade rather than mode="wait": the incoming creator
                    shouldn't have to queue behind the outgoing one's exit, or
                    sweeping the pointer across nodes lags a frame behind. */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
                  >
                    <div className="font-display text-[clamp(0.95rem,2.4vw,1.5rem)] uppercase leading-none text-[var(--color-bone)]">
                      {active.name}
                    </div>
                    <div className="mt-2 font-mono text-[clamp(7px,1.1vw,10px)] uppercase tracking-widest text-[var(--color-ash-dim)]">
                      {active.handle}
                    </div>
                    <div className="mt-3 font-display text-[clamp(1.1rem,3vw,2rem)] leading-none text-[var(--color-red-bright)]">
                      {active.subs}
                    </div>
                    <div className="mt-1 font-mono text-[clamp(6px,0.9vw,9px)] uppercase tracking-widest text-[var(--color-ash-dim)]">
                      subscribers
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* the ring of creators */}
              {CREATORS.map((c, i) => {
                const isActive = i === activeIndex;
                return (
                  <a
                    key={c.slug}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${c.name} — ${c.subs} subscribers`}
                    data-node={i}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="dial-node group rounded-full"
                    style={{ "--angle": `${i * angleStep}deg` } as React.CSSProperties}
                  >
                    <span
                      className={`relative block h-full w-full overflow-hidden rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] ${
                        isActive
                          ? "scale-110 border-[var(--color-red)] shadow-[0_0_22px_-4px_rgba(228,0,1,0.9)]"
                          : "border-white/15 opacity-55 group-hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/creators/${c.slug}.webp`}
                        alt=""
                        fill
                        sizes="66px"
                        className={`object-cover transition-all duration-500 ${
                          isActive ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                        }`}
                      />
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
