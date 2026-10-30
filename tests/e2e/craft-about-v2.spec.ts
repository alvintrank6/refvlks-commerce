import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F10 Craft and About at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      for (const [path, prefix] of [["/en/craft", "CR"], ["/vi/ve-chung-toi", "AB"]]) {
        await page.goto(path);
        await expect(page.locator("main section[data-section]")).toHaveCount(3);
        await expect(page.locator(`main section[data-section^="${prefix}"]`)).toHaveCount(3);
        await page.locator("main section[data-section]").last().scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      }
      expect(errors).toEqual([]);
      if (width === 1440) {
        await mkdir("test-results/screens/F10", { recursive: true });
        await page.screenshot({ path: `test-results/screens/F10/about-${motion}.png`, fullPage: true });
      }
    });
  }
}

test("F10 Craft has five process cards and hides pending hand-weaver claims", async ({ page }) => {
  await page.goto("/en/craft");
  await expect(page.locator('[data-section="CR-02"] .story-stack-card')).toHaveCount(5);
  await expect(page.getByText("What we don't claim yet.")).toBeVisible();
  await expect(page.getByText(/Woven by hand by/)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Shop Heritage" })).toHaveAttribute("href", /tier=heritage/);
});

test("F10 About links the source and donation event", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.locator('[data-section="AB-02"] .story-stack-card')).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Doãn Hòa/ })).toHaveAttribute("href", /tuoitre\.vn/);
  await expect(page.getByRole("link", { name: "Join the donation event" })).toHaveAttribute("href", "/en/donation-event");
});

test("F10 content remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/en/craft");
  await expect(page.getByRole("heading", { name: "From cloth to bag." })).toBeVisible();
  await expect(page.locator('.ratio-number[data-count="70"]')).toHaveText("70%");
  await context.close();
});

test("F10 Craft and About have no serious accessibility violations", async ({ page }) => {
  for (const path of ["/en/craft", "/en/about"]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? ""))).toEqual([]);
  }
});
