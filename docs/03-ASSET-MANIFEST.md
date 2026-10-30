# 03 · ASSET MANIFEST

File này được sinh tự động từ `src/content/assets.json` bằng `python3 scripts/build-asset-manifest.py`. Không sửa tay bảng ảnh.

Tổng: **37 ảnh nguồn** → **47 biến thể** (mỗi biến thể có AVIF + WebP; ảnh OG là JPG). Nguồn: `refvlks_tat-ca-anh-san-pham-va-mau.zip` do chủ dự án cung cấp. Toàn bộ ảnh do AI tạo (origin = AI-generated).

## 1. Quy ước

- Tên file: `refvlks_[section]_[số thứ tự]_[mô tả]`, chữ thường, không dấu. Ảnh sản phẩm đánh số theo thứ tự gallery trong từng sản phẩm.
- Biến thể `-card` là bản cắt 4:5, 800×1000, dùng cho thẻ sản phẩm (ngân sách 60KB AVIF). Bản `full` giữ tỷ lệ gốc, dùng cho gallery và lightbox.
- Ảnh sản phẩm ở `public/images` là dữ liệu khởi tạo (seed). Khi CMS chạy, ảnh sản phẩm mới tải lên Supabase Storage theo cùng quy ước tên.
- Mọi `<img>`/`<Image>` lấy `alt` từ `alt.en` hoặc `alt.vi` theo locale; không viết alt trong component.
- Alt text không dùng từ "leather": không bộ phận nào làm bằng da (xem 02-CONTENT-SOURCE mục 5).

## 2. Bảng ảnh

