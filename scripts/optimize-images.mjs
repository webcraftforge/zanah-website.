import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "originals";
const OUT = "public/images";
// Keep in sync with IMAGE_WIDTHS in src/utils/image.js
const WIDTHS = [160, 320, 400, 640, 800, 960, 1000, 1280, 1600, 2000];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|tiff?)$/i.test(e.name)) files.push(p);
  }
  return files;
}

const files = await walk(SRC).catch(() => {
  console.error(`Folder "${SRC}" not found. Create it and add your photos.`);
  process.exit(1);
});

for (const file of files) {
  const rel = path.relative(SRC, file).replace(/\.[^.]+$/, "");
  const base = path.join(OUT, rel);
  await mkdir(path.dirname(base), { recursive: true });

  for (const width of WIDTHS) {
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${base}-${width}.webp`);
  }
  console.log(`✓ ${rel}`);
}
console.log(`Done: ${files.length} image(s).`);