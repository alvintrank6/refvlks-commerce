import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F6 Home closing at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en");
      await expect(page.locator("main [data-section]")).toHaveCount(5);
      await expect(page.locator("#carried .carried-photo")).toHaveCount(8);
      await expect(page.locator("#invitations .invitation-panel")).toHaveCount(
        2,
      );
      if (width >= 1024 && motion === "no-preference") {
        await expect(page.locator("#reveal")).toHaveClass(/is-cinematic/);
      }
      await page.locator("#carried").scrollIntoViewIfNeeded();
      if (width >= 1024 && motion === "no-preference") {
        await expect(page.locator("#carried")).toHaveClass(/is-pinned/);
      } else {
        await expect(page.locator("#carried")).not.toHaveClass(/is-pinned/);
      }
      await page.locator("#invitations").scrollIntoViewIfNeeded();
      await expect(
        page.getByRole("heading", {
          name: "Your old clothes, up the mountain.",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Come and carry one." }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      const directory = "test-results/screens/F6";
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: `${directory}/invitation-${width}-${motion}.png`,
      });
    });
  }
}

test("F6 gallery captions and invitations navigate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const first = page.locator("#carried .carried-photo figcaption a").first();
  await expect(first).toHaveAttribute(
    "href",
    /weft-structured-tote\?colour=brown/,
  );
  await first.click();
  await expect(page).toHaveURL(/weft-structured-tote\?colour=brown/);
  await page.goto("/en");
  await page
    .locator("#invitations")
    .getByRole("link", { name: "Join the next drive" })
    .click();
  await expect(page).toHaveURL(/\/en\/donation-event$/);
});

test("F6 desktop gallery reaches the closing promises by scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await expect(page.locator("#reveal")).toHaveClass(/is-cinematic/);
  await page.locator("#carried").scrollIntoViewIfNeeded();
  await expect(page.locator("#carried")).toHaveClass(/is-pinned/);
  const end = await page.locator("#carried").evaluate((section) => {
    const track = section.querySelector<HTMLElement>(".carried-track")!;
    const viewport = section.querySelector<HTMLElement>(".carried-viewport")!;
    return (
      section.getBoundingClientRect().top +
      window.scrollY +
      track.scrollWidth -
      viewport.clientWidth
    );
  });
  await page.evaluate((y) => window.scrollTo(0, y - 150), end);
  await expect
    .poll(() =>
      page
        .locator(".carried-outro")
        .evaluate((element) => element.getBoundingClientRect().left),
    )
    .toBeLessThan(1440);
  await expect(page.locator(".carried-outro .button")).toHaveAttribute(
    "href",
    /shipping-returns/,
  );
});

test("F6 Vietnamese copy and accessibility", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.locator("#carried h2")).toHaveText(
    "Mang theo khắp Hà Nội.",
  );
  await expect(page.locator("#invitations h3").first()).toHaveText(
    "Áo cũ của bạn, lên với vùng cao.",
  );
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
