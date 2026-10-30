# 06 · DESIGN SYSTEM

Hướng thương hiệu: **Quiet Atelier** (phương án A), mượn từ phương án B nhãn hồ sơ bằng font mono và màu đỏ son làm điểm nhấn hiếm. Nguồn sự thật cho token trong code: `src/styles/tokens.css`. Mọi tỷ lệ tương phản dưới đây đã được tính theo công thức WCAG 2.x.

## 1. Màu

| Token | HEX | Vai trò | Tỷ lệ dùng |
|---|---|---|---|
| `--bg` | #F4EFE6 | Nền trang (Bone) | 60% (cùng surface, sand) |
| `--surface` | #FBF8F2 | Thẻ, form, ngăn kéo | |
| `--sand` | #E8DFD0 | Nền ảnh sản phẩm, skeleton, hàng tiêu đề bảng | |
| `--text` | #1F1712 | Chữ chính (Ink) | |
| `--muted` | #6B5A4C | Chữ phụ, metadata | |
| `--primary` | #4A2E1F | Nút chính, footer (Cocoa) | 30% (cùng text) |
| `--on-primary` | #FFFFFF | Chữ trên nút chính | |
| `--secondary` | #2F4A3A | Section xen kẽ, nhãn thông tin (Forest) | 10% (cùng accent) |
| `--accent` | #B3341F | Đường chỉ, trạng thái active, chữ "v" trong logo (Cinnabar) | ≤ 5% |
| `--border` | #D9CFC0 | Đường kẻ trang trí (không dùng cho viền ô nhập) | |
| `--border-strong` | #857565 | Viền ô nhập, checkbox, radio | |
| `--success` | #2F6B3E | Thông báo thành công | |
| `--warning` | #8A5A00 | Cảnh báo | |
| `--error` | #9B1C2C | Lỗi | |
| `--focus` | #B3341F | Vòng focus trên nền sáng | |
| `--focus-on-dark` | #F4EFE6 | Vòng focus trên nền Cocoa, Forest | |

**Tương phản đã kiểm**

| Cặp | Tỷ lệ | Mức |
|---|---|---|
| text / bg · surface · sand | 15,41 · 16,65 · 13,36 | AAA |
| muted / bg · surface · sand | 5,74 · 6,21 · 4,98 | AA |
| on-primary / primary | 12,34 | AAA |
| white / secondary | 9,72 | AAA |
| accent / bg | 5,35 | AA (chữ thường) |
| success · warning · error / bg | 5,57 · 5,18 · 7,06 | AA |
| border-strong / bg | 3,88 | Đạt 3:1 cho viền UI |
| border / bg | 1,34 | Chỉ trang trí |

Quy tắc: `--accent` và `--error` cùng tông đỏ, nên accent không bao giờ dùng cho chữ thông báo; lỗi luôn kèm icon và câu chữ. Trạng thái không bao giờ chỉ dựa vào màu.

**Nền ảnh sản phẩm:** ảnh SP01 có nền #E8DFD0 (trùng `--sand`); SP02, SP03, SP04 có nền khoảng #E3D5C3. Thẻ sản phẩm hiển thị ảnh tràn khung (`object-fit: cover`) nên không lộ chênh lệch.

## 2. Typography

Cả ba font đều là Google Fonts (OFL), đã kiểm có subset `vietnamese`. Tải qua `next/font/google` với `subsets: ['latin', 'vietnamese']`, `display: 'swap'`.

| Vai trò | Font | Fallback |
|---|---|---|
| Display | Fraunces (variable: opsz, wght, SOFT) | "Iowan Old Style", Georgia, serif |
| Body | Be Vietnam Pro (400, 500, 600) | system-ui, -apple-system, "Segoe UI", Roboto, sans-serif |
| Accent (nhãn hồ sơ) | IBM Plex Mono (400, 500) | ui-monospace, "SFMono-Regular", Menlo, monospace |

| Token | Font, weight | 360px | 1440px | `clamp()` | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| `--fs-display` (H1) | Fraunces 400, opsz 144 | 40 | 80 | `clamp(2.5rem, 1.65rem + 3.7vw, 5rem)` | 1.08 | -0.02em |
| `--fs-h2` | Fraunces 400 | 32 | 56 | `clamp(2rem, 1.5rem + 2.22vw, 3.5rem)` | 1.12 | -0.015em |
| `--fs-h3` | Fraunces 500 | 24 | 36 | `clamp(1.5rem, 1.25rem + 1.11vw, 2.25rem)` | 1.2 | -0.01em |
| `--fs-h4` | Be Vietnam Pro 600 | 20 | 24 | `clamp(1.25rem, 1.167rem + 0.37vw, 1.5rem)` | 1.3 | 0 |
| `--fs-body-lg` | Be Vietnam Pro 400 | 18 | 20 | `clamp(1.125rem, 1.083rem + 0.19vw, 1.25rem)` | 1.6 | 0 |
| `--fs-body` | Be Vietnam Pro 400 | 16 | 17 | `clamp(1rem, 0.979rem + 0.09vw, 1.0625rem)` | 1.65 | 0 |
| `--fs-ui` | Be Vietnam Pro 500 | 16 | 16 | cố định | 1.4 | 0 |
| `--fs-label` (nhãn mono) | IBM Plex Mono 500, chữ hoa | 14 | 14 | cố định | 1.4 | 0.08em |
| `--fs-caption` | Be Vietnam Pro 400 | 14 | 14 | cố định | 1.5 | 0.005em |

