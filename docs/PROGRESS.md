# Refvlks V2 progress

## 2026-10-30 · Retrofit audit

Existing checkout: Next.js App Router compatibility through Vinext, TypeScript, bilingual paths, original brand assets, five product cards, server-rendered catalog, cart, COD and bank-transfer checkout, studio and contact forms, D1 persistence, basic metadata and sitemap. The existing private Site remains published at its V1 commit; this V2 run is local only.

### Gaps against `10-UPDATE-V2.md`

| V2 slice | Existing work | Remaining work |
|---|---|---|
| F1–F2 | Locale routes, assets, catalog and D1 schema | Five-item navigation, Donation Event routes and seed, claim gate, local/Supabase adapter contract |
| F3–F4 | Header, footer, hero, product cards, product pages and cart | V2 page structure, card interaction, hotspots, product detail sections |
| F5–F6 | Simple reveal section and CSS transitions | E1–E5, E8–E10, E17–E20 with full/lite/off tiers; Home H-04 and H-05 |
| F7 | Server-rendered shop filters | S-01–S-03, marquee, tier comparison, motion |
| F8 | Working cart, checkout, transfer QR and stock transaction | V2 copy, field-level errors, copy actions, email integration when configured |
| F9 | Studio and contact forms persist to D1 | Three-section studio, slot availability, full contact topics, optional email |
| F10–F11 | Basic Craft and About | Three-section V2 content, Donation Event and registration |
| F12–F14 | Basic Help/Legal, metadata and sitemap | Complete content, 404, structured data, automation and browser QA evidence |

### Run plan

Work through F1–F14 in order, retaining working commerce code. Add verified tests and commit after each completed slice. Do not push or deploy. Record unresolved claims, absent owner data, and any checks that cannot be completed instead of presenting them as passed.

## F1 · Foundation retrofit

- Added five-item navigation, localized Donation Event routes, footer link and sitemap entries.
- Added design token sheet and Tailwind theme mapping. `next-intl` now provides client translation context through a client boundary; its pathname configuration records the EN/VI route contract.
- Retained the working Sites/Vinext runtime and commerce flow. The user-supplied V2 content and product seed are staged for F2.
- Format: `npx prettier --check` on changed source — pass.
- `npm run lint` — pass. `npm run typecheck` — pass. `npm run test` — 2 passed. `npm run build` — pass.
- `npm run test:e2e -- foundation.spec.ts` — 11 passed on local preview, including 360/390/768/1024/1440 pixels in normal and reduced-motion modes and an axe check for serious/critical issues. Screenshots: `test-results/screens/F1/`.
- Local HTTP checks: `/en`, `/en/donation-event`, `/vi/su-kien-quyen-gop`, `/sitemap.xml` returned 200. Browser console errors: none on `/en`.
- Next: F2 data contract, donation persistence and claims gate.

