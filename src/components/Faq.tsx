"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAQ } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8">
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal>
            <SectionLabel>FAQ</SectionLabel>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display display-lg text-balance">
              Questions,
              <br />
              answered.
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 max-w-xs text-[var(--color-ash)]">
              Everything you need to know before we start. Still curious? Just
              send a message.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-white/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl uppercase leading-tight transition-colors group-hover:text-[var(--color-red-bright)] md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-[var(--color-red)] bg-[var(--color-red)]"
                        : "border-white/20"
                    }`}
                  >
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span
                      className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-7 text-[var(--color-ash)] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
