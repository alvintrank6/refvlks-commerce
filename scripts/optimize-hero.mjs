import sharp from "sharp";
import { join } from "node:path";

const directory = join(process.cwd(), "public/images/home");
const stem = "refvlks_home_02_hero-weft-structured-tote-mobile";
await sharp(join(directory, `${stem}.avif`))
  .resize(780, 1170, { fit: "cover" })
  .avif({ quality: 55, effort: 6 })
  .toFile(join(directory, `${stem}-perf.avif`));
await sharp(join(directory, `${stem}.webp`))
  .resize(780, 1170, { fit: "cover" })
  .webp({ quality: 78, effort: 6 })
  .toFile(join(directory, `${stem}-perf.webp`));
