import {
  appendFile,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import raw from "../../content/donation-events.json";
import { products, productByHandle } from "../catalog";
import { cartDetails } from "../cart";
import { policy } from "../../content/policy";
import type { DonationRepository, DonationSignup } from "./donation";
import type {
  MessageDraft,
  OrderCreated,
  OrderDraft,
  StoreRepository,
  VisitDraft,
} from "./types";

let writeQueue: Promise<void> = Promise.resolve();
async function serialized<T>(action: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  try {
    return await action();
  } finally {
    release();
  }
}

/** File-backed development adapter. Records stay outside Git in `.data/`. */
export class LocalDonationRepository implements DonationRepository {
  constructor(protected readonly directory = process.env.DATA_DIR ?? ".data") {}

  async getEvent() {
    return raw;
  }

  async register(input: DonationSignup): Promise<"saved" | "rate_limited"> {
    return serialized(async () => {
      await mkdir(this.directory, { recursive: true });
      const file = join(this.directory, "donation_signups.jsonl");
      const existing = await readFile(file, "utf8").catch(
        (error: NodeJS.ErrnoException) => {
          if (error.code === "ENOENT") return "";
          throw error;
        },
      );
      if (input.ipHash) {
        const cutoff = Date.parse(input.createdAt) - 3_600_000;
        const recent = existing
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line) as DonationSignup)
          .filter(
            (row) =>
              row.ipHash === input.ipHash &&
              Date.parse(row.createdAt) >= cutoff,
          );
        if (recent.length >= 3) return "rate_limited";
      }
      await appendFile(file, JSON.stringify(input) + "\n", {
        encoding: "utf8",
        flag: "a",
      });
      return "saved";
    });
  }
}

/** Node development adapter; callers must keep it out of production without D1. */
export class LocalStoreRepository
  extends LocalDonationRepository
  implements StoreRepository
{
  async getProducts() {
    return products;
  }
  async getProduct(handle: string) {
    return productByHandle(handle) ?? null;
  }

  async placeOrder(input: OrderDraft): Promise<OrderCreated> {
    return serialized(async () => {
      const rows = cartDetails(input.cart);
      if (!rows.length) throw new Error("EMPTY_CART");
      await mkdir(this.directory, { recursive: true });
      const storeFile = join(this.directory, "store.json");
      const existing = await readFile(storeFile, "utf8").catch(
        (error: NodeJS.ErrnoException) => {
          if (error.code === "ENOENT") return '{"inventory":{},"orders":[]}';
          throw error;
        },
      );
      const store = JSON.parse(existing) as {
        inventory: Record<string, number>;
        orders: unknown[];
      };
      const stock = store.inventory;
      for (const row of rows) {
        const available = stock[row.variant.sku] ?? row.variant.stock;
        if (available < row.qty) throw new Error("OUT_OF_STOCK");
        stock[row.variant.sku] = available - row.qty;
      }
      const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
      const shipping =
        input.delivery === "pickup"
          ? 0
          : input.city === "hanoi"
            ? policy.shippingFeeHanoi
            : policy.shippingFeeOther;
      const total = subtotal + shipping;
      const token = Array.from(
        crypto.getRandomValues(new Uint8Array(32)),
        (byte) => byte.toString(16).padStart(2, "0"),
      ).join("");
      const number = `RV${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
      store.orders.push({
        ...input,
        token,
        number,
        subtotal,
        shipping,
        total,
        createdAt: new Date().toISOString(),
      });
      const storeTemp = `${storeFile}.${crypto.randomUUID()}.tmp`;
      await writeFile(storeTemp, JSON.stringify(store), "utf8");
      await rename(storeTemp, storeFile);
      return { token, number, subtotal, shipping, total };
    });
  }

  async createVisit(input: VisitDraft) {
    await serialized(async () => {
      const file = join(this.directory, "studio_visits.jsonl");
      const existing = await readFile(file, "utf8").catch(
        (error: NodeJS.ErrnoException) => {
          if (error.code === "ENOENT") return "";
          throw error;
        },
      );
      if (input.ipHash) {
        const recent = existing
          .split("\n")
          .filter(Boolean)
          .map(
            (line) =>
              JSON.parse(line) as { ipHash?: string | null; createdAt: string },
          )
          .filter(
            (row) =>
              row.ipHash === input.ipHash &&
              Date.parse(row.createdAt) >= Date.now() - 3_600_000,
          );
        if (recent.length >= 3) throw new Error("RATE_LIMITED");
      }
      const booked = await this.getBookedVisitSlots(input.date);
      if (booked.includes(input.time)) throw new Error("VISIT_SLOT_TAKEN");
      await mkdir(this.directory, { recursive: true });
      await appendFile(
        file,
        JSON.stringify({
          ...input,
          id: crypto.randomUUID(),
          status: "requested",
          createdAt: new Date().toISOString(),
        }) + "\n",
        "utf8",
      );
    });
  }

  async getBookedVisitSlots(date: string) {
    try {
      const lines = (
        await readFile(join(this.directory, "studio_visits.jsonl"), "utf8")
      )
        .trim()
        .split("\n");
      return lines
        .filter(Boolean)
        .map(
          (line) =>
            JSON.parse(line) as { date: string; time: string; status: string },
        )
        .filter((row) => row.date === date && row.status !== "cancelled")
        .map((row) => row.time);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async createMessage(input: MessageDraft) {
    await serialized(async () => {
      await mkdir(this.directory, { recursive: true });
      const file = join(this.directory, "messages.jsonl");
      const existing = await readFile(file, "utf8").catch(
        (error: NodeJS.ErrnoException) => {
          if (error.code === "ENOENT") return "";
          throw error;
        },
      );
      if (input.ipHash) {
        const recent = existing
          .split("\n")
          .filter(Boolean)
          .map(
            (line) =>
              JSON.parse(line) as { ipHash?: string | null; createdAt: string },
          )
          .filter(
            (row) =>
              row.ipHash === input.ipHash &&
              Date.parse(row.createdAt) >= Date.now() - 3_600_000,
          );
        if (recent.length >= 5) throw new Error("RATE_LIMITED");
      }
      await appendFile(
        file,
        JSON.stringify({
          ...input,
          id: crypto.randomUUID(),
          status: "new",
          createdAt: new Date().toISOString(),
        }) + "\n",
        "utf8",
      );
    });
  }
}
