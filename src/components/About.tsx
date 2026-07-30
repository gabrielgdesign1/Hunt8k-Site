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
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(228,0,1,0.35),transparent_60%)] blur-2xl"
          />
          <motion.div style={{ y }} className="relative">
            <Image
              src="/branding/about.png"
              alt="Hunt8K — thumbnail designer"
              width={900}
              height={900}
              className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </div>

        {/* text */}
        <div className="order-1 md:order-2">
          <Reveal>
            <SectionLabel>About Me</SectionLabel>
          </Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display display-lg text-balance">
              About <span className="text-gradient-red">Hunt8K</span>
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--color-ash)]">
              Hey! I’m Harrison (Hunt8K), I am a graphic designer and thumbnail
              strategist based out of the US. I started my design venture a
              couple years ago and have loved it ever since.
            </p>
          </Reveal>
          <Reveal i={3}>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-ash)]">
              I’m always seeking new clients and styles to connect with. Along
              with helping creators strategize the best ways to elevate their
              content!
            </p>
          </Reveal>
          <Reveal i={4}>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-ash)]">
              I love finding new ways to upgrade my design skills and help
              clients with their projects. Reach out today and let’s make
              something special!
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
