import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "public", "creators");

const creators = [
  { slug: "sypherpk", url: "https://www.youtube.com/@SypherPK" },
  { slug: "kreekcraft", url: "https://www.youtube.com/@KreekCraft" },
  { slug: "ishowspeed", url: "https://www.youtube.com/@LiveSpeedy" },
  { slug: "sketch", url: "https://www.youtube.com/@TheSketchReal" },
  { slug: "lacy", url: "https://www.youtube.com/@LacyHimself" },
  { slug: "gavin-magnus", url: "https://www.youtube.com/@LiveGavinMagnus" },
  { slug: "replays", url: "https://www.youtube.com/@ReplaysILY" },
  { slug: "n3on", url: "https://www.youtube.com/@N3on" },
  { slug: "james-chugs", url: "https://www.youtube.com/@JamesChugs" },
  { slug: "extra-emily", url: "https://www.youtube.com/@extraemily" },
  { slug: "yusuf7n", url: "https://www.youtube.com/@Yusuf7nLive" },
  { slug: "biphilus30", url: "https://www.youtube.com/@Biphilus30" },
  { slug: "joey773", url: "https://www.youtube.com/@Joey773" },
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function getAvatarUrl(pageUrl) {
  const res = await fetch(pageUrl, { headers: { "User-Agent": UA } });
  const html = await res.text();
  const m =
    html.match(/<meta property="og:image" content="([^"]+)"/) ||
    html.match(/<link rel="image_src" href="([^"]+)"/);
  return m ? m[1] : null;
}

async function run() {
  await fs.mkdir(outDir, { recursive: true });
  const failed = [];
  for (const c of creators) {
    try {
      const avatar = await getAvatarUrl(c.url);
      if (!avatar) throw new Error("no og:image");
      const imgRes = await fetch(avatar, { headers: { "User-Agent": UA } });
      const buf = Buffer.from(await imgRes.arrayBuffer());
      await sharp(buf)
        .resize(240, 240, { fit: "cover" })
        .webp({ quality: 88 })
        .toFile(path.join(outDir, `${c.slug}.webp`));
      console.log(`✓ ${c.slug}`);
    } catch (e) {
      console.log(`✗ ${c.slug} — ${e.message}`);
      failed.push(c.slug);
    }
  }
  if (failed.length) console.log("\nFAILED:", failed.join(", "));
  else console.log("\nAll creators fetched.");
}

run();
