# Hunt8K — Project Handoff

Everything you need to run, edit, and maintain the Hunt8K thumbnail-designer
portfolio site.

---

## 1. Links & Access

| What | Where |
| --- | --- |
| **Live site** | https://hunt8k.vercel.app |
| **GitHub repo** | https://github.com/gabrielgdesign1/Hunt8k-Site |
| **Vercel project** | `hunt8k` (team `gabriels-projects-423fc794`, account `gabrielgdesign1`) |
| **Local project** | `C:\Users\Admin\Downloads\Hunt8k Site` |

**Deployment is automatic:** GitHub is connected to Vercel, so every push to
the `main` branch triggers a production build and deploy (~30–45s). No manual
step needed.

---

## 2. Tech Stack

- **Next.js 15.5.20** (App Router) — pinned to this patched version; older
  15.5.x releases are blocked by Vercel for a security advisory. Don't
  downgrade below `15.5.20`.
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`)
- **React Three Fiber / three.js** — the 3D hero collage
- **GSAP** — smooth-scroll ticker integration
- **Framer Motion** (`motion` package) — scroll reveals, animated counters/bars
- **Lenis** — smooth scrolling
- **sharp** — build-time image optimization (dev dependency)

### Brand colours

Defined as Tailwind v4 tokens in `src/app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-red` | `#e40001` | The brand red — accents, stars, borders, glows |
| `--color-red-deep` | `#420101` | The dark brand red — gradient floors |
| `--color-red-bright` | `#ff2424` | Lighter tint of `--color-red`, for small mono labels and hover states (`#e40001` alone is only ~4.1:1 on the ink background, which fails AA at small sizes) |

Some reds are still inline `rgba(228, 0, 1, …)` for glows and gradients — grep
that string when re-theming, not just the tokens.

### Fonts
- **Display / headings:** Tilt Warp (`--font-tilt-warp`)
- **Body:** Inter
- **Mono / labels:** JetBrains Mono

All loaded via `next/font/google` in `src/app/layout.tsx`. To change the
heading font, swap the import there and update `--font-display` in
`globals.css`.

---

## 3. Running Locally

```bash
npm install          # first time only
npm run dev          # dev server → http://localhost:3000
npm run build        # production build (always run before assuming things work)
```

There's a second launch profile, **`hunt8k-prod`** (`.claude/launch.json`),
which runs `next start` on port 3100 against a production build. It's more
reliable than `next dev` for visual verification — `next dev` occasionally
gets into a broken HMR state after many rapid edits (fix: stop it,
`rm -rf .next`, restart). Production builds are unaffected.

---

## 4. Page Structure

Rendered in this order (see `src/app/page.tsx`):

1. **Navbar** — fixed pill nav; logo-only mark (no wordmark); anchor links.
   Completely static (does not move/resize on scroll). Links, in page order:
   Home · Stats · Clients · Work · Reviews · About Me · Let's Work.
2. **Hero** (`#top`) — full-viewport 3D scattered collage of the designer's
   thumbnails behind the headline **"Turn Views Into Clicks."** + a glossy
   red **Contact** button. Mouse-parallax only; scrolling scrolls the page.
3. **Stats** (`#stats`) — "By the Numbers" animated **equalizer bar graph**
   (500+ Projects, 80M+ Views, 50+ Satisfied Clients w/ *Top Rated* badge,
   3+ Years). Bars grow + numbers count up on scroll.
4. **CreatorGrid** (`#creators`) — "Trusted by creators". A **roster index**:
   the 13 creators as numbered rows of huge outlined display type that fill
   in solid on hover, the rest of the list dimming back so only the row under
   the cursor is lit. A portrait card trails the cursor (spring-lagged,
   tilting with pointer velocity) showing that creator's avatar, name and
   subscriber count. Keeps the "50M+ combined subscribers" metric.
   - The card is **portalled to `<body>`** for the same stacking reason as the
     Work lightbox, and only renders when `(hover: hover) and (pointer: fine)`
     and reduced-motion is off. On touch, each row's small marker portrait is
     the avatar.
   - The active row comes from one `pointermove` handler on the list reading
     `closest("[data-row]")`, not per-row enter events, so fast pointer
     movement can't skip a row. Dismissal is a **native** `pointerleave`
     listener on the list.
   - The outline→fill effect lives in `globals.css` (`.roster-name`), wrapped
     in `@supports (-webkit-text-stroke:…)` so unsupported browsers get solid
     names rather than 13 invisible rows.
