// Source of truth: docs/02-CONTENT-SOURCE.md sections 1-3. null = missing → UI hides the field.
export const site = {
  brand: "Refvlks",
  pronunciation: "re·folks", // assumed
  representative: "Nguyễn Tùng Anh",
  legalEntity: { name: null, taxCode: null, registeredAddress: null } as Record<string, string | null>,
  domain: null as string | null,
  contact: { phone: null, zalo: null, email: null, instagram: null, facebook: null, tiktok: null } as Record<string, string | null>,
  studio: {
    name: "Refvlks Studio", // assumed
    address: { vi: "22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội", en: "22 Le Quy Don, Hai Ba Trung Ward, Hanoi" },
    appointmentOnly: true,
    opens: "08:00",
    closes: "21:30",
    days: "Mo-Su", // open every day
    slotMinutes: 30,
    firstSlot: "08:00",
    lastSlot: "21:00",
  },
  payment: {
    methods: ["cod", "transfer"] as const,
    cardPreviewOnly: true,
    bank: {
      accountName: "NGUYEN TUNG ANH",
      accountNameDisplay: "NGUYEN TUNG ANH (Refvlks)",
      accountNumber: "19070671343017",
      bankName: process.env.BANK_NAME || "Techcombank",
      bankBin: process.env.BANK_BIN || "970407", // Techcombank BIN (SBV list)
    },
  },
} as const;
