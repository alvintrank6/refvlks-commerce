import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F9 studio at ${width}px with ${motion}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en/studio");
      await expect(page.locator("main section[data-section]")).toHaveCount(3);
      await expect(
        page.getByRole("heading", { name: "Try it on before you decide." }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Find us." }),
      ).toBeVisible();
      await expect(page.locator("#visit-time option[value]")).toHaveCount(28);
      await page.locator(".studio-location").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    });
  }
}

test("F9 studio booking persists and blocks a duplicate slot", async ({
  page,
  request,
}) => {
  const date = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
  const booked = (
    await (await request.get(`/api/visits/slots?date=${date}`)).json()
  ).booked as string[];
  const time = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"].find(
    (slot) => !booked.includes(slot),
  )!;
  await page.goto("/en/studio");
  await page.locator("#visit-name").fill("Studio Tester");
  await page.locator("#visit-phone").fill("0912345678");
  await page.locator("#visit-date").fill(date);
  await page.locator("#visit-time").selectOption(time);
  await page.locator('input[name="consent"]').check();
  await page
    .locator(".booking-card form")
    .getByRole("button", { name: /Book a visit/ })
    .click();
  await expect(page).toHaveURL(/status=success/);
  const slots = await request.get(`/api/visits/slots?date=${date}`);
  expect((await slots.json()).booked).toContain(time);
  await page.goto("/en/studio");
  await page.locator("#visit-date").fill(date);
  await expect(
    page.locator(`#visit-time option[value="${time}"]`),
  ).toBeDisabled();
  const duplicate = await request.post("/api/visits", {
    form: {
      locale: "en",
      name: "Another Tester",
      phone: "0912345678",
      date,
      time,
      consent: "on",
    },
    maxRedirects: 0,
  });
  expect(duplicate.headers().location).toContain("status=taken");
});

test("F9 contact topics and message persistence", async ({ page }) => {
  await page.goto("/en/contact?topic=repair");
  await expect(page.locator("#message-topic")).toHaveValue("repair");
  await expect(page.locator("#message-order")).toBeVisible();
  await page.locator("#message-topic").selectOption("press");
  await expect(page.locator("#message-order")).toBeHidden();
  await page.locator("#message-name").fill("Contact Tester");
  await page.locator("#message-contact").fill("0912345678");
  await page
    .locator("#message-body")
    .fill("Please contact me about the collection.");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page).toHaveURL(/status=success/);
  await expect(page.getByRole("status")).toContainText("recorded");
});

test("F9 forms show field errors beside invalid fields", async ({ page }) => {
  await page.goto("/en/studio");
  await page
    .locator(".validated-form")
    .getByRole("button", { name: /Book a visit/ })
    .click();
  await expect(page.locator("#visit-name-error")).toBeVisible();
  await expect(page.locator("#visit-phone-error")).toBeVisible();
  await expect(page.locator("#visit-date-error")).toBeVisible();
  await page.goto("/en/contact");
  await page
    .locator(".validated-form")
    .getByRole("button", { name: /send/i })
    .click();
  await expect(page.locator("#message-name-error")).toBeVisible();
  await expect(page.locator("#message-contact-error")).toBeVisible();
  await expect(page.locator("#message-body-error")).toBeVisible();
});

test("F9 visit and contact forms rate limit by IP", async ({ request }) => {
  const date = new Date(Date.now() + 10 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const booked = (
    await (await request.get(`/api/visits/slots?date=${date}`)).json()
  ).booked as string[];
  const times = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
  ]
    .filter((slot) => !booked.includes(slot))
    .slice(0, 4);
  const headers = { "x-forwarded-for": `203.0.113.${(Date.now() % 200) + 20}` };
  for (const [index, time] of times.entries()) {
    const response = await request.post("/api/visits", {
      form: {
        locale: "en",
        name: "Rate Tester",
        phone: "0912345678",
        date,
        time,
        consent: "on",
      },
      headers,
      maxRedirects: 0,
    });
    expect(response.headers().location).toContain(
      index === 3 ? "status=rate-limit" : "status=success",
    );
  }
  for (let index = 0; index < 6; index++) {
    const response = await request.post("/api/messages", {
      form: {
        locale: "en",
        name: "Rate Tester",
        contact: "0912345678",
        topic: "other",
        body: `Question number ${index}`,
        consent: "on",
      },
      headers,
      maxRedirects: 0,
    });
    expect(response.headers().location).toContain(
      index === 5 ? "status=rate-limit" : "status=success",
    );
  }
});

test("F9 studio has no serious accessibility violations", async ({ page }) => {
  await page.goto("/en/studio");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
});