5. **Work** (`#work`) — filterable gallery (**All Work / Gaming / IRL &
   Desktop**), thumbnails only with no captions, opening a lightbox
   (prev/next/Escape).
   - Each filter opens on a **3×3** and reveals the rest behind a **View
     more** button (no count in the label — just "View more"). A **View full
     portfolio** button (his Behance, read from `SITE.socials`) only appears
     once the grid is fully expanded — i.e. after View more is clicked (or
     immediately hidden again on switching filters, since `expanded` resets).
     If a filter never needs a View more (currently IRL & Desktop, with only
     8 images), the portfolio button never shows there either — it's tied to
     the expand action, not to "has more work to see." The reveal itself is
     data-driven off `INITIAL = 9`, so adding images needs no code change.
   - **All Work** interleaves the two categories so the opening 3×3 is a mix
     rather than the first nine gaming pieces.
   - Current counts: gaming **14** (9 + 5), irl **8**. IRL & Desktop is short
     of a second 3×3 — it needs 18 to reveal 9 more, so no View more shows
     there until more images land in `src/raw/irl` or `src/raw/desktop`.
   The lightbox
   is rendered through a **portal into `<body>`** — it has to be, because this
   section is `relative z-10` inside another `relative z-10` wrapper, so
   anything inside it is capped at z-10 against the fixed navbar (z-50) no
   matter how high its own z-index goes. That's what previously ate clicks on
   the close button. Keep any new full-screen overlay portalled too.
6. **Testimonials** (`#reviews`) — heading "Reviews."; a single glassmorphism
   carousel scrolling one direction, faded out at both edges. Pauses on hover.
   Each card shows the reviewer's real YouTube avatar (`TESTIMONIALS[].avatar`
   → `public/reviews/<avatar>.webp`) instead of initials.
7. **About** (`#about`) — bio beside the about-me graphic, floating stat chips.
8. **Contact** (`#contact`) — social link cards (X, Instagram, Behance) + email.
9. **Footer** — giant wordmark, social icons.

Behind everything sits **ParticleField** (`src/components/ParticleField.tsx`) —
a fixed, full-viewport canvas of slowly drifting light particles at `z-0`. For
it to show through, the page wrapper and sections must stay background-free;
the ink colour comes from `body`. Adding `bg-[var(--color-ink)]` back to a
section will hide the particles behind it.

> The **Process**, **FAQ** and **back-to-top** elements were removed. Their
> data (`PROCESS`, `FAQ`) is out of `site.ts` too — recover from git history
> if they're ever wanted back.

---

## 5. Editing Content

**Almost all copy and data lives in one file: `src/lib/site.ts`.**

| Export | Controls |
| --- | --- |
| `SITE` | Name, role, **email**, and social links (X / Instagram / Behance) |
| `WORK` | Portfolio gallery items (gaming + IRL) |
| `STATS` | The bar-graph numbers, labels, and the "Top Rated" badge |
| `CREATORS` | The 13 clients in the bento grid (name, handle, subs, URL) |
| `TESTIMONIALS` | Client review quotes |

> ⚠️ **`SITE.email` is a placeholder** (`hunt8k.designs@gmail.com`). Update it
> to the real booking email. Social links are already set to the real
> profiles.

Section headings and section-specific paragraph copy live inside each
component in `src/components/`.

---

## 6. Images / Assets

Optimized web images (WebP) are committed under `public/`:

- `public/branding/` — `logo.png` (transparent red 8K mark, used everywhere),
  `logo-white.png`, `about.png` (about-me graphic)
- `public/work/{gaming,irl}/` — portfolio thumbnails: `<slug>.webp` (display)
  and `<slug>-tex.webp` (smaller WebGL texture). Generated — `optimize.mjs`
  wipes and rewrites these folders, so don't hand-edit them.
- `public/hero/` — hero collage images: `main-1..4.webp` + `bg-1..3.webp`
- `public/creators/` — the 13 creator avatars (fetched from their YouTube
  channels)
- `public/reviews/` — the 7 reviewer avatars for the Testimonials cards
  (also fetched from YouTube, via `scripts/fetch-review-avatars.mjs`)

**Raw source images are git-ignored** (`Gaming thumbnails/`, `IRL thumbnails/`,
`Hero section thumbnails/`, `src/raw/`). Regeneration scripts in `scripts/`:

**Adding portfolio pieces:** drop the export into `src/raw/gaming`,
`src/raw/irl` or `src/raw/desktop`, add a
`["filename.png", "slug", "Title"]` row to the matching block in
`scripts/optimize.mjs`, and run it. It dedupes by file hash (the same export
sitting in two folders publishes once) and writes the ready-made `WORK` array
to `scripts/work.generated.txt` to paste into `site.ts`. `desktop` and `irl`
both publish into the single `irl` category. Note `src/raw/_previous/` holds
the superseded first batch of thumbnails.

