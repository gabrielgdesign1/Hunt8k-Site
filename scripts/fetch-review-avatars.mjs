import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "public", "reviews");

// Slugs match TESTIMONIALS[].name (lowercased, spaces -> hyphens) in site.ts.
const reviewers = [
  { slug: "badmigame", url: "https://www.youtube.com/@BadmiGame" },
  { slug: "biphilus30", url: "https://www.youtube.com/@Biphilus30/videos" },
  { slug: "killa1x", url: "https://www.youtube.com/@Killa1x" },
  { slug: "replays", url: "https://www.youtube.com/channel/UC0jYsRTJinyj5mQSY96WByw" },
  { slug: "joey773", url: "https://www.youtube.com/joey773" },
  { slug: "choifn1", url: "https://www.youtube.com/@ChoiFN1" },
  { slug: "james-chugs", url: "https://www.youtube.com/@JamesChugs" },
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
  for (const c of reviewers) {
    try {
      const avatar = await getAvatarUrl(c.url);
      if (!avatar) throw new Error("no og:image");
      const imgRes = await fetch(avatar, { headers: { "User-Agent": UA } });
      const buf = Buffer.from(await imgRes.arrayBuffer());
      await sharp(buf)
        .resize(160, 160, { fit: "cover" })
        .webp({ quality: 88 })
        .toFile(path.join(outDir, `${c.slug}.webp`));
      console.log(`✓ ${c.slug}`);
    } catch (e) {
      console.log(`✗ ${c.slug} — ${e.message}`);
      failed.push(c.slug);
    }
  }
  if (failed.length) console.log("\nFAILED:", failed.join(", "));
  else console.log("\nAll review avatars fetched.");
}

run();
