import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const assets = JSON.parse(await readFile(join(root, "src/content/assets.json"), "utf8")).assets;
const products = JSON.parse(await readFile(join(root, "src/content/products.seed.json"), "utf8")).products;
const logo = await readFile(join(root, "public/brand/refvlks_logo_wordmark_reversed_on-cocoa.svg"));
const out = join(root, "public/images/og");
await mkdir(out, { recursive: true });

async function render(name, assetId) {
  const asset = assets.find((item) => item.id === assetId);
  const file = asset?.variants.find((variant) => variant.files.webp)?.files.webp;
  if (!file) throw new Error(`Missing OG photo: ${assetId}`);
  const photo = await sharp(join(root, "public", file.slice(1))).resize(650, 630, { fit: "cover", position: "centre" }).toBuffer();
  const wordmark = await sharp(logo).resize(470).toBuffer();
  const small = Buffer.from(`<svg width="550" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="550" height="630" fill="#4A2E1F"/><path d="M48 430H500" stroke="#B3341F" stroke-width="3"/><text x="48" y="482" fill="#F4EFE6" font-size="23" font-family="Arial,sans-serif" letter-spacing="2">QUIET OUTSIDE.</text><text x="48" y="518" fill="#F4EFE6" font-size="23" font-family="Arial,sans-serif" letter-spacing="2">WOVEN INSIDE.</text><text x="48" y="582" fill="#E8DFD0" font-size="14" font-family="Arial,sans-serif" letter-spacing="2">HANOI · WORK BAGS</text></svg>`);
  const panel = await sharp(small).composite([{ input: wordmark, left: 40, top: 130 }]).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#4A2E1F" } })
    .composite([{ input: panel, left: 0, top: 0 }, { input: photo, left: 550, top: 0 }])
    .jpeg({ quality: 88 }).toFile(join(out, `refvlks_og_${name}.jpg`));
}
await render("v2", "HOME-01");
for (const product of products.filter((p) => p.status === "active")) await render(product.handle, product.variants[0].cardImage);
