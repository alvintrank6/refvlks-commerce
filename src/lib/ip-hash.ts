import type { NextRequest } from "next/server";

export async function requestIpHash(request: NextRequest) {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  const bytes = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(
        `${new Date().toISOString().slice(0, 10)}:${ip}:${process.env.RATE_LIMIT_SALT ?? "refvlks"}`,
      ),
    ),
  );
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
