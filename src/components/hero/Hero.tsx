"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Lenis from "lenis";
import { WORK, workSrc } from "@/lib/site";
import { prefersReducedMotion, enableMotion } from "@/lib/motion";

const ThumbnailTunnel = dynamic(() => import("./ThumbnailTunnel"), {
  ssr: false,
});

function scrollToContact() {
  const el = document.querySelector("#contact") as HTMLElement | null;
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const [reduce, setReduce] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduce(prefersReducedMotion());
  }, []);

  return (
    <section id="top" className="relative z-10 h-screen overflow-hidden">
      <div className="flex h-full items-center justify-center">
        {/* 3D tunnel — static depth arrangement, reacts to mouse only */}
        {mounted && !reduce && (
          <div className="absolute inset-0" data-intro="fade">
            <ThumbnailTunnel />
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

        {/* vignette — light through the collage, heavier at the edges so the
            corner cards fall away into the ink */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,7,0.28)_0%,rgba(6,6,7,0.34)_45%,rgba(6,6,7,0.72)_78%,rgba(6,6,7,0.96)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />

        {/* contrast pool behind the headline — a gradient that fades fully to
            transparent, so it never shows an edge over the collage */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_46%_at_50%_46%,rgba(6,6,7,0.9)_0%,rgba(6,6,7,0.72)_38%,rgba(6,6,7,0.34)_66%,rgba(6,6,7,0)_100%)]" />

        {/* overlay content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
          {reduce && mounted && (
            <button
              onClick={enableMotion}
              className="mb-6 flex items-center gap-2 rounded-full border border-[var(--color-red)]/50 bg-[var(--color-red)]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-red-bright)] transition-colors hover:bg-[var(--color-red)]/20"
            >
              ⚡ Reduced motion detected — tap to enable full animation
            </button>
          )}

          <h1 className="font-display display-hero text-balance">
            <span
              className="block text-[var(--color-bone)]"
              data-intro="rise"
              style={{ "--intro-delay": "260ms" } as React.CSSProperties}
            >
              Turn Views Into
            </span>
            <span
              className="block text-[var(--color-red)]"
              data-intro="rise"
              style={{ "--intro-delay": "380ms" } as React.CSSProperties}
            >
              Clicks.
            </span>
          </h1>

          <button
            onClick={scrollToContact}
            data-intro="rise"
            className="group relative mt-9 overflow-hidden rounded-full px-9 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              "--intro-delay": "520ms",
              backgroundImage:
                "linear-gradient(180deg, #ff5a4d 0%, #ff2116 45%, #c40600 100%)",
            } as React.CSSProperties}
          >
            {/* top sheen */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/40 to-transparent" />
            {/* inner border highlight */}
            <span className="pointer-events-none absolute inset-0 rounded-full border border-white/25" />
            <span className="relative flex items-center gap-2">
              Contact
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
