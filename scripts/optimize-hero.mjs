import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const srcDir = path.join(root, "Hero section thumbnails");
const outDir = path.join(root, "public", "hero");

const files = [
  { file: "2x2 1.png", slug: "main-1" },
  { file: "2X2 2.png", slug: "main-2" },
  { file: "2x2 3.png", slug: "main-3" },
  { file: "2X2 4.png", slug: "main-4" },
  { file: "PoloFNCS_Thumbnail.png", slug: "bg-1" },
  { file: "Replays Flintknock Screenshot Thumbnail.png", slug: "bg-2" },
  { file: "Spiderman Ranked 2.0 Fortnite Thumbnail.png", slug: "bg-3" },
];

await fs.mkdir(outDir, { recursive: true });
for (const { file, slug } of files) {
  await sharp(path.join(srcDir, file))
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `${slug}.webp`));
  console.log(`✓ hero/${slug}`);
}
console.log("Done.");
