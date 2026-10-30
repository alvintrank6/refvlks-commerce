import { D1StoreRepository } from "./d1";
import { SupabaseStoreRepository } from "./supabase";
import type { StoreRepository } from "./types";

/** D1 serves the Sites preview. Plain Node development defaults to local JSONL. */
export async function storeRepository(
  db?: D1Database,
): Promise<StoreRepository> {
  if (process.env.DATA_SOURCE === "supabase") {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
      throw new Error("Supabase server credentials are missing");
    return new SupabaseStoreRepository(url, key);
  }
  if (db) return new D1StoreRepository(db);
  if (process.env.NODE_ENV === "production")
    throw new Error("No production data store configured");
  const { LocalStoreRepository } = await import("./local");
  return new LocalStoreRepository();
}

export const donationRepository = storeRepository;
