import {env} from "cloudflare:workers";
import {NextRequest,NextResponse} from "next/server";
import {isLocale,paths} from "../../../../src/lib/catalog";
export async function POST(request:NextRequest){const form=await request.formData();const rawLocale=String(form.get("locale")??"en");const locale=isLocale(rawLocale)?rawLocale:"en";const token=String(form.get("token")??"");if(env.DB&&/^[0-9a-f]{64}$/.test(token))await env.DB.prepare("UPDATE orders SET customer_marked_paid_at=? WHERE token=? AND payment_method='transfer' AND customer_marked_paid_at IS NULL").bind(new Date().toISOString(),token).run();return NextResponse.redirect(new URL(`${paths(locale).order}/${token}`,request.url),303)}
