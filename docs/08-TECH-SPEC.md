# 08 · TECH SPEC

> **Cập nhật V2 (30/10/2026):** một số phần của file này đã được thay bằng `docs/10-UPDATE-V2.md` (xem mục 0 của file đó). Khi khác nhau, làm theo docs/10.

## 1. Stack và lý do

| Lớp | Lựa chọn | Lý do |
|---|---|---|
| Framework | Next.js App Router, TypeScript strict | Nhiều trang cần SEO (render phía server), giỏ hàng có trạng thái, admin chung một codebase. SOP mặc định Vite cho site tĩnh; dự án thuộc nhóm "web app có trạng thái" |
| Style | Tailwind CSS qua npm, token bằng CSS variables (`src/styles/tokens.css`) | Đúng SOP production |
| Motion | gsap, gsap/ScrollTrigger, gsap/SplitText, @gsap/react; lenis (chỉ desktop) | Đủ cho 3 motif và chuỗi khung |
| Icon | lucide-react (ISC), strokeWidth 1.5 | Nét mảnh đồng bộ với bộ nhận diện; cây hóa (tree-shaking) theo từng icon |
| i18n | next-intl, pathnames riêng từng locale | Slug khác nhau giữa EN và VI |
| Dữ liệu, đăng nhập, lưu ảnh | Supabase (Postgres + RLS, Auth, Storage) | Admin tự xây kiểu Shopify mà không cần server riêng |
| Email giao dịch | Resend | Biên nhận đơn, hướng dẫn chuyển khoản, báo đơn mới cho admin |
| Phân tích | Vercel Web Analytics (không cookie) + bảng `page_events` cho phễu sản phẩm | Đủ tách người xem, người đặt, người đã trả tiền mà không cần banner cookie |
| Hosting | Vercel (preview cho mỗi nhánh) | Hợp Next.js |
| Kiểm thử | Vitest (logic), Playwright (e2e + 2 chế độ motion), @axe-core/playwright, Lighthouse CI | QT-44 |

Phiên bản: dùng bản ổn định mới nhất tại thời điểm khởi tạo, khóa trong `package-lock.json`. Node 20 LTS trở lên.

**Khởi tạo:** repo đã có sẵn tài liệu và tài sản, nên không chạy `create-next-app` vào thư mục này. Tạo `package.json`, `tsconfig.json`, `next.config.ts`, cấu hình Tailwind, ESLint, Prettier bằng tay, giữ nguyên `docs/`, `public/`, `src/content/`, `src/assets/`, `brand/`, `scripts/`. Script npm phải chạy trên Windows PowerShell.

## 2. Cấu trúc thư mục

```
refvlks/
├─ AGENTS.md                 luật cho Codex (sinh từ CLAUDE.md)
├─ CLAUDE.md
├─ CODEX_PROMPT.md
├─ brand/                    ảnh tham chiếu bộ nhận diện (không đưa lên web)
├─ docs/                      01 → 09 (nguồn sự thật)
├─ scripts/                   export-assets.py, assets_map.py, build-asset-manifest.py
├─ public/images/             home/ reveal/ products/{handle}/ lifestyle/ og/
├─ public/brand/              logo SVG, favicons/, pattern
├─ supabase/
│  ├─ migrations/             schema, RLS, function
│  └─ seed.sql                5 sản phẩm, biến thể, ảnh từ assets.json
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ (store)/          page.tsx, shop/, products/[handle]/, craft/, about/, studio/,
│  │  │  │                    help/{size-fit,shipping-returns,care-repair,faq}/, contact/, legal/*
│  │  │  └─ (checkout)/       cart/, checkout/, checkout/card/, order/[token]/
│  │  ├─ admin/               login/, (dashboard)/ ... (giai đoạn CMS)
│  │  ├─ api/                 events/, revalidate/
│  │  ├─ sitemap.ts · robots.ts · not-found.tsx · opengraph-image
│  ├─ components/             layout/ ui/ product/ cart/ checkout/ forms/ claim/ admin/
│  ├─ content/
│  │  ├─ assets.json          sinh từ scripts (không sửa tay)
│  │  ├─ products.seed.json   5 mẫu: giá, mô tả EN/VI, chất liệu, ảnh theo vai trò
│  │  ├─ site.ts              thương hiệu, studio, liên hệ, pháp nhân (02 mục 1–3)
│  │  ├─ claims.ts            CL-xx và trạng thái (02 mục 6)
│  │  └─ policy.ts            con số chính sách (02 mục 8)
│  ├─ messages/               en.json, vi.json (04 mục 13)
│  ├─ i18n/                   routing.ts (pathnames), request.ts
│  ├─ assets/fonts/           font cho next/og
│  ├─ lib/                    data/ (interface + adapter local, supabase), supabase/, money.ts, vietqr.ts, address/, orders/, rate-limit.ts, email/
│  ├─ motion/                 07 mục 3
│  └─ styles/                 tokens.css, globals.css
└─ tests/                     unit/, e2e/, visual/
```

