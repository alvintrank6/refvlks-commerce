# Refvlks V2 storefront

An English and Vietnamese storefront for Refvlks work bags, studio visits and the monthly clothes donation programme. The Site runs on the existing Sites/Vinext Worker with Cloudflare D1 for the local production preview. This V2 branch has **not** been pushed or deployed; the hosted private Site still serves V1.

## Run locally

Requires Node.js 22.13 or newer. From this checkout:

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000/en> or <http://localhost:3000/vi>. Development defaults to the local file data adapter when no production database is configured; it needs no Supabase credentials. Local records are written to ignored `.data/`.

To preview the built Worker with D1:

```powershell
npm run build
npm run start -- --port 4173
```

Open <http://127.0.0.1:4173/en>. The local D1 database lives in ignored `.wrangler/state/`; apply any pending SQL in `drizzle/` before first use. See [HANDOVER.md](HANDOVER.md) for the exact migration and production preparation notes.

## Checks

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
node scripts/perf-check.mjs
node scripts/cross-browser-check.mjs
```

The browser and performance scripts target a built preview at port 4173. Browser screenshots, traces and JSON measurements are written under ignored `test-results/screens/`. The Playwright config uses Microsoft Edge for the main suite.

## Content and data

- `docs/10-UPDATE-V2.md` is the V2 source of page structure, approved copy and motion behavior. `docs/PROGRESS.md` records the implementation and checks for F1–F14.
- `src/messages/en.json` and `src/messages/vi.json` contain localized UI copy.
- `src/content/products.seed.json`, `assets.json`, `claims.ts`, `policy.ts` and `donation-events.json` hold the catalog, asset mapping, approved claims and null-safe event information.
- `src/lib/data/` contains local, D1 and optional Supabase adapters. D1 and Supabase migrations are in `drizzle/` and `supabase/migrations/`.
- Commerce accepts cash on delivery and bank transfer. The card page is a disabled preview. Seed prices, stock and shipping fees were approved for this local implementation by the owner in this task.

## Release boundary

No analytics, pixels or third-party marketing scripts were added. No push or deployment was performed. Legal review, remaining business details, live email and Supabase credentials, live QR scanning, and production order tests remain launch prerequisites; see [HANDOVER.md](HANDOVER.md).
