import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, paths, products } from "../../../src/lib/catalog";
import { storeRepository } from "../../../src/lib/data";

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
    (bag && !products.some((product) => product.handle === bag)) ||
    !form.has("consent")
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
    });
    return redirect("success");
  } catch {
    return redirect("error");
  }
}
