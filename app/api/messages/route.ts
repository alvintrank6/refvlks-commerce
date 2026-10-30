import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { isLocale, paths } from "../../../src/lib/catalog";
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
      new URL(`${paths(locale).contact}?status=${status}`, request.url),
      303,
    );
  const name = clean(form, "name", 80);
  const contact = clean(form, "contact", 150);
  const topic = clean(form, "topic", 30);
  const orderNumber = clean(form, "orderNumber", 40);
  const body = clean(form, "body", 2000);
  if (
    name.length < 2 ||
    contact.length < 5 ||
    body.length < 5 ||
    !["order", "visit", "repair", "corporate", "press", "other"].includes(
      topic,
    ) ||
    !form.has("consent") ||
    clean(form, "website")
  )
    return redirect("error");
  try {
    const repository = await storeRepository(env.DB);
    await repository.createMessage({
      name,
      contact,
      topic,
      orderNumber: orderNumber || null,
      body,
      locale,
      ipHash: await requestIpHash(request),
    });
    if (process.env.ORDER_NOTIFY_EMAIL)
      await sendTransactionalEmail({
        to: process.env.ORDER_NOTIFY_EMAIL,
        subject: `Refvlks message: ${topic}`,
        text: `Name: ${name}\nContact: ${contact}\nTopic: ${topic}\nOrder: ${orderNumber}\nMessage: ${body}`,
        idempotencyKey: `message-${crypto.randomUUID()}`,
      }).catch((error) => console.error("Message notification failed", error));
    return redirect("success");
  } catch (error) {
    return redirect(
      String(error).includes("RATE_LIMITED") ? "rate-limit" : "error",
    );
  }
}
