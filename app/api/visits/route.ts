import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, paths, products } from "../../../src/lib/catalog";
import { storeRepository } from "../../../src/lib/data";
import { sendTransactionalEmail } from "../../../src/lib/email";
import { requestIpHash } from "../../../src/lib/ip-hash";

const clean = (form: FormData, key: string, max = 250) =>
  String(form.get(key) ?? "")
    .trim()
    .slice(0, max);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const rawLocale = clean(form, "locale", 2);
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const redirect = (status: string) =>
    NextResponse.redirect(
      new URL(`${paths(locale).studio}?status=${status}#book`, request.url),
      303,
    );
  const name = clean(form, "name", 80);
  const phone = clean(form, "phone", 20);
  const email = clean(form, "email", 150);
  const date = clean(form, "date", 10);
  const time = clean(form, "time", 5);
  const bag = clean(form, "bag", 80);
  const note = clean(form, "note", 300);
  const minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const maxDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() + 30 * 86_400_000));
  if (
    name.length < 2 ||
    !/^0\d{9}$/.test(phone) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    date < today ||
    date > maxDate ||
    !/^\d{2}:\d{2}$/.test(time) ||
    minutes < 480 ||
    minutes > 1260 ||
    minutes % 30 !== 0 ||
    (date === today &&
      time <=
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())) ||
    (bag && !products.some((product) => product.handle === bag)) ||
    !form.has("consent") ||
    clean(form, "website")
  )
    return redirect("error");
  try {
    const repository = await storeRepository(env.DB);
    await repository.createVisit({
      name,
      phone,
      email: email || null,
      date,
      time,
      bag: bag || null,
      note: note || null,
      locale,
      ipHash: await requestIpHash(request),
    });
    if (process.env.ORDER_NOTIFY_EMAIL)
      await sendTransactionalEmail({
        to: process.env.ORDER_NOTIFY_EMAIL,
        subject: `Refvlks studio visit: ${date} ${time}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nBag: ${bag}\nNote: ${note}`,
        idempotencyKey: `visit-${date}-${time}`,
      }).catch((error) => console.error("Visit notification failed", error));
    return redirect("success");
  } catch (error) {
    return redirect(
      /unique|constraint|VISIT_SLOT_TAKEN|409/i.test(String(error))
        ? "taken"
        : String(error).includes("RATE_LIMITED")
          ? "rate-limit"
          : "error",
    );
  }
}
