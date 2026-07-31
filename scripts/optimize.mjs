import sharp from "sharp";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();

// Raw exports live in src/raw/<folder> (git-ignored). "desktop" and "irl" are
// two source folders that publish into the single `irl` category — the site
// presents them together as "IRL & Desktop".
const SOURCES = [
  {
    folder: "gaming",
    category: "gaming",
    items: [
      ["Catwomen TG Thumbnail.png", "catwoman-typical-gamer", "Catwoman — Typical Gamer"],
      ["Chapter 7 Season 3 Controller Settings Thumbnail.png", "ch7-s3-controller-settings", "Chapter 7 Season 3 Controller Settings"],
      ["FazeReplays_22Elim_SimpsonFortnite_Thumbnail.png", "faze-replays-22-elim", "FaZe Replays — 22 Elim Simpson"],
      ["fazereplays_solovssquads_only_wreckedrevolver_chapter6season4_thumbnail_2.png", "faze-replays-solo-vs-squads", "FaZe Replays — Solo vs Squads"],
      ["I Got Hunted By Pros Fortnite Thumbnail.png", "hunted-by-pros", "I Got Hunted By Pros"],
      ["James Chugs Shotgun Only Fortnite Thumbnail.png", "james-chugs-shotgun-only", "James Chugs — Shotgun Only"],
      ["JamesChugs_RobloxWouldYouRather_Thumbnail.png", "james-chugs-roblox-wyr", "James Chugs — Roblox Would You Rather"],
      ["Polo Peterbot Mask Settings Thumbnail.png", "polo-peterbot-mask", "Polo & Peterbot — Mask Settings"],
      ["PoloFNCS_Thumbnail.png", "polo-fncs", "Polo — FNCS"],
      ["Replays Flintknock Screenshot Thumbnail.png", "replays-flintknock", "Replays — Flint-Knock"],
      ["Sketch Vod Thumbnail 2.png", "sketch-vod", "Sketch — VOD"],
      ["Spiderman Ranked 2.0 Fortnite Thumbnail.png", "spiderman-ranked", "Spider-Man Ranked 2.0"],
      ["SypherPK Floating Shattered Live Event Thumbnail.png", "sypherpk-shattered-event", "SypherPK — Shattered Live Event"],
      ["SypherPK Im Back Livestream NO LIVE ICON Thumbnail.png", "sypherpk-im-back", "SypherPK — I'm Back Livestream"],
    ],
  },
  {
    folder: "irl",
    category: "irl",
    items: [
      ["GavinAndAlice_DateThumbnail_GavinMangusLive.png", "gavin-alice-date", "Gavin & Alice — Date Stream"],
      ["GavinMagnus_PiperRockell_Car_stream.png", "gavin-magnus-car", "Gavin Magnus — Car Stream w/ Piper"],
      ["GuapoSeafoodBoil_Thumbnail.png", "guapo-seafood-boil", "Guapo — Seafood Boil"],
      ["Gymskin_ManCity_Soccer_Thumbnail_v2.png", "gymskin-man-city", "Gymskin — Man City"],
      ["LiveSpeedy_Thumbnail.jpg", "livespeedy", "LiveSpeedy — IRL Stream"],
      ["RakaiMaddy_Thumbnail_red_shirt.png", "rakai-maddy", "Rakai & Maddy"],
    ],
  },
  {
    folder: "desktop",
    category: "irl",
    items: [
      ["Lacy&Ron_Geoguessr_Thumbnail.png", "lacy-ron-geoguessr", "Lacy & Ron — GeoGuessr"],
      // RakaiMaddy_Thumbnail_red_shirt.png is byte-identical to the IRL copy
      // and is skipped by the hash guard below.
      ["RakaiMaddy_Thumbnail_red_shirt.png", "rakai-maddy", "Rakai & Maddy"],
      ["YusufGuessesHisViewersBasedOffUsernames_Thumbnail.png", "yusuf-guesses-viewers", "Yusuf Guesses His Viewers"],
    ],
  },
];

async function run() {
  // wipe previously generated output so removed pieces don't linger
  for (const cat of ["gaming", "irl"]) {
    const dir = path.join(root, "public", "work", cat);
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  }

  const seen = new Map(); // md5 -> slug, so the same export can't publish twice
  const manifest = [];

  for (const { folder, category, items } of SOURCES) {
    const srcDir = path.join(root, "src", "raw", folder);
    const outDir = path.join(root, "public", "work", category);

    for (const [file, slug, title] of items) {
      const src = path.join(srcDir, file);
      const buf = await fs.readFile(src);
      const hash = createHash("md5").update(buf).digest("hex");

      if (seen.has(hash)) {
        console.log(`· skipped ${folder}/${file} — same image as "${seen.get(hash)}"`);
        continue;
      }
      seen.set(hash, slug);

      // display copy
      await sharp(buf)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(path.join(outDir, `${slug}.webp`));
      // small texture copy for the WebGL hero
      await sharp(buf)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outDir, `${slug}-tex.webp`));

      manifest.push({ slug, title, category });
      console.log(`✓ ${category}/${slug}`);
    }
  }

  // Emit the WORK array for pasting into src/lib/site.ts. Written as .txt
  // rather than .ts so tsc never tries to type-check a bare array literal.
  const lines = manifest.map(
    (m) =>
      `  { slug: ${JSON.stringify(m.slug)}, title: ${JSON.stringify(
        m.title
      )}, category: ${JSON.stringify(m.category)} },`
  );
  const out = `export const WORK: Work[] = [\n${lines.join("\n")}\n];\n`;
  await fs.writeFile(path.join(root, "scripts", "work.generated.txt"), out);

  const counts = manifest.reduce((a, m) => {
    a[m.category] = (a[m.category] || 0) + 1;
    return a;
  }, {});
  console.log(
    `\nDone. ${manifest.length} images — gaming: ${counts.gaming || 0}, irl: ${
      counts.irl || 0
    }`
  );
  console.log("Array written to scripts/work.generated.txt");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