**Quy tắc cỡ chữ tối thiểu (sửa theo QT-16):** giá, nhãn form, chữ trợ giúp, thông báo lỗi, nội dung chính sách, nội dung bảng thông số ≥ 16px. Ô nhập ≥ 16px (tránh iOS tự phóng to). Cỡ 14px chỉ dùng cho nhãn mono trang trí, chú thích ảnh và metadata phụ, không bao giờ cho thông tin cần để mua hàng.

**Tiếng Việt:** line-height tiêu đề không thấp hơn 1.08; khung mask của hiệu ứng chữ có đệm `0.14em` trên dưới để không cắt dấu chồng (Ẩ, Ỗ, Ặ). Số tiền dùng `font-variant-numeric: tabular-nums`.

## 3. Khoảng cách, lưới, khung

| Token | Giá trị |
|---|---|
| `--space-1` … `--space-9` | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px |
| Section padding dọc | mobile `--space-8` (64), desktop `--space-9` (96) đến 128 |
| Container nội dung | max 1280px; ảnh tràn tối đa 1440px |
| Lề trang | 16 (mobile) · 32 (tablet) · 48 (desktop) |
| Lưới | 4 cột mobile, gap 16 · 8 cột tablet, gap 24 · 12 cột desktop, gap 32 |
| Độ dài dòng | `max-width: 68ch` cho đoạn văn |