## 3. Mô hình dữ liệu

**Hai adapter, một interface** (`src/lib/data/`): `DATA_SOURCE=local` (mặc định khi thiếu biến Supabase) đọc `src/content/products.seed.json` (sinh từ `assets.json` + 02 mục 4, 5) và ghi đơn hàng, lịch hẹn, tin nhắn vào thư mục `.data/` (đã gitignore) khi chạy dev; trên môi trường production thiếu Supabase thì form trả lỗi rõ ràng thay vì mất dữ liệu. `DATA_SOURCE=supabase` dùng các bảng dưới đây. Mọi component chỉ gọi interface (`getProducts`, `getProduct`, `placeOrder`, `createVisit`, `createMessage`…), không gọi Supabase trực tiếp.

### Bảng Supabase

| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `products` | id, handle (unique), tier (`essential`/`signature`/`heritage`), status (`draft`/`active`/`hidden`), name_en/vi, short_en/vi, long_en/vi, specs jsonb (size_cm, weight_g, laptop_in, compartments, closure, handle_drop_cm, load_kg), materials jsonb (mảng `{part, en, vi, group: new|recovered|hardware}` theo 02 mục 5, basis = `textile_weight`, made_in), woven jsonb (parts, artisan_group, place, technique, confirmed bool), seo jsonb, sort | Trường null → UI ẩn. Lưới sản phẩm render theo `product_variants` (5 thẻ) |
| `product_variants` | id, product_id, colour_key, colour_en/vi, swatch_hex, sku, price_vnd int, stock int, status | SP02 có 2 biến thể; còn lại 1 |
| `product_images` | id, product_id, variant_id (null = mọi màu), role (`front`,`three_quarter`,`inside`,`open`,`model`,`lifestyle`,`detail`,`hand`), src_avif, src_webp, card_avif, card_webp, width, height, alt_en, alt_vi, sort | Seed từ assets.json; CMS tải lên Storage |
| `orders` | id uuid, number (RV1001…), token (ngẫu nhiên 32 byte), status, payment_method (`cod`/`transfer`), channel (`web`/`studio`), delivery (`ship`/`pickup`), customer_name, phone, email, address jsonb, subtotal, shipping_fee, total, transfer_reference, customer_marked_paid_at, paid_at, confirmed_at, shipped_at, delivered_at, cancelled_at, cancel_reason, note, locale, ip_hash, created_at | Tiền lưu số nguyên VND |
| `order_items` | order_id, variant_id, name_snapshot, colour_snapshot, unit_price, qty | Giữ giá tại thời điểm mua |
| `order_events` | order_id, from_status, to_status, staff_id, note, at | Lịch sử cho admin |
| `studio_visits` | id, name, phone, email, visit_date, visit_time, bags text[], language, note, status (`requested`,`confirmed`,`rescheduled`,`cancelled`,`attended`,`no_show`), created_at | Ràng buộc unique (visit_date, visit_time) cho lịch đã xác nhận |
| `messages` | id, name, contact, topic, order_number, body, status (`new`,`handled`), created_at | Form Contact |
| `page_events` | day, path, product_id, locale, views | Đếm gộp, không định danh |
| `staff` | user_id, role (`owner`/`staff`) | |
| `settings`, `claims` | key/value | Giai đoạn CMS chuyển `policy.ts` và `claims.ts` vào đây |

