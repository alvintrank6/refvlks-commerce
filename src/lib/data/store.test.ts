import { beforeAll, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { LocalStoreRepository } from "./local";
import { products } from "../catalog";

let directory: string;
let repository: LocalStoreRepository;

beforeAll(async () => {
  const parent = join(process.cwd(), "test-results");
  await mkdir(parent, { recursive: true });
  directory = await mkdtemp(join(parent, "store-"));
  repository = new LocalStoreRepository(directory);
});

describe("local store adapter", () => {
  it("reads the five sellable bag variants", async () => {
    const found = await repository.getProducts();
    expect(found).toHaveLength(4);
    expect(found.flatMap((product) => product.variants)).toHaveLength(5);
    expect(await repository.getProduct(products[0].handle)).toEqual(
      products[0],
    );
  });

  it("reserves stock atomically and refuses the next order", async () => {
    const sku = products[0].variants[0].sku;
    const draft = {
      cart: [{ sku, qty: 10 }],
      locale: "en" as const,
      name: "Test Customer",
      phone: "0900000000",
      email: null,
      address: null,
      city: "hanoi" as const,
      delivery: "pickup" as const,
      payment: "transfer" as const,
    };
    const placed = await repository.placeOrder(draft);
    expect(placed.subtotal).toBe(products[0].variants[0].priceVnd * 10);
    await expect(
      repository.placeOrder({ ...draft, cart: [{ sku, qty: 1 }] }),
    ).rejects.toThrow("OUT_OF_STOCK");
    const store = JSON.parse(
      await readFile(join(directory, "store.json"), "utf8"),
    );
    expect(store.inventory[sku]).toBe(0);
    expect(store.orders).toHaveLength(1);
  });

  it("persists visit and message requests", async () => {
    await repository.createVisit({
      name: "Test Customer",
      phone: "0900000000",
      email: null,
      date: "2026-11-01",
      time: "09:00",
      bag: null,
      note: null,
      locale: "en",
    });
    await repository.createMessage({
      name: "Test Customer",
      contact: "0900000000",
      topic: "other",
      orderNumber: null,
      body: "Test message",
      locale: "en",
    });
    expect(
      (await readFile(join(directory, "studio_visits.jsonl"), "utf8"))
        .trim()
        .split("\n"),
    ).toHaveLength(1);
    expect(
      (await readFile(join(directory, "messages.jsonl"), "utf8"))
        .trim()
        .split("\n"),
    ).toHaveLength(1);
  });
});
