// Source of truth: docs/02-CONTENT-SOURCE.md section 6. Only "approved" claims render.
export type ClaimStatus = "approved" | "pending";
export const CLAIMS = {
  "CL-01": "approved", // 70% new technical textile for the body
  "CL-02": "approved", // 30% recovered textile in handles, flaps, straps, scarf (by textile weight)
  "CL-03": "pending", // measured for every batch
  "CL-04": "pending", // lining woven by hand by [group] in [place]
  "CL-05": "pending", // name stays with every bag
  "CL-06": "pending", // fits a [x]-inch laptop
  "CL-07": "pending", // about the footprint of a 13 to 14-inch laptop
  "CL-08": "pending", // handles tested to [x] kg
  "CL-09": "pending", // made in [city]
  "CL-10": "approved", // inspect before you pay
  "CL-11": "approved", // repairs available
  "CL-12": "pending", // ships in [x] working days (assumed 1-2)
  "CL-13": "approved", // studio by appointment, every day 8:00-21:30
  "CL-14": "pending", // we reply within [x]
  "CL-15": "pending", // pattern meaning
  "CL-16": "pending", // agreed patterns, price, credit
  "CL-17": "approved", // monthly donation trips to the Northwest and other mountain regions
  "CL-18": "approved", // every donated piece is checked by our team
  "CL-19": "pending", // needs checked with local partners before each trip
  "CL-20": "pending", // impact numbers
  "CL-21": "approved", // clothes unfit to wear become recovered textile in Refvlks bags
  "CL-22": "pending", // drop-off at the studio during collection week
  "CL-23": "pending", // destinations and results posted after every trip
} as const satisfies Record<string, ClaimStatus>;
export type ClaimId = keyof typeof CLAIMS;
export const isApproved = (id: ClaimId) => CLAIMS[id] === "approved";