| ID | Sản phẩm | Vai trò | Section | Biến thể (kích thước · AVIF/WebP KB) | File (không đuôi) | Alt (EN) |
|---|---|---|---|---|---|---|
| HOME-01 | SP01 | Hero desktop (L0, parallax 5%) | H-01 | full 1536×1024 · 176/173 | `/images/home/refvlks_home_01_hero-weft-structured-tote` | Weft Structured Tote on a travertine block beside a sunlit window, flap closed. |
| HOME-02 | SP01 | Hero mobile (crop 4:5 bằng CSS) | H-01 | full 1024×1536 · 116/153 | `/images/home/refvlks_home_02_hero-weft-structured-tote-mobile` | Weft Structured Tote on a travertine block in soft window light. |
| REVEAL-01 | SP01 | Khung 1/8 chuỗi H-02 | H-02, H-02 mobile | full 1536×1024 · 89/120 | `/images/reveal/refvlks_reveal_01_closed` | Weft Structured Tote with its flap closed and buckle fastened. |
| REVEAL-02 | SP01 | Khung 2/8 chuỗi H-02 | H-02 | full 1536×1024 · 89/120 | `/images/reveal/refvlks_reveal_02_buckle-released` | The buckle strap of the tote is released. |
| REVEAL-03 | SP01 | Khung 3/8 chuỗi H-02 | H-02 | full 1536×1024 · 89/120 | `/images/reveal/refvlks_reveal_03_strap-loose` | The loose buckle strap hangs down the flap. |
| REVEAL-04 | SP01 | Khung 4/8 chuỗi H-02 | H-02 | full 1536×1024 · 86/119 | `/images/reveal/refvlks_reveal_04_flap-lifting` | The flap lifts and the edge of the woven lining appears. |
| REVEAL-05 | SP01 | Khung 5/8 chuỗi H-02 | H-02, H-02 mobile | full 1536×1024 · 88/115 | `/images/reveal/refvlks_reveal_05_flap-open` | The flap is open and the top of the woven lining shows. |
| REVEAL-06 | SP01 | Khung 6/8 chuỗi H-02 | H-02 | full 1536×1024 · 84/117 | `/images/reveal/refvlks_reveal_06_lining-visible` | More of the blue and ochre woven lining is visible. |
| REVEAL-07 | SP01 | Khung 7/8 chuỗi H-02 | H-02 | full 1536×1024 · 88/118 | `/images/reveal/refvlks_reveal_07_lining-wide` | The opening is spread to show the woven lining. |
| REVEAL-08 | SP01 | Khung 8/8 chuỗi H-02 | H-02, H-02 mobile | full 1536×1024 · 87/117 | `/images/reveal/refvlks_reveal_08_lining-lit` | Soft light falls on the hand-woven lining inside the open tote. |
| SP01-01 | SP01 | Ảnh thẻ + ảnh 1 gallery | H-03, S-03, P-01 | full 1024×1536 · 149/198<br>card 800×1000 · 59/79 | `/images/products/weft-structured-tote/refvlks_product_01_weft-structured-tote-front` | Weft Structured Tote, front view, flap closed, on a plain sand background. |
| SP01-02 | SP01 | Gallery ảnh 2 (góc 3/4) | P-01 | full 1024×1536 · 148/149 | `/images/products/weft-structured-tote/refvlks_product_02_weft-structured-tote-three-quarter` | Weft Structured Tote seen from a three-quarter angle, showing its side gusset. |
| SP01-03 | SP01 | Ảnh hover thẻ + gallery ảnh 3 | H-03 hover, P-01 | full 1024×1536 · 148/195<br>card 800×1000 · 56/80 | `/images/products/weft-structured-tote/refvlks_product_03_weft-structured-tote-inside` | Weft Structured Tote with the flap folded back, showing the hand-woven lining. |
| SP01-04 | SP01 | Gallery ảnh 4 (người mẫu) | P-01 | full 1024×1536 · 147/119 | `/images/products/weft-structured-tote/refvlks_product_04_weft-structured-tote-model-half` | A man in a linen blazer holds the Weft Structured Tote at his side in a bright lobby. |
| SP01-05 | SP01 | Gallery ảnh 5 (chi tiết) + H-05 | P-01, H-05, CR-02 | full 1254×1254 · 144/201 | `/images/products/weft-structured-tote/refvlks_product_05_weft-structured-tote-detail-buckle` | Close-up of the buckle on the dark brown flap above the diamond weave. |
| SP01-06 | SP01 | Gallery ảnh 6 (tay cầm) + H-04 | P-01, H-04 | full 1254×1254 · 142/196 | `/images/products/weft-structured-tote/refvlks_product_06_weft-structured-tote-hand` | A hand holds both handles of the Weft Structured Tote. |
| SP01-07 | SP01 | P-04 Open it + H-06 (tạm thay ảnh nghệ nhân) | P-04, H-06, CR-03 | full 1024×1536 · 148/186 | `/images/products/weft-structured-tote/refvlks_product_07_weft-structured-tote-open` | The open Weft Structured Tote showing its blue, ochre and cream woven lining. |
| SP01-08 | SP01 | Dự phòng (Size & fit) | SF-03 | full 1024×1536 · 145/164 | `/images/products/weft-structured-tote/refvlks_product_08_weft-structured-tote-front-alt` | Weft Structured Tote, front view on a plain background. |
| SP02F-01 | SP02 | Ảnh thẻ + gallery (Forest) | H-03, S-03, P-01 | full 1024×1536 · 144/155<br>card 800×1000 · 58/77 | `/images/products/loom-flap-tote/refvlks_product_01_loom-flap-tote-forest-front` | Loom Flap Tote in forest green with a cream woven band near the base, front view. |
| SP02F-02 | SP02 | Gallery (Forest) + hover thẻ | H-03 hover, P-01 | full 1024×1536 · 148/192<br>card 800×1000 · 58/79 | `/images/products/loom-flap-tote/refvlks_product_02_loom-flap-tote-forest-model-cafe` | A woman seated in a café holds the forest green Loom Flap Tote on her lap. |
| SP02F-03 | SP02 | Gallery (Forest) | P-01 | full 1024×1536 · 149/200 | `/images/products/loom-flap-tote/refvlks_product_03_loom-flap-tote-forest-model-office` | A man in a beige coat holds the forest green Loom Flap Tote by its handles. |
| SP02W-01 | SP02 | Ảnh thẻ + gallery (Wine) | H-03, S-03, P-01 | full 1024×1536 · 132/96<br>card 800×1000 · 58/60 | `/images/products/loom-flap-tote/refvlks_product_04_loom-flap-tote-wine-front` | Loom Flap Tote in deep wine with a tone-on-tone woven band, front view. |
| SP02W-02 | SP02 | Gallery (Wine) + H-04 | H-03 hover, P-01, H-04 | full 1024×1536 · 147/120<br>card 800×1000 · 58/70 | `/images/products/loom-flap-tote/refvlks_product_05_loom-flap-tote-wine-model-office` | A man in a grey suit holds the wine Loom Flap Tote in an office lounge. |
| SP03-01 | SP03 | Ảnh thẻ + gallery | H-03, S-03, P-01 | full 1024×1536 · 149/175<br>card 800×1000 · 59/78 | `/images/products/loom-carryall/refvlks_product_01_loom-carryall-front` | Loom Carryall in black with a cinnabar flap, a triangular woven panel and scarf-wrapped handles. |
| SP03-02 | SP03 | Gallery + hover thẻ | H-03 hover, P-01 | full 1024×1536 · 142/112<br>card 800×1000 · 59/67 | `/images/products/loom-carryall/refvlks_product_02_loom-carryall-model-half` | A man in a dark suit holds the Loom Carryall in front of him with both hands. |
| SP03-03 | SP03 | Gallery | P-01 | full 1024×1536 · 148/184 | `/images/products/loom-carryall/refvlks_product_03_loom-carryall-model-arcade` | A man in a navy blazer carries the Loom Carryall under a stone arcade. |
| SP04-01 | SP04 | Ảnh thẻ + gallery | H-03, S-03, P-01 | full 1024×1536 · 146/184<br>card 800×1000 · 58/77 | `/images/products/tram-shopper/refvlks_product_01_tram-shopper-front` | Trám Shopper in cream with an all-over brown diamond motif and two vertical straps, front view. |
| SP04-02 | SP04 | Gallery + hover thẻ | H-03 hover, P-01 | full 1024×1536 · 148/184<br>card 800×1000 · 58/78 | `/images/products/tram-shopper/refvlks_product_02_tram-shopper-model-colonnade` | A man in a brown jacket holds the Trám Shopper beside stone columns. |
| LIFE-01 | SP01 | Gallery SP01 + AB-01 | P-01, AB-01 | full 1024×1536 · 138/180 | `/images/lifestyle/refvlks_lifestyle_01_weft-structured-tote-street` | A man in a linen suit walks past yellow colonial facades carrying the Weft Structured Tote. |
| LIFE-02 | SP02 | Gallery SP02 Forest | P-01 | full 1024×1536 · 138/182 | `/images/lifestyle/refvlks_lifestyle_02_loom-flap-tote-forest-street` | A woman walks along a tree-lined Hanoi street with the forest green Loom Flap Tote on her arm. |
| LIFE-03 | SP02 | Gallery SP02 Forest | P-01 | full 1024×1536 · 137/182 | `/images/lifestyle/refvlks_lifestyle_03_loom-flap-tote-forest-courtyard` | A man in an ecru overshirt holds the forest green Loom Flap Tote in a leafy courtyard. |
| LIFE-04 | SP02 | Gallery SP02 Wine | P-01 | full 1024×1536 · 136/187 | `/images/lifestyle/refvlks_lifestyle_04_loom-flap-tote-wine-street` | A man leans against a sunlit ochre wall holding the wine Loom Flap Tote. |
| LIFE-05 | SP03 | Gallery SP03 + H-04 | P-01, H-04 | full 1024×1536 · 136/171 | `/images/lifestyle/refvlks_lifestyle_05_loom-carryall-bookshop` | A man in a dark suit holds the Loom Carryall in a bookshop. |
| LIFE-06 | SP03 | Gallery SP03 | P-01 | full 1024×1536 · 134/136 | `/images/lifestyle/refvlks_lifestyle_06_loom-carryall-campus` | A man in a dark suit walks down stone steps carrying the Loom Carryall. |
| LIFE-07 | SP03 | Gallery SP03 | P-01 | full 1024×1536 · 136/188 | `/images/lifestyle/refvlks_lifestyle_07_loom-carryall-boulevard` | A man crosses a tree-lined boulevard carrying the Loom Carryall. |
| LIFE-08 | SP04 | Gallery SP04 | P-01 | full 1024×1536 · 134/183 | `/images/lifestyle/refvlks_lifestyle_08_tram-shopper-park` | A woman in a white dress walks through a park with the Trám Shopper on her shoulder. |
| OG-01 | SP01 | Ảnh chia sẻ mạng xã hội 1200×630 | SEO | og 1200×630 · 129 | `/images/og/refvlks_og_01_default` | Weft Structured Tote on a travertine block beside a sunlit window. |

