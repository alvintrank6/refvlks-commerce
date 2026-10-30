import raw from "../../content/donation-events.json";
import type { Product } from "../catalog";
import type { DonationRepository, DonationSignup } from "./donation";
import type {
  MessageDraft,
  OrderCreated,
  OrderDraft,
  StoreRepository,
  VisitDraft,
} from "./types";

/** Service-role REST adapter; never instantiate in a client component. */
export class SupabaseDonationRepository implements DonationRepository {
  constructor(
    protected readonly url: string,
    protected readonly serviceKey: string,
  ) {}

  async getEvent() {
    return raw;
  }

  async register(input: DonationSignup): Promise<"saved" | "rate_limited"> {
    const endpoint = `${this.url.replace(/\/$/, "")}/rest/v1/donation_signups`;
    const headers = {
      apikey: this.serviceKey,
      Authorization: `Bearer ${this.serviceKey}`,
      "Content-Type": "application/json",
    };
    if (input.ipHash) {
      const query = new URL(endpoint);
      query.searchParams.set("select", "id");
      query.searchParams.set("ip_hash", `eq.${input.ipHash}`);
      query.searchParams.set(
        "created_at",
        `gte.${new Date(Date.parse(input.createdAt) - 3_600_000).toISOString()}`,
      );
      query.searchParams.set("limit", "3");
      const response = await fetch(query, { headers, cache: "no-store" });
      if (!response.ok)
        throw new Error(`Donation rate check failed: ${response.status}`);
      if (((await response.json()) as unknown[]).length >= 3)
        return "rate_limited";
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        id: input.id,
        name: input.name,
        phone: input.phone,
        email: input.email,
        role: input.role,
        amount: input.amount,
        note: input.note,
        consent_privacy: input.consentPrivacy,
        consent_recycle: input.consentRecycle,
        locale: input.locale,
        event_id: input.eventId,
        status: input.status,
        created_at: input.createdAt,
        ip_hash: input.ipHash,
      }),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Donation signup failed: ${response.status}`);
    return "saved";
  }
}

export class SupabaseStoreRepository
  extends SupabaseDonationRepository
  implements StoreRepository
{
  private endpoint(path: string) {
    return `${this.url.replace(/\/$/, "")}/rest/v1/${path}`;
  }
  private headers(extra: Record<string, string> = {}) {
    return {
      apikey: this.serviceKey,
      Authorization: `Bearer ${this.serviceKey}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(
      this.endpoint("products?select=payload&status=eq.active"),
      { headers: this.headers(), cache: "no-store" },
    );
    if (!response.ok)
      throw new Error(`Product read failed: ${response.status}`);
    return ((await response.json()) as { payload: Product }[]).map(
      (row) => row.payload,
    );
  }

  async getProduct(handle: string): Promise<Product | null> {
    const query = new URL(this.endpoint("products"));
    query.searchParams.set("select", "payload");
    query.searchParams.set("handle", `eq.${handle}`);
    query.searchParams.set("status", "eq.active");
    query.searchParams.set("limit", "1");
    const response = await fetch(query, {
      headers: this.headers(),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Product read failed: ${response.status}`);
    return (
      ((await response.json()) as { payload: Product }[])[0]?.payload ?? null
    );
  }

  async placeOrder(input: OrderDraft): Promise<OrderCreated> {
    const response = await fetch(this.endpoint("rpc/create_order"), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        p_customer: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          address: input.address,
          city: input.city,
          delivery: input.delivery,
          payment: input.payment,
          locale: input.locale,
        },
        p_items: input.cart,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const failure = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(
        failure.message?.includes("OUT_OF_STOCK")
          ? "OUT_OF_STOCK"
          : `Order failed: ${response.status}`,
      );
    }
    return (await response.json()) as OrderCreated;
  }

  async createVisit(input: VisitDraft) {
    const response = await fetch(this.endpoint("studio_visits"), {
      method: "POST",
      headers: this.headers({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        id: crypto.randomUUID(),
        name: input.name,
        phone: input.phone,
        email: input.email,
        visit_date: input.date,
        visit_time: input.time,
        bag: input.bag,
        note: input.note,
        locale: input.locale,
        status: "requested",
        created_at: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Visit failed: ${response.status}`);
  }

  async createMessage(input: MessageDraft) {
    const response = await fetch(this.endpoint("messages"), {
      method: "POST",
      headers: this.headers({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        id: crypto.randomUUID(),
        name: input.name,
        contact: input.contact,
        topic: input.topic,
        order_number: input.orderNumber,
        body: input.body,
        locale: input.locale,
        status: "new",
        created_at: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Message failed: ${response.status}`);
  }
}