## 4. Hình khối, bóng, lớp

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-0` | 0 | Ảnh |
| `--radius-1` | 2px | Nút, ô nhập, thẻ (gợi mép canvas cắt thẳng) |
| `--radius-pill` | 999px | Chip lọc, chấm màu, badge |
| `--border-w` | 1px | Mọi viền |
| `--shadow-0` | none | Mặc định (thiết kế phẳng) |
| `--shadow-1` | 0 1px 2px rgb(31 23 18 / .06), 0 4px 16px rgb(31 23 18 / .06) | Ngăn kéo, popover, menu Shop |
| `--shadow-2` | 0 8px 32px rgb(31 23 18 / .14) | Modal, lightbox |
| `--z-base` / `--z-sticky` / `--z-header` / `--z-drawer` / `--z-modal` / `--z-toast` / `--z-transition` | 0 / 10 / 20 / 40 / 50 / 60 / 70 | |
| Focus ring | `outline: 2px solid var(--focus); outline-offset: 2px` (nền tối dùng `--focus-on-dark`) | Mọi phần tử tương tác, chỉ khi `:focus-visible` |
| Vùng bấm | tối thiểu 44 × 44px | |

## 5. Component và trạng thái

| Component | Default | Hover (chỉ pointer fine) | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Button primary | Nền primary, chữ trắng, cao 48, chữ `--fs-ui` | Icon mũi tên dịch 4px; nền sáng hơn 6% | Focus ring | scale 0.98, 120ms | Nền `--border`, chữ `--muted`, `aria-disabled` | Giữ chiều rộng, chữ "Adding…", spinner tĩnh khi reduced motion | (không áp dụng) | Chữ "Added" 1.5s rồi trở lại |
| Button secondary | Viền 1px text, nền trong | Nền sand | Focus ring | scale 0.98 | Viền border, chữ muted | Như primary | | |
| Link | Chữ text, gạch chân accent 1px | Gạch chân chạy từ trái (scaleX 0→1, 220ms) | Focus ring | Màu accent | | | | |
| Product card | Ảnh 4:5 tràn khung, tên Fraunces, giá tabular, nhãn tầng mono, chấm màu | Ảnh chuyển sang ảnh hover; ảnh scale 1.035; thẻ nâng -4px | Focus ring quanh cả thẻ (thẻ là một link) | | Hết hàng: ảnh opacity .7, badge "Sold out" | Skeleton sand | | |
| Colour swatch | Vòng 28px, viền border-strong | Viền text | Focus ring | Viền 2px text + tên màu hiện bên cạnh | Gạch chéo + `aria-disabled` khi hết hàng | | | |
| Input / Select / Textarea | Nền surface, viền border-strong, cao 48, label luôn hiển thị phía trên | Viền text | Viền text + focus ring | | Nền sand, chữ muted | | Viền error + icon + thông báo dưới ô (`aria-describedby`, `aria-invalid`) | Icon tích success (chỉ cho trường đã kiểm tra hợp lệ phía server) |
| Radio card (phương thức thanh toán) | Viền border-strong | Nền bg | Focus ring | Viền 2px primary | Thẻ: nền sand, nhãn "Coming soon", `aria-disabled` | | | |
| Chip lọc | Viền border-strong, pill | Nền sand | Focus ring | Nền text, chữ bg, `aria-pressed` | | | | |
| Toast | Nền text, chữ bg | | | | | | Nền error | Nền success |

## 6. Logo và tài sản thương hiệu

**Quyết định:** logo hướng 01 (D15). Các ảnh Batch A trong `brand/identity/` xác nhận hướng này và là tài liệu tham chiếu; website luôn dùng file vector.

| File | Dùng cho |
|---|---|
| `public/brand/refvlks_logo_wordmark_primary.svg` | Header, footer trên nền sáng: chữ Cocoa, "v" Cinnabar |
| `public/brand/refvlks_logo_wordmark_reversed_on-cocoa.svg` | Nền Cocoa: chữ Bone, gạch Cinnabar dưới "v" |
| `public/brand/refvlks_logo_wordmark_one-colour-ink.svg` | In một màu, khắc, dập |
| `public/brand/refvlks_logo_monogram_cocoa.svg` / `_bone.svg` | Monogram R |
| `public/brand/favicons/` | `favicon.ico` (16, 32, 48), `icon.svg`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `public/brand/refvlks_pattern_weft.svg` | Pattern Weft lines, lặp liền mạch 480 × 240: nền dải trang trí, ngăn kéo giỏ hàng trống, trang 404 |
| `src/assets/fonts/` | Fraunces (bản display), Be Vietnam Pro, IBM Plex Mono kèm giấy phép OFL: chỉ dùng để sinh ảnh chia sẻ bằng `next/og` |
| `brand/identity/refvlks_brand_A01…A06.webp` | Ảnh tham chiếu bộ nhận diện (không đưa lên web) |
| `brand/REF_BRAND_BOARD.webp` | Bảng tham chiếu màu, chữ, logo, motif |

**Quy tắc logo** (theo A06): khoảng trống tối thiểu bằng chiều cao chữ R; rộng tối thiểu 24px trên màn hình, 20mm khi in; trên ảnh chỉ đặt vào vùng tường trống, không đè lên sản phẩm; không đổi font, không kéo giãn, không đổ bóng, không viết hoa toàn bộ. Header: wordmark cao 24px (mobile) và 28px (desktop), link về trang chủ, `aria-label="Refvlks home"`.

**Phần của bộ nhận diện làm bằng code (thay cho ảnh Batch B đến E):**

| Hạng mục | Cách làm trên web |
|---|---|
| Icon (B03) | `lucide-react`, `strokeWidth={1.5}`, màu `currentColor`, cỡ 20 hoặc 24px. Bảng chọn: ShoppingBag, Laptop, Repeat (vải tái chế), Grid3x3 (dệt), Truck, PackageCheck (kiểm hàng), Scissors (sửa chữa), MapPin, CalendarDays, Landmark (chuyển khoản), Banknote (COD) |
| Pattern (B02) | `refvlks_pattern_weft.svg` dùng làm `background-image`, opacity 0.6 trên nền sand |
| Ảnh chia sẻ OG (C01) | Sinh bằng `next/og`: nền Bone, wordmark bên trái, tagline Fraunces, ảnh sản phẩm bên phải (mặc định HOME-01; trang sản phẩm dùng ảnh mặt trước) |
| Header email (C06) | Email HTML dùng wordmark PNG xuất từ SVG và một đường kẻ Cinnabar |
| Minh họa 404 và giỏ trống (C04, C05) | Bản MVP: chữ + đường chỉ M1 + một dải pattern. Khi có ảnh C04, C05 thì thay vào |
| Bao bì, ấn phẩm (E) | Ngoài phạm vi website |

Không dùng họa tiết dệt làm biểu tượng khi chưa có đồng ý của nhóm nghệ nhân.

## 7. Hướng hình ảnh (cho ảnh chụp bổ sung sau này)

Bộ ảnh hiện có đã theo đúng hướng này; dùng làm chuẩn khi bổ sung.

| Yếu tố | Quy tắc |
|---|---|
| Ánh sáng | Nắng tự nhiên xiên từ trái, ấm khoảng 4.800K, bóng mềm |
| Màu | Ấm trung tính (kem, cát, nâu cocoa, xanh rừng), vùng tối hơi nâng, màu vật liệu trung thực, không ám cam |
| Bối cảnh | Nền trơn #E8DFD0 cho ảnh sản phẩm; bệ đá travertine; phố Hà Nội có nhà kiểu Pháp, sảnh văn phòng, quán cà phê, hiệu sách |
| Bố cục | Nhiều khoảng trống; ảnh banner chừa vùng chữ; ảnh sản phẩm túi cao khoảng 70% khung |
| Cắt ảnh | Thẻ 4:5 · gallery 2:3 · chi tiết 1:1 · hero 16:9 desktop và 4:5 mobile |
| Không được | Chữ, logo, biển hiệu đọc được trong ảnh; ảnh làm sai hình dáng hoặc chất liệu sản phẩm |
