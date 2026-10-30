# Refvlks V2 · Local handoff

**Date:** 31 October 2026  
**Mode:** retrofit of the existing private Refvlks Site source  
**Scope:** F1–F14 in `docs/10-UPDATE-V2.md`  
**Release state:** local branch only; no push or deployment. The hosted private Site remains on V1.

## What is ready locally

- Bilingual EN/VI storefront with five catalog cards, filtering, product detail, cart, COD and bank transfer ordering, order confirmation, Studio booking, Contact, Craft, About, Donation Event signup, Help, Legal and localized 404.
- Responsive motion has full, touch and reduced/off paths. The Home page has five V2 sections; the other primary tabs have three sections each. Pending claims and null Donation Event details remain hidden.
- D1/local/Supabase repository adapters, database migrations and seed data are in the checkout. The local built preview uses D1. Supabase is optional and has not been connected to a hosted database.
- Localized SEO metadata, canonical/alternate URLs, sitemap, robots, branded share images and gated JSON-LD are in place. No analytics or third-party marketing scripts were added.

## Verified checks

| Check                                                                | Result                                                                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` | Passed; 8 unit tests                                                                                                                                                 |
| Complete Playwright suite before final image optimization            | 150/150 passed                                                                                                                                                       |
| Affected Home, Shop, Product, SEO suite after optimization           | 54/54 passed                                                                                                                                                         |
| Responsive widths and motion tiers                                   | 360, 390, 768, 1024, 1440 px; normal and reduced modes in page suites                                                                                                |
| Accessibility                                                        | No serious or critical axe findings in the checked pages; keyboard and no-JavaScript checks in page suites                                                           |
| Local dev command                                                    | `npm run dev` served `/en` and `/vi` at `http://localhost:3000` with HTTP 200                                                                                        |
| Cross-browser smoke                                                  | Edge and WebKit: Home, Shop, Product, Donation Event at 390/1440 px; desktop cart add passed, no page errors                                                         |
| Firefox                                                              | Playwright binary installed but could not launch on this Windows host; Windows reports an incorrect side-by-side configuration. Firefox behavior remains unverified. |

Screenshots from the page slices are under ignored `test-results/screens/F1/` and `F3/` through `F12/`; F2 was a data-only slice. Final mobile screenshots, Playwright traces, `performance.json` and `cross-browser.json` are under `test-results/screens/F14/`.

### Local mobile performance sample

Edge headless at 390 × 844, simulated 4× CPU and 1.6 Mbps / 150 ms RTT, reduced motion, built Worker on loopback. Each page was sampled once after the final optimization; these lab numbers are not field measurements.

| Page           |    LCP |   CLS | Initial JS, gzip equivalent |
| -------------- | -----: | ----: | --------------------------: |
| Home           | 1.40 s | 0.022 |                      213 KB |
| Shop           | 1.43 s | 0.018 |                      212 KB |
| Product        | 1.40 s | 0.028 |                      211 KB |
| Donation Event | 1.05 s | 0.030 |                      212 KB |

The V2 LCP, CLS and 220 KB initial JS budgets passed in this sample. INP and sustained animation frame rate were not measured. Run a real-device and production Lighthouse/Web Vitals pass before launch.

## Run and retest

From the checkout with Node.js 22.13 or newer:

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000/en> or <http://localhost:3000/vi>. The local development data adapter needs no secrets and writes ignored `.data/` records.

For built Worker QA, run `npm run build`, then apply pending D1 SQL **once, in order** to a fresh local database:

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_wealthy_silver_surfer.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_nifty_starfox.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_rapid_randall.sql
npm run start -- --port 4173
```

The current checkout's local D1 already has these migrations. Then run `npm run test:e2e`, `node scripts/perf-check.mjs` and `node scripts/cross-browser-check.mjs`. Repeated order tests change local seed stock.

## Owner decisions and launch work

1. Confirm legal entity name, tax code, registered address, public domain and contact channels in `src/content/site.ts`. The current private Site URL is used for canonical metadata until a final domain is supplied.
2. Obtain legal review of the Privacy, Terms and Payment drafts and approve the remaining policy figures in `src/content/policy.ts`. Only the owner-approved seed prices, stock and 30,000 ₫ / 40,000 ₫ shipping fees are shown as concrete commerce values.
3. Confirm physical bags against all five product cards, the mapped materials and gallery images. Confirm the shipping carrier and delivery arrangement.
4. Provide actual Donation Event date, collection window, destination and verified impact data before publishing those fields. Pending claims CL-19, CL-20, CL-22 and CL-23 stay hidden.
5. If Supabase will be used, apply `supabase/migrations/` and `supabase/seed.sql` to the chosen project, verify RLS with anonymous and service-role clients, and set the server-only credentials from `.env.example`. The hosted adapter and RLS have not been exercised here.
6. Configure Resend and notification addresses if transactional email is required; send real inbox and spam-folder tests. No live email keys were available here.
7. Scan a real VietQR with Techcombank and another bank app; validate recipient, amount and order reference. Place and cancel one COD and one transfer order on the intended production data store, and verify stock restoration.
8. Resolve Firefox's Windows runtime issue and check Firefox, real iOS Safari and production Web Vitals. Complete the commerce-site notification, domain/HTTPS and rollback checks before public launch.

The source commits for F1–F13 are on branch `refvlks-v2`; the final F14 commit records this handoff. The existing Sites project ID is retained in `.openai/hosting.json` for a later owner-authorized publication.
