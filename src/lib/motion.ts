const STORAGE_KEY = "hunt8k-motion";

/**
 * Central check for whether reduced-motion should apply.
 * Honors the OS/browser setting, but a visitor can override it —
 * either via ?motion=on|off (handy for demos/QA) or by clicking the
 * in-page "enable animations" control, which persists the choice to
 * localStorage so it survives reloads and future visits.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const p = new URLSearchParams(window.location.search);
    const flag = p.get("motion");
    if (flag === "on") {
      localStorage.setItem(STORAGE_KEY, "on");
      return false;
    }
    if (flag === "off") {
      localStorage.setItem(STORAGE_KEY, "off");
      return true;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return false;
    if (stored === "off") return true;
  } catch {
    /* ignore (privacy mode / blocked storage) */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Explicitly enable the full animated experience and remember the choice. */
export function enableMotion() {
  try {
    localStorage.setItem(STORAGE_KEY, "on");
  } catch {
    /* ignore */
  }
  window.location.reload();
}
