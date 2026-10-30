import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { storeRepository } from "../../../../src/lib/data";

export async function GET(request: NextRequest) {
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return NextResponse.json({ booked: [] }, { status: 400 });
  const repository = await storeRepository(env.DB);
  const booked = await repository.getBookedVisitSlots(date);
  return NextResponse.json(
    { booked },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
