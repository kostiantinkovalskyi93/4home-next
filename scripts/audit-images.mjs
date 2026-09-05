import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");

function getFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getFiles(fullPath);
    }

    return entry.name.toLowerCase().endsWith(".webp") ? [fullPath] : [];
  });
}

const files = getFiles(ROOT);
const results = [];

for (const file of files) {
  const metadata = await sharp(file).metadata();
  const stats = fs.statSync(file);

  results.push({
    file: path.relative(ROOT, file).replaceAll("\\", "/"),
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    megapixels:
      metadata.width && metadata.height
        ? Number(((metadata.width * metadata.height) / 1_000_000).toFixed(2))
        : 0,
    kb: Number((stats.size / 1024).toFixed(1)),
  });
}

results.sort((a, b) => {
  const pixelsA = a.width * a.height;
  const pixelsB = b.width * b.height;

  return pixelsB - pixelsA;
});

console.log("");
console.log(`IMAGE COUNT: ${results.length}`);
console.log("");

console.table(results);

const totalBytes = files.reduce(
  (sum, file) => sum + fs.statSync(file).size,
  0,
);

console.log("");
console.log(`TOTAL SIZE: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

console.log("");
console.log("LARGE IMAGES >= 2000px:");
console.table(
  results.filter(
    (image) => image.width >= 2000 || image.height >= 2000,
  ),
);

console.log("");
console.log("VERY LARGE IMAGES >= 3000px:");
console.table(
  results.filter(
    (image) => image.width >= 3000 || image.height >= 3000,
  ),
);