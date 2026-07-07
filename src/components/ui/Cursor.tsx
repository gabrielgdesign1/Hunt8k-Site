"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setHidden(false);

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor], input, textarea, [role='button']"
      ) as HTMLElement | null;
      setActive(!!el);
      setLabel(el?.getAttribute("data-cursor") ?? null);
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <div
        ref={dot}
        className="fixed left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--color-red-bright)] mix-blend-difference"
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: active ? 64 : 34,
          height: active ? 64 : 34,
          marginLeft: active ? -32 : -17,
          marginTop: active ? -32 : -17,
          borderColor: active
            ? "rgba(255,33,22,0.9)"
            : "rgba(244,242,240,0.35)",
          backgroundColor: active ? "rgba(255,33,22,0.08)" : "transparent",
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-red-bright)]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
