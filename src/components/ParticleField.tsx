"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Particle = {
  x: number;
  y: number;
  r: number;
  drift: number; // upward speed, px/sec
  sway: number; // horizontal sway amplitude, px
  swaySpeed: number;
  phase: number;
  alpha: number;
  red: boolean;
};

const DENSITY = 1 / 26000; // particles per px² of viewport
const MAX_PARTICLES = 90;

function makeParticles(w: number, h: number): Particle[] {
  const n = Math.min(MAX_PARTICLES, Math.max(22, Math.round(w * h * DENSITY)));
  return Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.9,
    drift: 4 + Math.random() * 14,
    sway: 6 + Math.random() * 26,
    swaySpeed: 0.08 + Math.random() * 0.22,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.16 + Math.random() * 0.42,
    // a minority glow brand-red so the field reads as part of the identity
    red: Math.random() < 0.28,
  }));
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = makeParticles(w, h);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // Motion is derived from elapsed time rather than accumulated per
        // frame, so a paused/backgrounded tab never causes a visible jump.
        const y = p.y - ((p.drift * t) % (h + 80));
        const wrapped = y < -40 ? y + h + 80 : y;
        const x = p.x + Math.sin(t * p.swaySpeed + p.phase) * p.sway;

        const g = ctx.createRadialGradient(x, wrapped, 0, x, wrapped, p.r * 4);
        const core = p.red ? "255,90,77" : "244,242,240";
        g.addColorStop(0, `rgba(${core},${p.alpha})`);
        g.addColorStop(0.4, `rgba(${core},${p.alpha * 0.35})`);
        g.addColorStop(1, `rgba(${core},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, wrapped, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();

    if (reduce) {
      // Static field — the texture without the movement.
      draw(0);
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let frame = 0;
    let paused = false;
    // Elapsed time is accumulated rather than derived from a fixed start
    // stamp, so pausing for a backgrounded tab and resuming picks up exactly
    // where it left off instead of snapping every particle back to its
    // starting position.
    let elapsed = 0;
    let last = performance.now();

    const loop = (now: number) => {
      elapsed += (now - last) / 1000;
      last = now;
      draw(elapsed);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden && !paused) {
        paused = true;
        cancelAnimationFrame(frame);
      } else if (!document.hidden && paused) {
        paused = false;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
