import type { Product, Locale } from "../catalog";
import type { CartLine } from "../cart";
import type { DonationRepository } from "./donation";

export type OrderDraft = {
  cart: CartLine[];
  locale: Locale;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: "hanoi" | "other";
  delivery: "ship" | "pickup";
  payment: "cod" | "transfer";
};

export type OrderCreated = {
  token: string;
  number: string;
  subtotal: number;
  shipping: number;
  total: number;
};
export type VisitDraft = {
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  bag: string | null;
  note: string | null;
  locale: Locale;
  ipHash?: string | null;
};
export type MessageDraft = {
  name: string;
  contact: string;
  topic: string;
  orderNumber: string | null;
  body: string;
  locale: Locale;
  ipHash?: string | null;
};

export interface StoreRepository extends DonationRepository {
  getProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  placeOrder(input: OrderDraft): Promise<OrderCreated>;
  createVisit(input: VisitDraft): Promise<void>;
  getBookedVisitSlots(date: string): Promise<string[]>;
  createMessage(input: MessageDraft): Promise<void>;
}
