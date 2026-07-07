/**
 * Central check for whether reduced-motion should apply.
 * Honors the OS/browser setting, with an optional URL override
 * (?motion=on forces animation, ?motion=off forces reduced) that is
 * handy for demos, QA and environments that hard-code reduced-motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const p = new URLSearchParams(window.location.search);
    const flag = p.get("motion");
    if (flag === "on") return false;
    if (flag === "off") return true;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
