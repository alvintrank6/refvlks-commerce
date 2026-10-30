import { describe, expect, it } from "vitest";
import { join } from "node:path";
import {
  getDonationEvent,
  validateDonation,
  type DonationSignup,
} from "./donation";
import { LocalDonationRepository } from "./local";
import { isApproved } from "../../content/claims";

const input: DonationSignup = {
  id: "test-id",
  name: "Test Donor",
  phone: "0900000000",
  email: null,
  role: "donate",
  amount: "one",
  note: null,
  consentPrivacy: true,
  consentRecycle: true,
  locale: "en",
  eventId: null,
  status: "new",
  createdAt: new Date().toISOString(),
  ipHash: "local-test",
};

describe("V2 donation data", () => {
  it("hides unknown event dates and pending impact claims", () => {
    expect(getDonationEvent().nextEvent.date).toBeNull();
    expect(isApproved("CL-17")).toBe(true);
    expect(isApproved("CL-20")).toBe(false);
    expect(isApproved("CL-22")).toBe(false);
  });

  it("requires recycle consent from donors but not volunteers", () => {
    expect(validateDonation(input)).toBe(true);
    expect(validateDonation({ ...input, consentRecycle: false })).toBe(false);
    expect(
      validateDonation({ ...input, role: "volunteer", consentRecycle: false }),
    ).toBe(true);
    expect(validateDonation({ ...input, phone: "123" })).toBe(false);
  });

  it("stores local signups and limits one IP to three per hour", async () => {
    const repository = new LocalDonationRepository(
      join("test-results", "data", crypto.randomUUID()),
    );
    for (let index = 0; index < 3; index++) {
      expect(await repository.register({ ...input, id: `test-${index}` })).toBe(
        "saved",
      );
    }
    expect(await repository.register({ ...input, id: "test-four" })).toBe(
      "rate_limited",
    );
  });
});
