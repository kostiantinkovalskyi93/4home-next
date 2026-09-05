import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");
const BACKUP_ROOT = path.resolve("image-backup-before-n10-6");

const MAX_LONG_SIDE = 2560;
const WEBP_QUALITY = 82;

function getFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getFiles(fullPath);
    }

    return entry.name.toLowerCase().endsWith(".webp") ? [fullPath] : [];
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeWithRetry(file, buffer, attempts = 8) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      fs.writeFileSync(file, buffer);
      return;
    } catch (error) {
      lastError = error;

      console.log(
        `WRITE RETRY ${attempt}/${attempts}: ${path.relative(ROOT, file)}`,
      );

      await sleep(300 * attempt);
    }
  }

  throw lastError;
}

const files = getFiles(ROOT);

let candidates = 0;
let replaced = 0;
let keptOriginal = 0;

let beforeBytes = 0;
let afterBytes = 0;

const results = [];

for (const file of files) {
  const metadata = await sharp(file).metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const longSide = Math.max(width, height);

  if (longSide <= MAX_LONG_SIDE) {
    continue;
  }

  candidates += 1;

  const relativePath = path.relative(ROOT, file);
  const backupPath = path.join(BACKUP_ROOT, relativePath);

  if (!fs.existsSync(backupPath)) {
    throw new Error(
      `Backup missing for ${relativePath}. Optimization stopped.`,
    );
  }

  const originalBuffer = fs.readFileSync(file);
  const originalSize = originalBuffer.length;

  beforeBytes += originalSize;

  const scale = MAX_LONG_SIDE / longSide;

  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const optimizedBuffer = await sharp(originalBuffer)
    .resize({
      width: targetWidth,
      height: targetHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: WEBP_QUALITY,
      effort: 5,
      smartSubsample: true,
    })
    .toBuffer();

  if (optimizedBuffer.length >= originalSize) {
    keptOriginal += 1;
    afterBytes += originalSize;

    results.push({
      file: relativePath.replaceAll("\\", "/"),
      before: `${width}x${height}`,
      target: `${targetWidth}x${targetHeight}`,
      beforeKB: Number((originalSize / 1024).toFixed(1)),
      optimizedKB: Number((optimizedBuffer.length / 1024).toFixed(1)),
      action: "KEPT ORIGINAL",
    });

    continue;
  }

  await writeWithRetry(file, optimizedBuffer);

  // Verify the file immediately after writing.
  const verifyMetadata = await sharp(file).metadata();

  if (
    !verifyMetadata.width ||
    !verifyMetadata.height ||
    Math.max(verifyMetadata.width, verifyMetadata.height) > MAX_LONG_SIDE
  ) {
    throw new Error(`Verification failed for ${relativePath}`);
  }

  replaced += 1;
  afterBytes += optimizedBuffer.length;

  results.push({
    file: relativePath.replaceAll("\\", "/"),
    before: `${width}x${height}`,
    target: `${verifyMetadata.width}x${verifyMetadata.height}`,
    beforeKB: Number((originalSize / 1024).toFixed(1)),
    optimizedKB: Number((optimizedBuffer.length / 1024).toFixed(1)),
    action: "REPLACED",
  });
}

console.log("");
console.log("N10.6 IMAGE OPTIMIZATION COMPLETE");
console.log("");

console.table(results);

console.log("");
console.log(`CANDIDATES: ${candidates}`);
console.log(`REPLACED: ${replaced}`);
console.log(`KEPT ORIGINAL: ${keptOriginal}`);

console.log("");
console.log(
  `CANDIDATE SIZE BEFORE: ${(beforeBytes / 1024 / 1024).toFixed(2)} MB`,
);

console.log(
  `CANDIDATE SIZE AFTER: ${(afterBytes / 1024 / 1024).toFixed(2)} MB`,
);

console.log(
  `SAVED: ${((beforeBytes - afterBytes) / 1024 / 1024).toFixed(2)} MB`,
);

console.log("");
console.log("Backup preserved at:");
console.log(BACKUP_ROOT);