Alt tiếng Việt nằm trong `assets.json` (`alt.vi`).

## 3. Ghi chú sử dụng

| Ảnh | Ghi chú |
|---|---|
| HOME-01 | Hero desktop. Nguồn 3:2, hiển thị 16:9 bằng `object-fit: cover; object-position: 60% 55%` để giữ túi và bóng đổ. Là ảnh LCP: `priority`, `fetchPriority="high"`. |
| HOME-02 | Hero mobile. Nguồn 2:3, hiển thị 4:5 bằng `object-position: 50% 60%`. |
| REVEAL-01→08 | Đã kiểm: 8 khung trùng khít tuyệt đối (lệch 0 px, nền và bệ đá giống nhau từng điểm ảnh, chỉ vùng túi thay đổi). Mobile và reduced motion dùng REVEAL-01, 05, 08 cắt 4:5 quanh tâm (túi nằm ở 49% chiều ngang). |
| Ảnh `*-model-*-card` | Dùng làm ảnh hover trên thẻ khi sản phẩm không có ảnh bên trong túi. Túi nhỏ trong khung, nên chỉ là ảnh phụ; ảnh chính của thẻ luôn là ảnh mặt trước. |
| Màu nền ảnh sản phẩm | SP01 nền #E8DFD0 (trùng token `--sand`). SP02, SP03, SP04 nền khoảng #E3D5C3, đậm hơn một chút. Thẻ hiển thị ảnh tràn khung nên không lộ đường nối. Muốn đồng nhất tuyệt đối thì chỉnh nền ở hậu kỳ. |
| SP01-08 | Ảnh dự phòng, gần giống SP01-01. Dùng cho Size & fit hoặc để trống. |
| OG-01 | 1200×630 JPG, dùng làm `og:image` mặc định mọi trang. Trang sản phẩm dùng ảnh mặt trước của sản phẩm (sinh bằng `next/og` hoặc dùng bản full). |
| Độ phân giải | Ảnh nguồn tối đa 1536 px. Đủ cho màn hình thường; trên màn hình retina rộng, hero và chuỗi khung hơi mềm. Có thể upscale 2× sau này mà không đổi tên file. |

