import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const cases = [
  ["edge", chromium, { channel: "msedge" }],
  ["firefox", firefox, {}],
  ["webkit", webkit, {}],
];
const base = "http://127.0.0.1:4173";
const output = join(process.cwd(), "test-results/screens/F14");
await mkdir(output, { recursive: true });
const results = [];
for (const [name, engine, options] of cases) {
  let browser;
  try {
    browser = await engine.launch({ headless: true, ...options });
  } catch (error) {
    results.push({
      browser: name,
      status: "launch failed",
      reason: String(error).split("\n")[0],
    });
    continue;
  }
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [
      "/en",
      "/en/shop",
      "/en/products/weft-structured-tote",
      "/en/donation-event",
    ]) {
      const response = await page.goto(base + path, {
        waitUntil: "domcontentloaded",
      });
      if (response.status() !== 200)
        throw new Error(`${name} ${width} ${path}: ${response.status()}`);
      const h1 = await page.locator("h1").first().textContent();
      if (!h1?.trim()) throw new Error(`${name} ${width} ${path}: missing H1`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 2,
      );
      if (overflow)
        throw new Error(`${name} ${width} ${path}: horizontal overflow`);
    }
    if (width === 1440) {
      await page.goto(base + "/en/products/weft-structured-tote");
      await page
        .getByRole("button", { name: /Add to bag/i })
        .first()
        .click();
      await page.waitForURL(/\/en\/cart/);
      if (!(await page.locator(".cart-row").count()))
        throw new Error(`${name}: cart did not receive product`);
    }
    if (errors.length)
      throw new Error(`${name} ${width}: ${errors.join("; ")}`);
    results.push({
      browser: name,
      width,
      pages: 4,
      cart: width === 1440 ? "passed" : "not run",
      pageErrors: 0,
    });
    await page.close();
  }
  await browser.close();
}
await writeFile(
  join(output, "cross-browser.json"),
  JSON.stringify(results, null, 2),
);
console.log(results);
