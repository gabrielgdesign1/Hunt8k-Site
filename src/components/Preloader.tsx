"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (reduce) {
      setDone(true);
      return;
    }
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 9) + 3;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 520);
      }
      setCount(n);
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-ink)] transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
        done
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
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
    </div>
  );
}