## 4. Gallery theo sản phẩm (thứ tự hiển thị)

- **SP01:** SP01-01 → SP01-02 → SP01-03 → SP01-04 → SP01-05 → SP01-06 → SP01-07 → SP01-08 → LIFE-01
- **SP02:** SP02F-01 → SP02F-02 → SP02F-03 → SP02W-01 → SP02W-02 → LIFE-02 → LIFE-03 → LIFE-04
- **SP03:** SP03-01 → SP03-02 → SP03-03 → LIFE-05 → LIFE-06 → LIFE-07
- **SP04:** SP04-01 → SP04-02 → LIFE-08

Với SP02, gallery lọc theo màu đang chọn: Forest dùng SP02F-*, LIFE-02, LIFE-03; Wine dùng SP02W-*, LIFE-04.

## 5. Section chưa có ảnh (xử lý thay thế)

| Section | Ảnh dự kiến | Cách xử lý ở MVP |
|---|---|---|
| H-06 The hands behind it | Ảnh nghệ nhân (ảnh thật) | Dùng SP01-07 (lớp lót). Toàn bộ section ẩn cho đến khi CL-04 approved |
| H-08 / Studio | Ảnh studio (ảnh thật) | Không dùng ảnh thay thế, vì ảnh phố trong bộ ảnh không phải studio. Hiển thị khối địa chỉ, giờ mở cửa và nút mở Google Maps |
| CR-04 Weavers | Ảnh nghệ nhân | Ẩn đến khi có dữ liệu |
| AB-04 Team | Ảnh đội ngũ | Ẩn (feature flag `showTeam = false`) |
| H-05 / CR-02 Materials | Flat lay vật liệu | Dùng SP01-05 (cận khóa, nắp và vải thân) |
| P-04 Open it (SP02, SP03, SP04) | Ảnh bên trong túi | Section chỉ hiện khi sản phẩm có ảnh vai trò `inside` |

## 6. Tài sản thương hiệu

Chi tiết cách dùng: 06-DESIGN-SYSTEM mục 6.

| Thư mục | File |
|---|---|
| `public/brand/` | `refvlks_logo_monogram_bone.svg`, `refvlks_logo_monogram_cocoa.svg`, `refvlks_logo_wordmark_one-colour-ink.svg`, `refvlks_logo_wordmark_primary.svg`, `refvlks_logo_wordmark_primary_on-bone.svg`, `refvlks_logo_wordmark_reversed_on-cocoa.svg`, `refvlks_pattern_weft.svg` |
| `public/brand/favicons/` | `apple-touch-icon.png`, `favicon.ico`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `icon.svg` |
| `brand/` | `REF_BRAND_BOARD.webp` |
| `brand/identity/` | `refvlks_brand_A01_logo-exploration.webp`, `refvlks_brand_A02_logo-primary.webp`, `refvlks_brand_A03_logo-reversed.webp`, `refvlks_brand_A04_monogram.webp`, `refvlks_brand_A05_lockup-tagline.webp`, `refvlks_brand_A06_logo-usage.webp` |
| `src/assets/fonts/` | `BeVietnamPro-Regular.ttf`, `Fraunces-Display.ttf`, `IBMPlexMono-Medium.ttf`, `OFL-BeVietnamPro.txt`, `OFL-Fraunces.txt`, `OFL-IBMPlexMono.txt` |

