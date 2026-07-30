"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { getSavedScroll, saveScroll } from "@/lib/scroll";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    // CSS-driven animations (wheel spin, marquees, etc.) are killed by the
    // blanket prefers-reduced-motion rule in globals.css; this class lets
    // an explicit "enable motion" opt-in (see lib/motion.ts) restore them.
    document.documentElement.classList.toggle("motion-on", !reduce);

    gsap.registerPlugin(ScrollTrigger);

    const target = getSavedScroll();
    // Take scroll position into our own hands. The browser restores it
    // before the page has its final height — fonts, images and the 3D hero
    // all land later — so its guess is usually short. We re-apply ours as
    // the height settles instead.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (reduce) {
      ScrollTrigger.refresh();
    } else {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      raf = (time: number) => {
        lenis!.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // expose for anchor scrolling
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const jumpTo = (y: number) => {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const clamped = Math.min(y, max);
      if (lenis) lenis.scrollTo(clamped, { immediate: true, force: true });
      else window.scrollTo(0, clamped);
    };

    const timers: number[] = [];
    let onLoad: (() => void) | null = null;

    if (target > 0) {
      jumpTo(target);
      // Re-apply as late-loading assets change the document height.
      [50, 200, 550, 1100].forEach((d) =>
        timers.push(window.setTimeout(() => jumpTo(target), d))
      );
      onLoad = () => {
        jumpTo(target);
        ScrollTrigger.refresh();
      };
      window.addEventListener("load", onLoad, { once: true });
    }

    // Persist the position, coalesced to one write per frame.
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        saveScroll(window.scrollY);
      });
    };
    const onHide = () => saveScroll(window.scrollY);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onHide);

    return () => {
      timers.forEach(clearTimeout);
      if (onLoad) window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
