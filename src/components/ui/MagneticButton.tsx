"use client";

import { useRef, type ReactNode } from "react";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  as = "a",
  href,
  onClick,
  cursor,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "a" | "button";
  href?: string;
  onClick?: () => void;
  cursor?: string;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const props = {
    ref,
    className: `magnetic inline-flex items-center justify-center transition-transform duration-300 ease-out will-change-transform ${className}`,
    onMouseMove: onMove,
    onMouseLeave: reset,
    "data-cursor": cursor,
  } as const;

  if (as === "button") {
    return (
      <button {...props} onClick={onClick} type="button">
        {children}
      </button>
    );
  }
  return (
    <a {...props} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
