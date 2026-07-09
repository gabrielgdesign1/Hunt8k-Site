# Hunt8K — Thumbnail Designer Portfolio

A high-octane, red-themed portfolio for **Hunt8K**, a thumbnail designer for gaming & IRL creators. Built to stop the scroll.

## ✦ Highlights

- **3D hero visual** — four foreground thumbnails pinned to the corners in a 2x2 grid, with extra thumbnails receding into the background for depth (React Three Fiber + WebGL). Reacts to mouse parallax only — scrolling just scrolls the page normally.
- **Scroll-driven storytelling** — Lenis smooth scroll, Framer Motion reveals, animated process rail and count-up stats.
- **Interactive work gallery** — filterable (All / Gaming / IRL) with a full lightbox.
- **Preloader, testimonials marquee, FAQ accordion, social links.**
- **Fully accessible** — the 3D scene has a `prefers-reduced-motion` fallback (with an in-page opt-in toggle).

## 🛠 Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · React Three Fiber / three.js · GSAP · Framer Motion · Lenis

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

### Regenerating optimized thumbnails
Raw exports live in `src/raw/{gaming,irl}` (git-ignored). Optimized WebP versions are committed to `public/work`. To regenerate:

```bash
node scripts/optimize.mjs
```

## ⚙️ Customizing

Almost all content lives in **`src/lib/site.ts`** — work items, testimonials, process, FAQ, stats, socials and the contact email (`SITE.email`, currently a placeholder — update it).

## 🎛 Motion override
Append `?motion=on` to force the full animated experience, or `?motion=off` to preview the reduced-motion fallback.

---
© Hunt8K. Designed to stop the scroll.
