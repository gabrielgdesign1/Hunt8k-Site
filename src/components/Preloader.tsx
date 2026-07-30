"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";
import { getSavedScroll } from "@/lib/scroll";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  // "quick" = coming back to a position mid-page, so the panel is just a
  // brief cover while SmoothScroll restores the offset underneath. Showing
  // the counter and the intro there would be wrong — you never left.
  const [quick, setQuick] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      return;
    }

    if (getSavedScroll() > 0) {
      setQuick(true);
      const t = setTimeout(() => setDone(true), 460);
      return () => clearTimeout(t);
    }

    const root = document.documentElement;
    root.classList.add("intro-armed");

    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 9) + 3;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => {
          setDone(true);
          root.classList.remove("intro-armed");
          root.classList.add("intro-play");
        }, 420);
      }
      setCount(n);
    }, 90);

    return () => {
      clearInterval(id);
      // Never leave the page armed-but-not-played, or [data-intro] elements
      // would stay at opacity 0.
      root.classList.remove("intro-armed");
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-ink)] ease-[var(--ease-out-expo)] ${
        quick
          ? "transition-opacity duration-500"
          : "transition-[opacity,transform] duration-700"
      } ${
        done
          ? `pointer-events-none opacity-0 ${quick ? "" : "-translate-y-full"}`
          : "translate-y-0 opacity-100"
      }`}
    >
      {!quick && (
        <div className="relative flex flex-col items-center">
          <Image
            src="/branding/logo.png"
            alt="Hunt8K"
            width={120}
            height={72}
            priority
            className="mb-6 h-16 w-auto drop-shadow-[0_0_40px_rgba(255,33,22,0.55)]"
          />
          <div className="h-px w-56 overflow-hidden bg-white/10">
            <div
              className="h-full bg-[var(--color-red)]"
              style={{ width: `${count}%`, transition: "width 120ms linear" }}
            />
          </div>
          <div className="mt-4 flex w-56 items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-ash)]">
            <span>Loading</span>
            <span className="text-[var(--color-red-bright)]">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
