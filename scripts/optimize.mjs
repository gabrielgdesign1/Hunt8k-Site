import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();

// slug + display metadata for each raw file
const sets = {
  gaming: [
    { file: "BlackOps7 Thumbnail 2.png", slug: "black-ops-7" },
    { file: "ChoiFN1 Live Thumbnail 2.png", slug: "choifn-live" },
    { file: "FazeReplays_22Elim_SimpsonFortnite_Thumbnail.png", slug: "faze-replays-simpson" },
    { file: "Joey773_chapter6season4_livethumbnail_1.png", slug: "joey773-live" },
    { file: "KreekCraft_ReactionRobloxUpdate_Thumbnail.png", slug: "kreekcraft-roblox" },
    { file: "Replays_SimpsonOnly_Fortnite_Thumbnail.png", slug: "replays-simpson-only" },
  ],
  irl: [
    { file: "GavinMagnus_PiperRockell_Car_stream.png", slug: "gavin-magnus-car" },
    { file: "KreekCraftHub_Reaction_Thumbnail_1.png", slug: "kreekcraft-reaction" },
    { file: "LiveSpeedy_Thumbnail.jpg", slug: "livespeedy-irl" },
    { file: "Max_BaddieBaddie_Video_Reaction_Thumbnail_2.png", slug: "max-reaction" },
    { file: "Sketch Vod Thumbnail 2.png", slug: "sketch-vod" },
    { file: "Sketch_And_Jynxzi_PlayMadden_Thumbnail.png", slug: "sketch-jynxzi-madden" },
  ],
};

async function run() {
  for (const [cat, items] of Object.entries(sets)) {
    const srcDir = path.join(root, "src", "raw", cat);
    const outDir = path.join(root, "public", "work", cat);
    await fs.mkdir(outDir, { recursive: true });
    for (const { file, slug } of items) {
      const src = path.join(srcDir, file);
      // Full-quality display version (1280w)
      await sharp(src)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(path.join(outDir, `${slug}.webp`));
      // Small texture version for WebGL tunnel (720w)
      await sharp(src)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outDir, `${slug}-tex.webp`));
      console.log(`✓ ${cat}/${slug}`);
    }
  }
  console.log("Done optimizing.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