> ⚠️ The hero collage's six work textures in `ThumbnailTunnel.tsx` are
> hard-coded paths. All seven `public/hero/` images are byte-identical to work
> pieces (Guapo, Lacy & Ron, Catwoman, Polo Peterbot, Polo FNCS, Replays
> Flint-Knock, Spider-Man) — keep those six clear of that list or the same
> thumbnail appears twice in the hero. Re-running `optimize.mjs` after
> renaming a slug will break those paths.

```bash
node scripts/optimize.mjs              # work thumbnails → public/work
node scripts/optimize-hero.mjs         # hero images → public/hero
node scripts/fetch-creators.mjs        # re-pull creator avatars → public/creators
node scripts/fetch-review-avatars.mjs  # re-pull reviewer avatars → public/reviews
```

To add a reviewer, add an entry to `TESTIMONIALS` in `site.ts` (with an
`avatar` slug) and a matching `{ slug, url }` row in
`scripts/fetch-review-avatars.mjs`, then run that script.

To add a creator, add an entry to `CREATORS` in `site.ts`, add the URL to
`scripts/fetch-creators.mjs`, and run that script. The roster renders straight
from `CREATORS` in order, so there's nothing to configure per creator — the
row number and the "N Creators" count both derive from the array.

---

## 7. The Hero 3D Collage

`src/components/hero/ThumbnailTunnel.tsx`. The `SCATTER` array (desktop) and
`SCATTER_MOBILE` array (portrait) define each image as:
- `wFrac` — width as a fraction of the viewport width
- `fx` / `fy` — position as a fraction of the half-viewport (−1…1)
- `rot` — tilt in degrees
- `tex` — which image (0–3 = main, 4–6 = background)
- `opacity` — 1 = foreground, <1 = faded depth behind the headline

The headline is an HTML overlay drawn **on top** of the canvas, so images can
overlap the center freely; a strong scrim in `Hero.tsx` keeps the text
readable. Coverage is tuned to ~75% on desktop and ~90% on mobile. Adjust
positions/sizes by editing those arrays.

---

## 8. Motion & Accessibility

- The site respects `prefers-reduced-motion`. When reduced motion is on, the
  3D hero shows a **static image fallback** and an in-page **"⚡ enable full
  animation"** button appears.
- Users can force the full experience: it's remembered in `localStorage`
  (`hunt8k-motion`) and can be toggled via URL — **`?motion=on`** forces
  animation, **`?motion=off`** forces the reduced version. Handy for demos/QA.
- Implementation: `src/lib/motion.ts` + the `motion-on` class toggled on
  `<html>` by `SmoothScroll.tsx` (this lets CSS animations like the marquees
  run even under reduced-motion when the user opts in).

### Intro animation & scroll restoration

Two behaviours that work together, both keyed off `src/lib/scroll.ts` (which
keeps the last scroll offset in `sessionStorage` under `hunt8k-scroll`):

- **Fresh visit** (saved offset is 0): the preloader counts up, then hands off
  to the intro — `Preloader.tsx` swaps `intro-armed` → `intro-play` on
  `<html>`, and every `[data-intro]` element animates in. Stagger is set
  per-element with a `--intro-delay` inline custom property; the animation
  variants (`rise` / `drop` / `fade`) live in `globals.css`.
- **Reload mid-page**: the offset is restored so you stay where you were, and
  the intro is skipped entirely — the preloader shows only a brief ink cover
  while the jump happens underneath, so you never see it move.

`SmoothScroll.tsx` sets `history.scrollRestoration = "manual"` and re-applies
the offset a few times as late-loading assets change the document height (the
browser's own restoration fires too early and lands short). Position is saved
on scroll (coalesced to one write per frame) and on `pagehide`.

> `intro-armed` sets `[data-intro] { opacity: 0 }` and is only ever added by
> JS, so with JS off — or under reduced motion — content is simply visible.

---

## 9. Deploying

**Normal flow — just push:**

```bash
git add -A
git commit -m "your message"
git push          # Vercel auto-builds & deploys to hunt8k.vercel.app
```

**Manual deploy (if ever needed)** — the Vercel CLI is authenticated on this
machine:

```bash
npx vercel deploy --prod --yes
```

---

## 10. Notes / Things to Know

- **Stats numbers** (500+, 80M+, 50+, 3+) and testimonial quotes are
  marketing content — adjust to real figures in `site.ts` when available.
- **Creator avatars** are the creators' public YouTube profile pictures, used
  to showcase real clients in a "trusted by" section. If a channel changes its
  picture, re-run `scripts/fetch-creators.mjs`.
- One item to double-check: the list labels creator #3 "IShowSpeed" but the URL
  is `@LiveSpeedy` (his live channel) — the avatar matches, but confirm the
  name/subs are how the client wants them.
- `.env.local` and `.vercel/` are git-ignored (local Vercel link + OIDC token).

---

_Last updated: handoff generated after the scattered-hero + bento-grid update._
