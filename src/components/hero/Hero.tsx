"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { WORK, workSrc } from "@/lib/site";
import { prefersReducedMotion, enableMotion } from "@/lib/motion";

const ThumbnailTunnel = dynamic(() => import("./ThumbnailTunnel"), {
  ssr: false,
});

export default function Hero() {
  const [reduce, setReduce] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduce(prefersReducedMotion());
  }, []);

  return (
    <section id="top" className="relative h-screen overflow-hidden">
      <div className="flex h-full items-center justify-center">
        {/* 3D tunnel — static depth arrangement, reacts to mouse only */}
        {mounted && !reduce && (
          <div className="absolute inset-0">
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

        {/* vignette + gradient wash — darkest through the center so text stays readable */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,7,0.6)_0%,rgba(6,6,7,0.35)_38%,rgba(6,6,7,0.75)_72%,rgba(6,6,7,0.97)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />

        {/* dedicated contrast plate directly behind the headline block */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[85%] w-[94%] max-w-3xl rounded-[4rem] bg-[var(--color-ink)]/65 blur-3xl" />
        </div>

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
            <span className="block text-[var(--color-bone)]">Turn Views Into</span>
            <span className="block text-[var(--color-red)]">Clicks.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
