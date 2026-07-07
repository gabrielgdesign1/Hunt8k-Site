# Hunt8K — Thumbnail Designer Portfolio

A high-octane, red-themed portfolio for **Hunt8K**, a thumbnail designer for gaming & IRL creators. Built to stop the scroll.

## ✦ Highlights

- **3D thumbnail tunnel hero** — the designer's work lines an infinite corridor that the camera flies through on scroll (React Three Fiber + WebGL).
- **Scroll-driven storytelling** — Lenis smooth scroll + GSAP ScrollTrigger, Framer Motion reveals, animated process rail and count-up stats.
- **Interactive work gallery** — filterable (All / Gaming / IRL) with a full lightbox.
- **Custom cursor, magnetic buttons, preloader, marquees, testimonials, FAQ, contact form.**
- **Fully accessible** — every heavy animation has a `prefers-reduced-motion` fallback.

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

Almost all content lives in **`src/lib/site.ts`** — work items, testimonials, process, toolkit, FAQ, stats, socials and the contact email (`SITE.email`, currently a placeholder — update it).

## 🎛 Motion override
Append `?motion=on` to force the full animated experience, or `?motion=off` to preview the reduced-motion fallback.

---
© Hunt8K. Designed to stop the scroll.