**RLS:** khách ẩn danh chỉ đọc `products`, `product_variants`, `product_images` có status `active`; không đọc trực tiếp `orders`, `studio_visits`, `messages`. Mọi ghi từ website đi qua Server Action dùng service role trên server. Admin đọc/ghi theo vai trò trong `staff`; chỉ `owner` xem số điện thoại đầy đủ và sửa `claims`, `settings`.

## 4. Đặt hàng

**Tạo đơn (Server Action `placeOrder`)**
1. Kiểm tra dữ liệu bằng schema (zod): tên, điện thoại VN 10 số, địa chỉ 2 cấp, phương thức, đồng ý điều khoản.
2. Chống spam và đơn ảo: trường bẫy bot; giới hạn 5 đơn/giờ mỗi IP (băm); tối đa 2 đơn COD đang mở mỗi số điện thoại; COD tối đa 2 sản phẩm.
3. Trong một transaction (Postgres function `create_order`): đọc giá hiện tại từ DB (không tin giá từ client), trừ tồn kho có điều kiện `stock >= qty`, tạo `orders` + `order_items`, sinh `number` và `token`.
4. Gửi email (Resend) cho khách nếu có email và cho admin; lỗi email không làm hỏng đơn.
5. Chuyển tới `/order/{token}`.

**Trạng thái**
```
transfer: pending_payment ──(admin thấy tiền)──▶ confirmed ─▶ packed ─▶ shipped ─▶ delivered
cod:      pending_confirmation ──(gọi xác nhận)──▶ confirmed ─▶ packed ─▶ shipped ─▶ delivered
mọi trạng thái trước shipped ─▶ cancelled (hoàn tồn kho)      delivered ─▶ returned
```
Tự hủy: `pending_payment` sau 24 giờ; `pending_confirmation` sau 24 giờ không liên lạc được (admin bấm, hoặc cron Vercel mỗi giờ chỉ xử lý `pending_payment`).

**Doanh thu** = tổng `total` của đơn có `paid_at` (chuyển khoản được ghi nhận, hoặc COD khi chuyển `delivered`).

## 5. Thanh toán

| Phương thức | Cách làm |
|---|---|
| COD | Không thu gì online. Trang xác nhận nhắc kiểm hàng |
| Chuyển khoản | Hiển thị ngân hàng Techcombank, người thụ hưởng `NGUYEN TUNG ANH (Refvlks)`, số tài khoản `19070671343017`, số tiền, nội dung `RV{number}`, nút Copy. **Mã VietQR** sinh tại server theo chuẩn EMVCo (`src/lib/vietqr.ts`: BIN `970407` + số tài khoản + số tiền + nội dung, CRC16) và vẽ thành SVG; không gọi dịch vụ ngoài. Unit test so payload với một mã mẫu quét được bằng app Techcombank |
| Thẻ | Trang xem trước: các ô `disabled`, không có `name`, không nằm trong `<form>`, không có handler gửi dữ liệu; thẻ phương thức ở checkout có `aria-disabled` |
| Đối soát | MVP thủ công: admin so tiền về với `transfer_reference` rồi bấm "Mark as paid". P2: webhook từ dịch vụ đối soát ngân hàng |

## 6. i18n

- `src/i18n/routing.ts`: `locales: ['en','vi']`, `defaultLocale: 'en'`, `localePrefix: 'always'`, `pathnames` theo bảng URL ở 05 mục 2.
- Cập nhật `<html lang>` theo locale. Lưu lựa chọn ngôn ngữ bằng cookie `NEXT_LOCALE` (cookie cần thiết).
- Số tiền: `Intl.NumberFormat('vi-VN')` + " ₫" ở cả hai locale. Ngày: theo locale.
- Không ghép chuỗi câu; dùng ICU message có tham số (`{name}`, `{n}`).

