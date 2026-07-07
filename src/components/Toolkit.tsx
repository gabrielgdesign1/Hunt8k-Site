"use client";

import { motion } from "motion/react";
import { TOOLKIT } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

export default function Toolkit() {
  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <Reveal>
              <SectionLabel>The Toolkit</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display display-xl text-balance">
                Powerful tools.
                <br />
                <span className="text-outline">Exceptional results.</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-5 max-w-md text-[var(--color-ash)]">
                The right software paired with real design strategy — every
                pixel intentional, every export optimised for the platform.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col divide-y divide-white/10">
            {TOOLKIT.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group py-6"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl uppercase transition-colors group-hover:text-[var(--color-red-bright)] md:text-3xl">
                    {tool.name}
                  </h3>
                  <span className="font-mono text-sm text-[var(--color-ash)]">
                    {tool.level}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-ash-dim)]">
                  {tool.note}
                </p>
                <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tool.level}%` }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-red-deep)] to-[var(--color-red-bright)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
