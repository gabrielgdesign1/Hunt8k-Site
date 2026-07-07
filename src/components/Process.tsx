"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROCESS } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <SectionLabel>The Process</SectionLabel>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display display-xl text-balance">
              Three steps behind
              <br />
              every thumbnail.
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 text-[var(--color-ash)]">
              A tight process built around strategy, psychology and speed — so
              every drop is engineered to perform.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative pl-8 md:pl-0">
          {/* rail */}
          <div className="absolute left-1 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              style={{ height }}
              className="w-full bg-gradient-to-b from-[var(--color-red-bright)] to-[var(--color-red-deep)]"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {PROCESS.map((step, i) => (
              <div
                key={step.no}
                className="relative md:grid md:grid-cols-2 md:gap-16"
              >
                {/* node */}
                <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                  <span className="h-4 w-4 rounded-full border-2 border-[var(--color-red)] bg-[var(--color-ink)]" />
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={i % 2 === 1 ? "md:col-start-2" : ""}
                >
                  <div className="font-display text-7xl text-white/10 md:text-8xl">
                    {step.no}
                  </div>
                  <h3 className="mt-2 font-display text-3xl uppercase md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[var(--color-ash)] leading-relaxed">
                    {step.body}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
