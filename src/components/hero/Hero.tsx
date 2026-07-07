"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MagneticButton from "@/components/ui/MagneticButton";
import { WORK, workSrc } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/motion";

const ThumbnailTunnel = dynamic(() => import("./ThumbnailTunnel"), {
  ssr: false,
});

function scrollTo(href: string) {
  const el = document.querySelector(href) as HTMLElement | null;
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [reduce, setReduce] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const r = prefersReducedMotion();
    setReduce(r);
    if (r || !wrap.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });

      gsap.to(overlay.current, {
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "55% top",
          scrub: 0.6,
        },
        opacity: 0,
        scale: 1.14,
        filter: "blur(6px)",
        ease: "none",
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={wrap}
      className={reduce ? "relative" : "relative h-[340vh]"}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* 3D tunnel */}
        {mounted && !reduce && (
          <div className="absolute inset-0">
            <ThumbnailTunnel progress={progress} />
          </div>
        )}

        {/* reduced-motion / fallback collage */}
        {reduce && (
          <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-30">
            {WORK.slice(0, 6).map((w) => (
              <div key={w.slug} className="relative overflow-hidden">
                <Image
                  src={workSrc(w, true)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        )}

        {/* vignette + gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(6,6,7,0.7)_70%,rgba(6,6,7,0.98)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />

        {/* overlay content */}
        <div
          ref={overlay}
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center will-change-transform"
        >
          <div className="mb-7 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-red)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-red)]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-ash)]">
              Available for work · {WORK.length}+ recent drops
            </span>
          </div>

          <h1 className="font-display display-hero text-balance">
            <span className="block text-[var(--color-bone)]">Make Them</span>
            <span className="block text-gradient-red">Click.</span>
          </h1>

          <p className="mt-7 max-w-xl text-balance text-base leading-relaxed text-[var(--color-ash)] sm:text-lg">
            I&apos;m <span className="text-[var(--color-bone)]">Hunt8K</span> — I
            design high-octane gaming &amp; IRL thumbnails engineered to hijack
            attention and spike your CTR.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticButton
              as="button"
              onClick={() => scrollTo("#work")}
              cursor="see work"
              className="group relative overflow-hidden rounded-full bg-[var(--color-red)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white"
            >
              <span className="relative z-10">View the Work</span>
              <span className="absolute inset-0 -translate-x-full bg-black/85 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
              <span className="pointer-events-none absolute inset-0 z-10 flex -translate-x-full items-center justify-center text-sm font-bold uppercase tracking-wide text-white transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0">
                View the Work
              </span>
            </MagneticButton>
            <MagneticButton
              as="button"
              onClick={() => scrollTo("#contact")}
              cursor="let's talk"
              className="rounded-full border border-white/15 px-8 py-4 text-sm font-bold uppercase tracking-wide text-[var(--color-bone)] backdrop-blur-md transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red-bright)]"
            >
              Start a Project
            </MagneticButton>
          </div>
        </div>

        {/* scroll hint */}
        {!reduce && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-ash-dim)]">
              Scroll to enter
            </span>
            <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
              <span className="h-2 w-0.5 animate-bounce rounded-full bg-[var(--color-red)]" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
