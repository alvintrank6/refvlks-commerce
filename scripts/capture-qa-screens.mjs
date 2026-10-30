import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const output = join(process.cwd(), "test-results/screens");
for (const width of [390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/en/products/weft-structured-tote");
  await page.getByRole("button", { name: /Add to bag/i }).first().click();
  await page.waitForURL(/\/en\/cart/);
  for (const [slice, name, path] of [
    ["F8", "checkout", "/en/checkout"],
    ["F9", "studio", "/en/studio"],
    ["F9", "contact", "/en/contact"],
    ["F12", "faq-vi", "/vi/ho-tro/cau-hoi"],
    ["F12", "privacy-vi", "/vi/phap-ly/bao-mat"],
  ]) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await mkdir(join(output, slice), { recursive: true });
    await page.screenshot({ path: join(output, slice, `${name}-${width}.png`), fullPage: true });
  }
  await context.close();
}
await browser.close();
