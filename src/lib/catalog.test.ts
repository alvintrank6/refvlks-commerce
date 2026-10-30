import { describe, expect, it } from "vitest";
import { allVariants, dictionary, paths } from "./catalog";
import { routing } from "../i18n/routing";

describe("localized storefront foundation", () => {
  it("has five product cards with distinct SKUs", () => {
    expect(allVariants).toHaveLength(5);
    expect(new Set(allVariants.map(({ variant }) => variant.sku)).size).toBe(5);
  });

  it("links to the donation event in both locales", () => {
    expect(paths("en").donation).toBe("/en/donation-event");
    expect(paths("vi").donation).toBe("/vi/su-kien-quyen-gop");
    expect(dictionary("en").nav.donation).toBe("Donation Event");
    expect(dictionary("vi").nav.donation).toBe("Sự kiện quyên góp");
    expect(routing.pathnames["/donation-event"].vi).toBe("/su-kien-quyen-gop");
  });
});
