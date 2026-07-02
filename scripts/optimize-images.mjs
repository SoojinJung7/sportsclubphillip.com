// ---------------------------------------------------------------------------
// One-shot image optimizer for the Wix → local cutover.
//
// Reads the original assets downloaded to public/images/ (gitignored backups,
// some 8–10 MB) and writes size-capped, re-encoded copies into
// src/assets/images/ where astro:assets picks them up and generates responsive
// WebP at build time. Logos/icons that are already small pass through untouched
// (aside from a lossless re-encode).
//
// Run once after refreshing the originals:  node scripts/optimize-images.mjs
// ---------------------------------------------------------------------------
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/images';
const OUT = 'src/assets/images';
const MAX_WIDTH = 1600; // width cap — plenty for full-bleed photos; keeps tall
                        // schedule posters legible (height scales freely, so a
                        // very tall timetable isn't crushed to an unreadable width)
const JPG_Q = 82;

// Orphan originals that are not referenced by the site (naver booking is a link,
// not an <img>). Everything else in public/images is fair game.
const SKIP = new Set(['naver-booking-logo.png']);

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f));
let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const inPath = path.join(SRC, file);
  const outPath = path.join(OUT, file);
  const inBytes = fs.statSync(inPath).size;
  before += inBytes;

  const img = sharp(inPath, { failOn: 'none' });
  const meta = await img.metadata();
  if ((meta.width ?? 0) > MAX_WIDTH) {
    img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const isPng = /\.png$/i.test(file);
  if (isPng) {
    img.png({ compressionLevel: 9, palette: true });
  } else {
    img.jpeg({ quality: JPG_Q, mozjpeg: true });
  }

  await img.toFile(outPath);
  const outBytes = fs.statSync(outPath).size;
  after += outBytes;
  rows.push({ file, from: kb(inBytes), to: kb(outBytes), dims: `${meta.width}x${meta.height}` });
}

function kb(b) {
  return b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + 'M' : Math.round(b / 1024) + 'K';
}

rows.sort((a, b) => a.file.localeCompare(b.file));
for (const r of rows) console.log(`${r.file.padEnd(30)} ${r.dims.padEnd(12)} ${r.from.padStart(6)} → ${r.to.padStart(6)}`);
console.log('─'.repeat(60));
console.log(`${files.length} files   ${kb(before)} → ${kb(after)}  (source committed to git; build emits WebP)`);
