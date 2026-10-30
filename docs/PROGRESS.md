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

## F2 · Data and claims retrofit

- Added the approved-claim gate, updated five-variant product seed with material hotspots and null fields for unconfirmed specifications, and a null-safe Donation Event seed. The owner approved seed prices, stock and ordering in the current task.
- Added a shared store repository with D1, local file and optional Supabase adapters. Local orders reserve stock in an atomic file update; D1 retains the order-item stock trigger. Supabase has schema, row-level security, a transactional `create_order` RPC and a repeatable seed generator. No Supabase credentials were provided, so that adapter and migration have not been run against a remote instance.
- Added D1 and Supabase donation tables and local/D1/Supabase signup persistence. Donation consent and three signups per hour per IP are enforced in the form route/adapters. The local adapter serializes rate checks and appends.
- Format: `npx prettier --write` for changed source — pass. `npm run lint` — pass. `npm run typecheck` — pass. `npm run test` — 8 passed. `npm run build` — pass.
- Local HTTP checks on built Worker: valid order redirected to order page and reduced `RV-SP03-BLK` stock from 10 to 9; an overstock order redirected with `error=stock`; studio and contact forms redirected with success. Donation form checks from this slice: missing recycling consent rejected; three valid signups saved and fourth rate limited.
- Open decisions/data remain hidden: Donation Event date, collection window, destination and impact; pending claims CL-19, CL-20, CL-22 and CL-23. The Supabase adapter is optional and unverified against a hosted database.
- Next: F3 shell, Home H-01 and H-03.

## F3 · Shell and Home introduction/collection

- Updated shared navigation and footer links with accessible rolling text, localized controls and the curtain-style sticky footer. The Home hero now uses the exact V2 EN/VI text, responsive reference imagery and a Weft pattern layer. The collection has five variant cards, tier chips, staggered desktop layout, hover image reveals and pointer tilt.
- Added scoped GSAP matchMedia motion for the hero and cards: desktop parallax/tilt, touch parallax only, reduced motion off. Moved plugin registration into the browser effect after a production SSR check exposed a server error; the built Worker now serves `/en` successfully.
- Format — pass. `npm run lint` — pass. `npm run typecheck` — pass. `npm run test` — 8 passed. `npm run build` — pass. `npm run test:e2e -- home-shell.spec.ts` — 11 passed at 360/390/768/1024/1440 in normal and reduced motion, including no overflow, no console errors, no hidden sections and no serious/critical axe violations. Screenshots: `test-results/screens/F3/`.
- The remaining legacy Home sections stay in place until H-02 (F5) and H-04/H-05 (F6) replace them. The final five-section count belongs to F6.
- Next: F4 product detail, hotspots and cart interaction.

## F4 · Product detail and cart

- Reworked the product template into exactly P-01 gallery/buy, P-02 inside/materials and P-03 before-you-buy. The gallery has image indices; the buy box retains colour, stock and studio actions. P-02 has accessible, keyboard-operable hotspots from the seed, a material profile and the approved 70/30 share. Unconfirmed specifications stay hidden. P-03 has five native accordions and four related cards.
- Added the 0.7s Flip image-to-bag transition on add; reduced motion submits immediately. Cart now has localized add success, plus/minus quantity and remove controls, and its API caps quantities at live D1 inventory. Corrected two image alt descriptions that made an unapproved hand-weaving claim.
- Format — pass. `npm run lint` — pass. `npm run typecheck` — pass. `npm run test` — 8 passed. `npm run build` — pass. `npm run test:e2e -- product-cart.spec.ts` — 13 passed at 360/390/768/1024/1440 in normal and reduced motion, including no overflow, hidden sections or console errors, hotspot and cart interaction, and no serious/critical axe violations. Screenshots: `test-results/screens/F4/`.
- Applied the React component review checklist to the new client code. The heavier Flip module loads only after an add action.
- Next: F5 motion core and Home H-02 Reveal.

## F5 · Motion core and Home Reveal

- Added first-visit preloader, page curtain, product card to gallery View Transition, desktop Lenis with scroll progress, heading SplitText, magnetic primary buttons and a contextual desktop cursor. Motion runs in full, touch/light and reduced/off tiers. The original logo SVG remains the only wordmark.
- Replaced the legacy Home reveal with the V2 H-02 story and exact EN/VI copy. Desktop loads eight frames when the section approaches, then pins and scrubs through them over 200% scroll; touch, reduced motion and no JavaScript show three static cards. A skip link lands on the collection. The frame loader leaves the readable cards visible if an image fails.
- A production browser check exposed an RSC prefetch error from Vinext with `next-view-transitions`; disabled prefetch on the product card link. The subsequent card-to-product and back navigation check has no browser errors.
- `npm run lint` — pass. `npm run typecheck` — pass. `npm run test` — 8 passed. `npm run build` — pass. `npm run test:e2e` — 49 passed, including F5 at 360/390/768/1024/1440 pixels in normal and reduced motion, no-JavaScript content and navigation, keyboard travel through the pin, View Transition navigation, and axe serious/critical checks. Screenshots: `test-results/screens/F5/`.
- Next: F6 Home H-04 and H-05.

