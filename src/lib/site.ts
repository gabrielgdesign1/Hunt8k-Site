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
  ],
};

export type Work = {
  slug: string;
  title: string;
  client: string;
  category: "gaming" | "irl";
  tag: string;
};

export const WORK: Work[] = [
  // GAMING
  { slug: "black-ops-7", title: "Black Ops 7 — First Look", client: "COD Creator", category: "gaming", tag: "FPS" },
  { slug: "faze-replays-simpson", title: "22 Elim Simpson Fortnite", client: "FaZe Replays", category: "gaming", tag: "Fortnite" },
  { slug: "kreekcraft-roblox", title: "Roblox Update Reaction", client: "KreekCraft", category: "gaming", tag: "Roblox" },
  { slug: "choifn-live", title: "Fortnite Live Stream", client: "ChoiFN", category: "gaming", tag: "Live" },
  { slug: "joey773-live", title: "Chapter 6 Season 4 Live", client: "Joey773", category: "gaming", tag: "Fortnite" },
  { slug: "replays-simpson-only", title: "Simpson Only Challenge", client: "Replays", category: "gaming", tag: "Fortnite" },
  // IRL
  { slug: "sketch-jynxzi-madden", title: "Sketch & Jynxzi Play Madden", client: "Sketch", category: "irl", tag: "Collab" },
  { slug: "gavin-magnus-car", title: "Car Stream w/ Piper", client: "Gavin Magnus", category: "irl", tag: "Stream" },
  { slug: "sketch-vod", title: "VOD Highlight", client: "Sketch", category: "irl", tag: "VOD" },
  { slug: "kreekcraft-reaction", title: "IRL Reaction", client: "KreekCraft", category: "irl", tag: "Reaction" },
  { slug: "max-reaction", title: "Baddie Video Reaction", client: "Max", category: "irl", tag: "Reaction" },
  { slug: "livespeedy-irl", title: "IRL Stream", client: "LiveSpeedy", category: "irl", tag: "Live" },
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

export const PROCESS = [
  {
    no: "01",
    title: "Research & Concept",
    body: "I break down the video, the audience and the competition — then hunt the single idea that makes a viewer stop mid-scroll.",
  },
  {
    no: "02",
    title: "Design & Psychology",
    body: "Thumbnails aren't just design, they're psychology. Emotion, contrast and focal hierarchy engineered to spike your CTR.",
  },
  {
    no: "03",
    title: "Refine & Deliver",
    body: "Pixel-level polish, platform-optimised exports and fast revisions. Delivered ready to upload — usually within 24 hours.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  handle: string;
  subs: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "8K just gets it. I send the raw clip and a rough idea, and the thumbnail comes back better than what was in my head. My CTR jumped and I stopped second-guessing uploads.",
    name: "KreekCraft",
    handle: "@KreekCraft",
    subs: "9.8M subscribers",
  },
  {
    quote:
      "First version is always the one. No endless revisions, no chasing — it lands exactly right and it slaps. Fastest turnaround I've had from any designer.",
    name: "Sketch",
    handle: "@Sketch",
    subs: "4.2M subscribers",
  },
  {
    quote:
      "Every thumbnail feels engineered to get clicked. The contrast, the faces, the color — you can tell there's actual strategy behind it, not just filters.",
    name: "FaZe Replays",
    handle: "@Replays",
    subs: "1.1M subscribers",
  },
  {
    quote:
      "Reliable, creative, and always on time. 8K understands the gaming space better than anyone I've worked with. Genuinely leveled up my channel's look.",
    name: "ChoiFN",
    handle: "@ChoiFN",
    subs: "780K subscribers",
  },
  {
    quote:
      "The IRL thumbnails hit different. He knows how to make a face pop off the feed and make people curious enough to click. Highly recommend.",
    name: "Gavin Magnus",
    handle: "@GavinMagnus",
    subs: "12M subscribers",
  },
  {
    quote:
      "Been through a bunch of thumbnail guys. 8K is the first one where I don't have to explain twice. It just works, every single time.",
    name: "Joey773",
    handle: "@Joey773",
    subs: "540K subscribers",
  },
];

export const FAQ = [
  {
    q: "What types of thumbnails do you design?",
    a: "Primarily gaming and IRL YouTube thumbnails — Fortnite, COD, Roblox, reactions, vlogs and live streams. If it needs to stop the scroll and earn the click, I design it.",
  },
  {
    q: "How fast is the turnaround?",
    a: "Most single thumbnails are delivered within 24 hours. Rush delivery is available, and retainer clients get priority in the queue.",
  },
  {
    q: "What do you need from me to start?",
    a: "The video title/idea, any raw footage or face shots, and a rough vibe if you have one. That's it — I handle concept, composition and the rest.",
  },
  {
    q: "How many revisions do I get?",
    a: "Unlimited reasonable revisions until it's right. In practice the first version usually lands, but I'll refine until you're happy to hit upload.",
  },
  {
    q: "What's your pricing?",
    a: "Per-thumbnail rates and monthly retainer packages are available. Message me with your channel and volume and I'll send a tailored quote.",
  },
];
