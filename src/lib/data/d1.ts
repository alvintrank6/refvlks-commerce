import { products, productByHandle } from "../catalog";
import { cartDetails } from "../cart";
import { policy } from "../../content/policy";
import { D1DonationRepository, type DonationSignup } from "./donation";
import type {
  MessageDraft,
  OrderCreated,
  OrderDraft,
  StoreRepository,
  VisitDraft,
} from "./types";

export class D1StoreRepository implements StoreRepository {
  private readonly donation: D1DonationRepository;

  constructor(private readonly db: D1Database) {
    this.donation = new D1DonationRepository(db);
  }

  getEvent() {
    return this.donation.getEvent();
  }
  register(input: DonationSignup) {
    return this.donation.register(input);
  }
  async getProducts() {
    return products;
  }
  async getProduct(handle: string) {
    return productByHandle(handle) ?? null;
  }

  async placeOrder(input: OrderDraft): Promise<OrderCreated> {
    const rows = cartDetails(input.cart);
    if (!rows.length) throw new Error("EMPTY_CART");
    const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
    const shipping =
      input.delivery === "pickup"
        ? 0
        : input.city === "hanoi"
          ? policy.shippingFeeHanoi
          : policy.shippingFeeOther;
    const total = subtotal + shipping;
    const id = crypto.randomUUID();
    const token = Array.from(
      crypto.getRandomValues(new Uint8Array(32)),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");
    const number = `RV${Date.now()}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    const createdAt = new Date().toISOString();
    await this.db.batch(
      rows.map((row) =>
        this.db
          .prepare("INSERT OR IGNORE INTO inventory (sku,stock) VALUES (?,?)")
          .bind(row.variant.sku, row.variant.stock),
      ),
    );
    await this.db.batch([
      this.db
        .prepare(
          "INSERT INTO orders (id,token,number,created_at,locale,status,payment_method,delivery,customer_name,phone,email,address,city,subtotal,shipping_fee,total) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(
          id,
          token,
          number,
          createdAt,
          input.locale,
          input.payment === "cod" ? "pending_confirmation" : "pending_payment",
          input.payment,
          input.delivery,
          input.name,
          input.phone,
          input.email,
          input.address,
          input.city,
          subtotal,
          shipping,
          total,
        ),
      ...rows.map((row) =>
        this.db
          .prepare(
            "INSERT INTO order_items (id,order_id,sku,name,colour,qty,unit_price) VALUES (?,?,?,?,?,?,?)",
          )
          .bind(
            crypto.randomUUID(),
            id,
            row.variant.sku,
            row.product.name[input.locale],
            row.variant.colour[input.locale],
            row.qty,
            row.variant.priceVnd,
          ),
      ),
    ]);
    return { token, number, subtotal, shipping, total };
  }

  async createVisit(input: VisitDraft) {
    if (input.ipHash) {
      const cutoff = new Date(Date.now() - 3_600_000).toISOString();
      const recent = await this.db
        .prepare(
          "SELECT COUNT(*) AS count FROM studio_visits WHERE ip_hash = ? AND created_at >= ?",
        )
        .bind(input.ipHash, cutoff)
        .first<{ count: number }>();
      if ((recent?.count ?? 0) >= 3) throw new Error("RATE_LIMITED");
    }
    await this.db
      .prepare(
        "INSERT INTO studio_visits (id,created_at,name,phone,email,visit_date,visit_time,bag,note,locale,status,ip_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        new Date().toISOString(),
        input.name,
        input.phone,
        input.email,
        input.date,
        input.time,
        input.bag,
        input.note,
        input.locale,
        "requested",
        input.ipHash ?? null,
      )
      .run();
  }

  async getBookedVisitSlots(date: string) {
    const rows = await this.db
      .prepare(
        "SELECT visit_time FROM studio_visits WHERE visit_date = ? AND status != 'cancelled'",
      )
      .bind(date)
      .all<{ visit_time: string }>();
    return rows.results.map((row) => row.visit_time);
  }

  async createMessage(input: MessageDraft) {
    if (input.ipHash) {
      const cutoff = new Date(Date.now() - 3_600_000).toISOString();
      const recent = await this.db
        .prepare(
          "SELECT COUNT(*) AS count FROM messages WHERE ip_hash = ? AND created_at >= ?",
        )
        .bind(input.ipHash, cutoff)
        .first<{ count: number }>();
      if ((recent?.count ?? 0) >= 5) throw new Error("RATE_LIMITED");
    }
    await this.db
      .prepare(
        "INSERT INTO messages (id,created_at,name,contact,topic,order_number,body,locale,status,ip_hash) VALUES (?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        new Date().toISOString(),
        input.name,
        input.contact,
        input.topic,
        input.orderNumber,
        input.body,
        input.locale,
        "new",
        input.ipHash ?? null,
      )
      .run();
  }
}
