import raw from "../../content/donation-events.json";
import type { Locale } from "../catalog";

export type DonationRole = "donate" | "volunteer" | "both";
export type DonationAmount = "one" | "two-three" | "more" | null;
export type DonationSignup = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: DonationRole;
  amount: DonationAmount;
  note: string | null;
  consentPrivacy: true;
  consentRecycle: boolean;
  locale: Locale;
  eventId: string | null;
  status: "new";
  createdAt: string;
  ipHash: string | null;
};

export interface DonationRepository {
  getEvent(): Promise<typeof raw>;
  register(input: DonationSignup): Promise<"saved" | "rate_limited">;
}

export function getDonationEvent() {
  return raw;
}

export function validateDonation(
  input: Partial<DonationSignup>,
): input is DonationSignup {
  return (
    typeof input.name === "string" &&
    input.name.trim().length >= 2 &&
    typeof input.phone === "string" &&
    /^0\d{9}$/.test(input.phone) &&
    (input.email == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) &&
    (input.role === "donate" ||
      input.role === "volunteer" ||
      input.role === "both") &&
    (input.role === "volunteer" || input.consentRecycle === true) &&
    (input.role === "volunteer" ||
      input.amount === null ||
      ["one", "two-three", "more"].includes(input.amount ?? "")) &&
    input.consentPrivacy === true &&
    (input.locale === "en" || input.locale === "vi") &&
    (input.note == null || input.note.length <= 300)
  );
}

export class D1DonationRepository implements DonationRepository {
  constructor(private readonly db: D1Database) {}

  async getEvent() {
    return raw;
  }

  async register(input: DonationSignup): Promise<"saved" | "rate_limited"> {
    if (input.ipHash) {
      const cutoff = new Date(
        Date.parse(input.createdAt) - 3_600_000,
      ).toISOString();
      const recent = await this.db
        .prepare(
          "SELECT COUNT(*) AS count FROM donation_signups WHERE ip_hash = ? AND created_at >= ?",
        )
        .bind(input.ipHash, cutoff)
        .first<{ count: number }>();
      if ((recent?.count ?? 0) >= 3) return "rate_limited";
    }
    await this.db
      .prepare(
        "INSERT INTO donation_signups (id,name,phone,email,role,amount,note,consent_privacy,consent_recycle,locale,event_id,status,created_at,ip_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        input.id,
        input.name,
        input.phone,
        input.email,
        input.role,
        input.amount,
        input.note,
        1,
        input.consentRecycle ? 1 : 0,
        input.locale,
        input.eventId,
        input.status,
        input.createdAt,
        input.ipHash,
      )
      .run();
    return "saved";
  }
}
