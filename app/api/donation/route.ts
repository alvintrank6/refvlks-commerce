import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, paths } from "../../../src/lib/catalog";
import { donationRepository } from "../../../src/lib/data";
import {
  validateDonation,
  type DonationSignup,
} from "../../../src/lib/data/donation";
import { requestIpHash } from "../../../src/lib/ip-hash";
import { sendTransactionalEmail } from "../../../src/lib/email";

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
  const ipHash = await requestIpHash(request);
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
    const status = await repository.register(input);
    if (status === "rate_limited") return redirect("rate-limit");
    if (process.env.DONATION_NOTIFY_EMAIL)
      await sendTransactionalEmail({
        to: process.env.DONATION_NOTIFY_EMAIL,
        subject: `Refvlks donation signup: ${input.role}`,
        text: `Name: ${input.name}\nPhone: ${input.phone}\nEmail: ${input.email ?? ""}\nRole: ${input.role}\nAmount: ${input.amount ?? ""}\nNote: ${input.note ?? ""}`,
        idempotencyKey: `donation-${input.id}`,
      }).catch((error) => console.error("Donation notification failed", error));
    const response = redirect("success");
    response.cookies.set("donation-thanks", input.name, {
      path: "/",
      maxAge: 60,
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  } catch {
    return redirect("error");
  }
}
