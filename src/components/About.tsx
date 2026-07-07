"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section id="about" ref={ref} className="relative z-10 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        {/* graphic */}
        <div className="relative order-2 md:order-1">
          <motion.div
            style={{ y: glowY }}
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,33,22,0.35),transparent_60%)] blur-2xl"
          />
          <motion.div style={{ y }} className="relative">
            <div className="absolute -left-4 -top-4 font-display text-[9rem] leading-none text-white/[0.03] select-none">
              8K
            </div>
            <Image
              src="/branding/about.png"
              alt="Hunt8K — thumbnail designer"
              width={900}
              height={900}
              className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
          {/* floating chips */}
          <div className="absolute right-2 top-6 rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
            <div className="font-display text-2xl text-[var(--color-red-bright)]">3+ yrs</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
              Designing
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
            <div className="font-display text-2xl text-[var(--color-bone)]">Gaming + IRL</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
              Specialist
            </div>
          </div>
        </div>

        {/* text */}
        <div className="order-1 md:order-2">
          <Reveal>
            <SectionLabel>About Me</SectionLabel>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display display-lg text-balance">
              I turn raw clips into
              <span className="text-gradient-red"> click magnets.</span>
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 max-w-xl text-[var(--color-ash)] leading-relaxed">
              I&apos;m Hunt8K, a thumbnail designer obsessed with one thing:
              making people <em className="text-[var(--color-bone)] not-italic">click</em>.
              For the last few years I&apos;ve packaged videos for gaming and IRL
              creators — from Fortnite montages to live-stream reactions — and
              watched channels grow because of it.
            </p>
          </Reveal>
          <Reveal i={3}>
            <p className="mt-4 max-w-xl text-[var(--color-ash)] leading-relaxed">
              Every thumbnail is part design, part psychology: bold contrast,
              readable faces, and a hook the viewer can&apos;t ignore. No
              templates, no filler — just work built to win the impression.
            </p>
          </Reveal>

          <Reveal i={4}>
            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { k: "900+", v: "Thumbnails" },
                { k: "60+", v: "Creators" },
                { k: "24h", v: "Turnaround" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-4xl text-[var(--color-bone)]">
                    {s.k}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-dim)]">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
