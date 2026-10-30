import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F11 Donation Event at ${width}px with ${motion}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en/donation-event");
      await expect(page.locator("main section[data-section]")).toHaveCount(3);
      await expect(
        page.locator('[data-section="DE-02"] .story-stack-card'),
      ).toHaveCount(4);
      await expect(
        page.getByRole("heading", { name: "Join the next drive." }),
      ).toBeVisible();
      await expect(
        page.getByText("The date for next month's drive is announced here", {
          exact: false,
        }),
      ).toBeVisible();
      await expect(page.locator(".donation-impact")).toHaveCount(0);
      await expect(page.getByText("After every trip we post")).toHaveCount(0);
      await page.locator('[data-section="DE-03"]').scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      if (width === 1440 && motion === "reduce") {
        await mkdir("test-results/screens/F11", { recursive: true });
        await page.screenshot({
          path: "test-results/screens/F11/donation-1440-reduce.png",
          fullPage: true,
        });
      }
    });
  }
}

test("F11 donor signup requires recycling consent and thanks by name", async ({
  page,
}) => {
  await page.goto("/en/donation-event#join");
  await page.locator("#donation-name").fill("Avery Tester");
  await page.locator("#donation-phone").fill("0912345678");
  await page.locator('input[name="consentPrivacy"]').check();
  await page
    .locator(".donation-form")
    .getByRole("button", { name: /Count me in/ })
    .click();
  await expect(page.locator("#donation-recycle-error")).toBeVisible();
  await expect(page).toHaveURL(/\/en\/donation-event#join/);
  await page.locator('input[name="consentRecycle"]').check();
  await page
    .locator(".donation-form")
    .getByRole("button", { name: /Count me in/ })
    .click();
  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByRole("status")).toContainText("Avery Tester");
});

test("F11 volunteer signup works without recycling consent and without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/vi/su-kien-quyen-gop");
  await page.locator("#donation-name").fill("Nguyen Tester");
  await page.locator("#donation-phone").fill("0912345678");
  await page.locator('input[name="role"][value="volunteer"]').check();
  await page.locator('input[name="consentPrivacy"]').check();
  await page
    .locator(".donation-form")
    .getByRole("button", { name: /Đăng ký tham gia/ })
    .click();
  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByRole("status")).toContainText("Nguyen Tester");
  await context.close();
});

test("F11 donation signup limits repeated submissions by IP", async ({
  request,
}) => {
  const headers = {
    "x-forwarded-for": `198.51.100.${(Date.now() % 200) + 20}`,
  };
  for (let index = 0; index < 4; index++) {
    const response = await request.post("/api/donation", {
      form: {
        locale: "en",
        name: "Rate Tester",
        phone: "0912345678",
        role: "donate",
        consentPrivacy: "on",
        consentRecycle: "on",
      },
      headers,
      maxRedirects: 0,
    });
    expect(response.headers().location).toContain(
      index === 3 ? "status=rate-limit" : "status=success",
    );
  }
});

test("F11 Donation Event has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/en/donation-event");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
});