## 7. Claims gate

- `src/content/claims.ts` export `CLAIMS: Record<ClaimId, 'approved' | 'pending'>`, khởi tạo theo 02 mục 6.
- Component `<Claim id="CL-04">…</Claim>` trả về null nếu pending; prop `fallback` cho câu thay thế.
- Section có điều kiện (H-06, CR-03, CR-04, AB-04) kiểm tra claim ở server component, không render HTML nào khi ẩn.
- Test e2e: duyệt mọi trang ở cả 2 locale, khẳng định HTML không chứa `[CẦN`, `[x]`, `{group}`, `TODO`.

## 8. Ảnh

- Ảnh tĩnh (seed) đã encode sẵn AVIF + WebP: component `<ResponsivePicture asset="SP01-01" variant="card" sizes="…">` render `<picture>` với 2 `<source>` và `<img>` có width, height, alt theo locale, `loading="lazy"` trừ khi `priority`.
- Ảnh tải lên qua CMS: Supabase Storage + `next/image` với loader Supabase (resize theo `sizes`).
- Chỉ preload ảnh hero (HOME-01 desktop / HOME-02 mobile qua `media`). Chuỗi REVEAL tải muộn.
- Thêm ảnh mới: thêm dòng vào `scripts/assets_map.py`, chạy `python3 scripts/export-assets.py <thư mục nguồn> .` rồi `python3 scripts/build-asset-manifest.py`.

## 9. SEO

