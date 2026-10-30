import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, paths } from "../../../src/lib/catalog";
import { donationRepository } from "../../../src/lib/data";
import {
  validateDonation,
  type DonationSignup,
} from "../../../src/lib/data/donation";

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
      new URL(`${paths(locale).donation}?status=${status}#join`, request.url),
      303,
    );

  if (clean(form, "website")) return redirect("error");
  const role = clean(form, "role", 12);
  const amount = clean(form, "amount", 12);
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipHash = ip
    ? Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(
              `${new Date().toISOString().slice(0, 10)}:${ip}:${process.env.RATE_LIMIT_SALT ?? "refvlks"}`,
            ),
          ),
        ),
        (byte) => byte.toString(16).padStart(2, "0"),
      ).join("")
    : null;
  const input: Partial<DonationSignup> = {
    id: crypto.randomUUID(),
    name: clean(form, "name", 80),
    phone: clean(form, "phone", 20),
    email: clean(form, "email", 150) || null,
    role:
      role === "donate" || role === "volunteer" || role === "both"
        ? role
        : undefined,
    amount:
      amount === "one" || amount === "two-three" || amount === "more"
        ? amount
        : null,
    note: clean(form, "note", 300) || null,
    consentPrivacy: form.has("consentPrivacy") ? true : undefined,
    consentRecycle: form.has("consentRecycle"),
    locale,
    eventId: null,
    status: "new",
    createdAt: new Date().toISOString(),
    ipHash,
  };
  if (!validateDonation(input)) return redirect("error");
  try {
    const repository = await donationRepository(env.DB);
    return redirect(
      (await repository.register(input)) === "saved" ? "success" : "rate-limit",
    );
  } catch {
    return redirect("error");
  }
}
