const KEY = "hunt8k-scroll";

/**
 * Scroll offset carried over from before a reload, in px (0 when there is
 * none). Lives in sessionStorage, so it survives F5 but not a new tab —
 * which is exactly the behaviour you want: reload keeps your place, a fresh
 * visit starts at the top with the intro.
 */
export function getSavedScroll(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return 0;
    const n = parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0; // privacy mode / blocked storage
  }
}

export function saveScroll(y: number) {
  try {
    sessionStorage.setItem(KEY, String(Math.max(0, Math.round(y))));
  } catch {
    /* ignore */
  }
}
