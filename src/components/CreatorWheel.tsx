"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CREATORS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

// precomputed evenly-around-the-ring positions (% of container) + px sizes.
// static so server and client render byte-identical (no Math at render time).
const POSITIONS = [
  { x: 50, y: 7.607, size: 47 },
  { x: 69.181, y: 13.455, size: 49 },
  { x: 86.325, y: 24.927, size: 62 },
  { x: 90.077, y: 45.134, size: 58 },
  { x: 88.154, y: 64.47, size: 60 },
  { x: 79.612, y: 83.426, size: 57 },
  { x: 60.426, y: 92.3, size: 46 },
  { x: 39.451, y: 92.797, size: 62 },
  { x: 21.367, y: 82.32, size: 55 },
  { x: 12.483, y: 64.228, size: 64 },
  { x: 5.629, y: 44.612, size: 62 },
  { x: 14.862, y: 25.746, size: 48 },
  { x: 28.884, y: 9.767, size: 57 },
];

export default function CreatorWheel() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % CREATORS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const nodes = CREATORS.map((c, i) => ({ creator: c, i, ...POSITIONS[i] }));
  const current = CREATORS[active];

  return (
    <section
      id="creators"
      className="relative z-10 overflow-hidden border-b border-white/[0.07] py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,33,22,0.16),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:grid-cols-2 md:gap-8 md:px-8">
        {/* left — copy + active creator */}
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
          <Reveal i={2}>
            <p className="mt-5 max-w-md text-[var(--color-ash)]">
              {CREATORS.length} creators and counting — from rising channels to
              multi-million subscriber names across Fortnite and IRL content.
            </p>
          </Reveal>

          {/* active creator card */}
          <div className="mt-10 flex min-h-[72px] items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.a
                key={current.slug}
                href={current.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-4"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-red)]/60 shadow-[0_0_20px_rgba(255,33,22,0.4)]">
                  <Image
                    src={`/creators/${current.slug}.webp`}
                    alt={current.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span>
                  <span className="flex items-center gap-2 font-display text-2xl uppercase leading-none">
                    {current.name}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[var(--color-ash)] transition-colors group-hover:text-[var(--color-red-bright)]"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ash)]">
                    {current.handle}
                  </span>
                </span>
              </motion.a>
            </AnimatePresence>
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug + "-subs"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-display text-4xl text-[var(--color-bone)] md:text-5xl"
              >
                {current.subs.replace("+", "")}
                <span className="ml-2 align-middle font-mono text-xs uppercase tracking-widest text-[var(--color-ash)]">
                  subscribers
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* progress */}
          <div className="mt-10 flex max-w-sm items-center gap-4">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-red-bright)] to-[var(--color-red-deep)]"
                animate={{ width: `${((active + 1) / CREATORS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-xs tracking-widest text-[var(--color-ash)]">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(CREATORS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* right — spinning wheel */}
        <div className="flex justify-center md:justify-end">
          <div
            className="relative aspect-square w-full max-w-[460px]"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            {/* orbit guide rings */}
            <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />

            {/* rotating ring of avatars */}
            <div
              className="absolute inset-0"
              style={{ animation: "spin-slow 48s linear infinite" }}
            >
              {nodes.map((node) => {
                const isActive = node.i === active;
                return (
                  <div
                    key={node.creator.slug}
                    className="absolute"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      width: node.size,
                      height: node.size,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* counter-rotate so photos stay upright while orbiting */}
                    <div
                      className="h-full w-full"
                      style={{ animation: "spin-slow 48s linear infinite reverse" }}
                    >
                      <button
                        onClick={() => setActive(node.i)}
                        className={`relative block h-full w-full overflow-hidden rounded-full border transition-all duration-500 ${
                          isActive
                            ? "border-[var(--color-red)] shadow-[0_0_22px_rgba(255,33,22,0.7)] scale-110"
                            : "border-white/15 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={`/creators/${node.creator.slug}.webp`}
                          alt={node.creator.name}
                          fill
                          sizes="70px"
                          className="object-cover"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* center — active creator */}
            <div className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-[var(--color-red)]/30 blur-2xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug + "-center"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-full overflow-hidden rounded-full border-4 border-[var(--color-red)]/70 shadow-[0_0_40px_rgba(255,33,22,0.6)]"
                >
                  <Image
                    src={`/creators/${current.slug}.webp`}
                    alt={current.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