- `generateMetadata` mỗi trang, title và description từ `messages` (`seo.{page}`), canonical, `alternates.languages` (en, vi, x-default).
- JSON-LD: `Organization` (toàn site); `Store` / `LocalBusiness` cho trang Studio (địa chỉ, `openingHours: Mo-Su 08:00-21:30`); `Product` + `Offer` (giá VND, availability) cho trang sản phẩm; `FAQPage` cho FAQ; `BreadcrumbList`.
- `sitemap.ts` liệt kê mọi trang index được ở 2 locale; `robots.ts` như 05 mục 1. Trang 404 trả mã 404.
- `og:image`: sinh bằng `next/og` (`opengraph-image.tsx`) với font trong `src/assets/fonts/`: nền Bone, wordmark SVG, tagline, ảnh sản phẩm. File tĩnh OG-01 là phương án dự phòng.
- Favicon và icon: copy từ `public/brand/favicons/` sang `src/app/` theo quy ước Next.js (`favicon.ico`, `icon.svg`, `apple-icon.png`) và khai báo `manifest.webmanifest` (tên Refvlks, `theme_color` #4A2E1F, `background_color` #F4EFE6, icon 192, 512, maskable).

## 10. Form

| Form | Lưu ở | Thông báo | Chống spam |
|---|---|---|---|
| Studio visit | `studio_visits` | Email admin (Resend) | Bẫy bot, 3 yêu cầu/giờ mỗi IP |
| Contact | `messages` | Email admin | Bẫy bot, 5 tin/giờ mỗi IP |
| Checkout | `orders` | Email khách + admin | Mục 4 |

Mọi form: label hiển thị, lỗi dưới từng ô với `aria-describedby`, tổng hợp lỗi đầu form với `role="alert"`, nút giữ chiều rộng khi đang gửi, hoạt động khi tắt JS (Server Action + form POST).

## 11. Biến môi trường (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFY_EMAIL=
EMAIL_FROM=
BANK_BIN=970407
BANK_NAME=Techcombank
BANK_ACCOUNT_NO=19070671343017
BANK_ACCOUNT_NAME=NGUYEN TUNG ANH
IP_HASH_SALT=
DATA_SOURCE=local        # local | supabase
```

## 12. Kế hoạch thi công (vertical slices)

Mỗi slice: một nhánh, một commit sau khi qua lint, typecheck, test, build và acceptance của slice (09).

**Frontend**

| Slice | Phạm vi | Kiểm tra chính |
|---|---|---|
| F1 Foundation | Khởi tạo Next.js (không dùng create-next-app), Tailwind, tokens, fonts, next-intl + pathnames, layout shell, logo SVG, favicon + manifest, `site.ts`, `claims.ts`, `policy.ts`, `<ResponsivePicture>`, `<Claim>` | `/en` và `/vi` chạy; đổi locale giữ đúng trang; không tràn ngang ở 360; favicon hiển thị |
| F2 Data | Interface dữ liệu, adapter local (`products.seed.json`, ghi `.data/`), adapter Supabase (schema, RLS, `create_order`, `supabase/seed.sql`) | Chạy được không cần khóa; seed chạy lại được; ẩn danh không đọc được `orders` |
| F3 Header, footer, Home H-01 + H-03 | Navigation desktop/mobile, hero, lưới sản phẩm | LCP < 2.5s; menu có focus trap |
| F4 Product + giỏ hàng | Toàn bộ P-01 → P-08, đổi màu SP02, cart store + drawer + trang `/cart` | Thêm vào giỏ khi tắt JS vẫn chạy qua `/cart` |
| F5 Motion system + Home còn lại | MotionProvider, 3 motif, H-02 Reveal, H-04 → H-08 | Motion QA 07 mục 10 ở 2 chế độ |
| F6 Shop | Lưới, lọc, sắp xếp, bảng tầng | Lọc bằng form GET khi tắt JS |
| F7 Checkout | Checkout, card preview, `placeOrder`, trang xác nhận, VietQR, email | Đặt được đơn COD và chuyển khoản trên preview; tồn kho trừ đúng |
| F8 Studio + Contact | Form đặt lịch, form liên hệ, lưu DB, email admin | Khung giờ trùng bị chặn |
| F9 Trang nội dung | Craft, About, Help (4 trang), Legal (4 trang), 404 | Không còn placeholder; claim pending bị ẩn |
| F10 SEO + analytics | Metadata, JSON-LD, sitemap, robots, OG, Vercel Analytics, `page_events` | Rich Results Test không lỗi |
| F11 QA tổng | Ma trận 09 mục 4, sửa lỗi, Lighthouse | Báo cáo `docs/QA-REPORT.md` |

**CMS (sau frontend)**

| Slice | Phạm vi |
|---|---|
| C1 | Đăng nhập, layout admin, phân quyền owner/staff |
| C2 | Đơn hàng: danh sách, chi tiết, đổi trạng thái, mark as paid, tạo đơn tại studio, in phiếu giao |
| C3 | Sản phẩm, biến thể, tồn kho, ảnh (tải lên, sắp xếp, vai trò, alt EN/VI) |
| C4 | Dashboard và Analytics (doanh thu, phễu, bán chạy) |
| C5 | Lịch hẹn studio và tin nhắn |
| C6 | Settings: cửa hàng, thanh toán, giao hàng, claims, nhân viên (chuyển `policy.ts` và `claims.ts` vào DB) |

## 13. Rủi ro kỹ thuật

| Rủi ro | Giảm thiểu |
|---|---|
| Đơn COD ảo | Mục 4 bước 2; gọi xác nhận trước khi gửi |
| Bán quá tồn kho | Trừ kho trong transaction có điều kiện |
| Khách chuyển sai nội dung | Nội dung ngắn `RV1024`, nút Copy, QR điền sẵn; admin tìm đơn theo số tiền |
| H-02 nặng trên máy yếu | Tải muộn, chỉ 2 khung hiển thị cùng lúc, fallback 3 thẻ |
| Dịch vụ ngoài lỗi (email) | Không chặn đặt hàng; ghi log lỗi |
| Ảnh AI khác sản phẩm thật | Quy trình đổi ảnh qua CMS; điều khoản C.4 |
