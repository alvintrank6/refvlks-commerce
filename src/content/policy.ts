// Seed source: docs/02-CONTENT-SOURCE.md section 8 and docs/04a-POLICIES-VI.md.
// Product prices and shipping fees were approved for this private storefront.
// Other draft policy values remain internal until the owner confirms them.
export const policy = {
  shippingFeeHanoi: 30_000,
  shippingFeeOther: 40_000,
  prepDays: [1, 2],
  deliveryDaysHanoi: [1, 2],
  deliveryDaysOther: [3, 5],
  codConfirmHours: 4,
  codAutoCancelHours: 24,
  codMaxItems: 2,
  codDepositPercent: 30,
  inspectMinutes: 10,
  claimHours: 48,
  exchangeDays: 7,
  exchangeLimit: 1,
  refundWorkingDays: 7,
  freeRepairMonths: 6,
  transferDeadlineHours: 24,
  contactRetentionMonths: 12,
} as const;
