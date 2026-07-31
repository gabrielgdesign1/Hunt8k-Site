import type { SocialKey } from "@/components/ui/SocialIcon";

export const SITE = {
  name: "8K",
  fullName: "Hunt8K",
  role: "Thumbnail Designer",
  tagline: "Scroll-stopping thumbnails for gaming & IRL creators.",
  email: "hunt8k.designs@gmail.com", // TODO: replace with real booking email
  socials: [
    { label: "Twitter / X", href: "https://x.com/Hunt8K", icon: "x" as SocialKey },
    { label: "Instagram", href: "https://www.instagram.com/hunt8k.visuals/", icon: "instagram" as SocialKey },
    { label: "Behance", href: "https://www.behance.net/Hunt8K", icon: "behance" as SocialKey },
    { label: "YouTube", href: "https://www.youtube.com/@hunt8kvisuals", icon: "youtube" as SocialKey },
  ],
};

export type Work = {
  slug: string;
  title: string; // used for alt text only — no captions are rendered
  category: "gaming" | "irl";
};

export const WORK: Work[] = [
  { slug: "catwoman-typical-gamer", title: "Catwoman — Typical Gamer", category: "gaming" },
  { slug: "ch7-s3-controller-settings", title: "Chapter 7 Season 3 Controller Settings", category: "gaming" },
  { slug: "faze-replays-22-elim", title: "FaZe Replays — 22 Elim Simpson", category: "gaming" },
  { slug: "faze-replays-solo-vs-squads", title: "FaZe Replays — Solo vs Squads", category: "gaming" },
  { slug: "hunted-by-pros", title: "I Got Hunted By Pros", category: "gaming" },
  { slug: "james-chugs-shotgun-only", title: "James Chugs — Shotgun Only", category: "gaming" },
  { slug: "james-chugs-roblox-wyr", title: "James Chugs — Roblox Would You Rather", category: "gaming" },
  { slug: "polo-peterbot-mask", title: "Polo & Peterbot — Mask Settings", category: "gaming" },
  { slug: "polo-fncs", title: "Polo — FNCS", category: "gaming" },
  { slug: "replays-flintknock", title: "Replays — Flint-Knock", category: "gaming" },
  { slug: "sketch-vod", title: "Sketch — VOD", category: "gaming" },
  { slug: "spiderman-ranked", title: "Spider-Man Ranked 2.0", category: "gaming" },
  { slug: "sypherpk-shattered-event", title: "SypherPK — Shattered Live Event", category: "gaming" },
  { slug: "sypherpk-im-back", title: "SypherPK — I'm Back Livestream", category: "gaming" },
  { slug: "gavin-alice-date", title: "Gavin & Alice — Date Stream", category: "irl" },
  { slug: "gavin-magnus-car", title: "Gavin Magnus — Car Stream w/ Piper", category: "irl" },
  { slug: "guapo-seafood-boil", title: "Guapo — Seafood Boil", category: "irl" },
  { slug: "gymskin-man-city", title: "Gymskin — Man City", category: "irl" },
  { slug: "livespeedy", title: "LiveSpeedy — IRL Stream", category: "irl" },
  { slug: "rakai-maddy", title: "Rakai & Maddy", category: "irl" },
  { slug: "lacy-ron-geoguessr", title: "Lacy & Ron — GeoGuessr", category: "irl" },
  { slug: "yusuf-guesses-viewers", title: "Yusuf Guesses His Viewers", category: "irl" },
];

export function workSrc(w: Work, texture = false) {
  return `/work/${w.category}/${w.slug}${texture ? "-tex" : ""}.webp`;
}

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  height: number; // relative bar height (0-100) for the chart
  badge?: string;
};

export const STATS: Stat[] = [
  { value: 500, suffix: "+", label: "Projects", height: 62 },
  { value: 80, suffix: "M+", label: "Views", height: 100 },
  { value: 50, suffix: "+", label: "Satisfied Clients", height: 76, badge: "Top Rated" },
  { value: 3, suffix: "+", label: "Years of Experience", height: 40 },
];

export type Creator = {
  slug: string;
  name: string;
  handle: string;
  subs: string;
  url: string;
};

export const CREATORS: Creator[] = [
  { slug: "sypherpk", name: "SypherPK", handle: "@SypherPK", subs: "10.6M+", url: "https://www.youtube.com/@SypherPK" },
  { slug: "kreekcraft", name: "KreekCraft", handle: "@KreekCraft", subs: "17M+", url: "https://www.youtube.com/@KreekCraft" },
  { slug: "ishowspeed", name: "IShowSpeed", handle: "@LiveSpeedy", subs: "17.1M+", url: "https://www.youtube.com/@LiveSpeedy" },
  { slug: "sketch", name: "Sketch", handle: "@TheSketchReal", subs: "800K+", url: "https://www.youtube.com/@TheSketchReal" },
  { slug: "lacy", name: "Lacy", handle: "@LacyHimself", subs: "750K+", url: "https://www.youtube.com/@LacyHimself" },
  { slug: "gavin-magnus", name: "Gavin Magnus", handle: "@LiveGavinMagnus", subs: "22.5K+", url: "https://www.youtube.com/@LiveGavinMagnus" },
  { slug: "replays", name: "Replays", handle: "@ReplaysILY", subs: "1M+", url: "https://www.youtube.com/@ReplaysILY" },
  { slug: "n3on", name: "N3ON", handle: "@N3on", subs: "1M+", url: "https://www.youtube.com/@N3on" },
  { slug: "james-chugs", name: "James Chugs", handle: "@JamesChugs", subs: "1M+", url: "https://www.youtube.com/@JamesChugs" },
  { slug: "extra-emily", name: "Extra Emily", handle: "@extraemily", subs: "300K+", url: "https://www.youtube.com/@extraemily" },
  { slug: "yusuf7n", name: "Yusuf7n", handle: "@Yusuf7nLive", subs: "130K+", url: "https://www.youtube.com/@Yusuf7nLive" },
  { slug: "biphilus30", name: "Biphilus30", handle: "@Biphilus30", subs: "130K+", url: "https://www.youtube.com/@Biphilus30" },
  { slug: "joey773", name: "Joey773", handle: "@Joey773", subs: "100K+", url: "https://www.youtube.com/@Joey773" },
];

export type Testimonial = {
  quote: string;
  name: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "BadmiGame",
    quote:
      "Hunt continues to produce high-quality work for flexible prices and ensures that their clients are satisfied. I’m glad to commission them.",
  },
  {
    name: "Biphilus30",
    quote:
      "Great. Professional thumbnail work that looked amazing, just how I envisioned it, was done on time, with great communication, and all for a fair price.",
  },
  {
    name: "Killa1x",
    quote:
      "5 Stars - Quick Response Times / Perfect Visions / On Time Deliveries / Friendly & Helpful.",
  },
  {
    name: "Replays",
    quote:
      "Hunt is amazing at creating thumbnails! He has made a bunch for my channel ‘Replays’! Super reliable!",
  },
  {
    name: "Joey773",
    quote:
      "Amazing, very skilled young individual who has great potential in this industry and is great at his job and always creates the best thumbnails!",
  },
  {
    name: "ChoiFN1",
    quote:
      "Hunt has always delivered high level thumbnails for my channel, turnaround time is great as well. I highly recommend!",
  },
  {
    name: "James Chugs",
    quote: "Excellent. Thumbnails are amazing. Sent on time and affordable!",
  },
];
