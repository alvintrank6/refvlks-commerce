# 07 · MOTION SPEC

> **Cập nhật V2 (30/10/2026):** một số phần của file này đã được thay bằng `docs/10-UPDATE-V2.md` (xem mục 0 của file đó). Khi khác nhau, làm theo docs/10.

## 1. Nguyên tắc

- **Cảm giác:** mượt, có trọng lượng vừa phải, như vải rơi. Không nảy, không giật.
- **Ba motif duy nhất:**
  - **M1 · Weft line:** đường 1px màu accent chạy ngang (`scaleX 0→1`, gốc trái) hoặc dọc (`scaleY`). Gợi sợi ngang trên khung dệt.
  - **M2 · Mask reveal:** ảnh mở từ dưới lên bằng `clip-path: inset()`; tiêu đề hiện theo dòng trượt lên trong khung mask. Gợi động tác mở nắp túi.
  - **M3 · Parallax nhẹ:** ảnh lớn dịch 3 đến 5% theo cuộn, chỉ desktop.
- **Khoảnh khắc lớn:** Home có 1 cinematic (H-02). Product có 1 đoạn kể chuyện (P-04). Craft có 1 đoạn kể chuyện (CR-05). Các trang khác không có.
- **Không dùng:** horizontal scroll, marquee, zoom-through, Framer Motion. Lenis chỉ desktop, tắt ở checkout và admin.

## 2. Tokens (`src/motion/tokens.ts`)

| Token | Giá trị |
|---|---|
| duration.instant / fast / base / slow / cinematic / thread | 0.12 / 0.22 / 0.45 / 0.8 / 1.2 / 0.6 s |
| ease.standard / emphasis / inOut | `power2.out` / `power3.out` / `power2.inOut` (CSS: `cubic-bezier(.22,1,.36,1)` cho standard) |
| distance.sm / md / lg | 12 / 24 / 48 px (mobile tối đa md) |
| stagger.tight / base | 0.05 / 0.09 s; tổng mỗi nhóm < 0.7 s |
| parallax.soft | yPercent 3 đến 5, scrub 0.8 |
| hover.lift / hover.image | y -4px scale 1.01 / scale 1.035 trong 0.45s |
| trigger.start | `top 85%`, `once: true` |

## 3. Hạ tầng (`src/motion/`)

| File | Trách nhiệm |
|---|---|
| `MotionProvider.tsx` | Đăng ký plugin; `gsap.matchMedia()` với 3 điều kiện: `desktop` = `(min-width:1024px) and (pointer:fine)`, `mobile` = phần còn lại, `reduced` = `(prefers-reduced-motion: reduce)`; khởi tạo Lenis ở desktop; đồng bộ Lenis với ScrollTrigger |
| Script inline trong `<head>` | Thêm `html.js-motion` trước khi vẽ trang; tự gỡ sau 3s nếu MotionProvider chưa báo sẵn sàng |
| `weft-line.ts` | M1 |
| `mask-reveal.ts` | M2 cho ảnh và cho dòng chữ (SplitText `type: "lines"`, `mask: "lines"`, đệm 0.14em) |
| `parallax.ts` | M3 |
| `reveal-sequence.ts` | H-02 |
| `counter.ts`, `PageTransition.tsx`, `Cursor.tsx`, `magnetic.ts` | Thành phần phụ |

Quy tắc chung: mọi animation khai báo trong `useGSAP({ scope })` để tự hủy khi unmount; trạng thái đầu chỉ đặt bằng CSS dưới `html.js-motion`; chỉ animate `transform`, `opacity`, `clip-path` trên khung có kích thước cố định.

## 4. Toàn cục

| Component (selector) | Mục đích | Đầu → cuối | Trigger | Thời lượng · easing | Mobile | Reduced | A11y · hiệu năng · cleanup |
|---|---|---|---|---|---|---|---|
| Preloader `[data-preloader]` | Nhịp mở đầu lần đầu vào | Wordmark y 8→0, opacity 0→1; đường chỉ M1 dưới chữ; overlay opacity 1→0 | Lần đầu trong phiên (sessionStorage, có try/catch) | 0.5s; giữ ≤ 0.25s sau khi font + ảnh hero sẵn sàng; fade 0.45s standard; hero bắt đầu khi overlay đi 60% | Bỏ | Bỏ | `aria-hidden`; sau khi xong `visibility:hidden`, `pointer-events:none`; không chặn LCP |
| Page transition `PageTransition` | Liên tục giữa trang | Overlay primary scaleY 0→1 (gốc dưới) → điều hướng → 1→0 (gốc trên) | Click link nội bộ, không phím phụ | 0.45s / 0.6s inOut; hero mới chồng 0.2s | Bỏ | Bỏ | Bỏ qua: link ra ngoài, tab mới, `#hash`, download, cart, checkout, order, đổi ngôn ngữ. Lỗi → điều hướng thường. Khôi phục focus về `<main>` |
| Header `[data-header]` | Định hướng, CTA luôn dễ tìm | Nền trong suốt → bg; logo scale 1→0.94; M1 dưới header 1 lần | `scrollY > 40` hoặc hero rời màn hình | 0.26s; M1 0.6s | Giữ nền, bỏ M1 | Đổi tức thì | Không animate backdrop-filter |
| Link active | Báo trang hiện tại | Gạch chân scaleX 0→1 | `aria-current="page"` | 0.22s | Giữ | Hiện ngay | |
| Mobile menu `[data-mobile-menu]` | Điều hướng mobile | Panel x -100%→0; link y 16→0 stagger 0.06 | Nút menu | 0.36s emphasis; đóng 0.26s | Mặc định | Hiện ngay | Focus trap, ESC, khóa cuộn nền, trả focus về nút |
| Cart drawer `[data-cart-drawer]` | Xác nhận thêm vào giỏ | Panel x 100%→0; nền mờ 0→1; dòng mới nền sand nhạt dần | Add to bag thành công, bấm Bag | 0.36s emphasis; highlight 0.6s | Toàn màn hình | Hiện ngay | Như mobile menu; thông báo "Added to your bag" qua aria-live |
| Bag count `[data-bag-count]` | Phản hồi thêm hàng | scale 1→1.2→1 | Thêm thành công | 0.3s | Giữ | Bỏ | |
| Cursor `Cursor` | Gợi ý ảnh có thể mở | Chấm 10px → vòng 64px có chữ "View"/"Open" | Rê trên `[data-cursor="view"]` | lerp 0.15; phóng to 0.22s | Bỏ | Bỏ | Chỉ bật khi `pointer:fine` và `hover:hover`; không bao giờ trên form; con trỏ gốc vẫn hiển thị khi JS lỗi; rAF dừng khi tab ẩn |
| Magnetic `[data-magnetic]` | Nhấn mạnh 2 CTA lớn | Dịch tối đa 6px theo chuột | Rê chuột | lerp 0.15; về chỗ 0.45s | Bỏ | Bỏ | Chỉ CTA chính ở H-01 và H-08 |
| Lenis | Cuộn mượt | | Trang store, desktop | lerp 0.1 | Bỏ | Bỏ | Dừng khi mở menu, giỏ, lightbox; không chạy ở checkout, order, admin |
| Footer `[data-footer]` | Kết thúc nhẹ | Cột y 16→0 stagger 0.06; M1 phân cách | `top 92%` | 0.45s; M1 0.6s | Fade 0.3s | Hiện ngay | |

## 5. Home

| Section (selector) | Đầu → cuối | Trigger | Thời lượng · easing | Lớp ảnh | Mobile | Reduced | A11y · hiệu năng |
|---|---|---|---|---|---|---|---|
| H-01 media `[data-hero-media]` | scale 1.04→1, opacity 0.75→1 | Trang sẵn sàng | 1.1s standard | L0: HOME-01 / HOME-02 | Giữ, rút 0.6s | Hiện ngay | Ảnh LCP không bắt đầu ở opacity 0 (bắt đầu 0.75) |
| H-01 chữ `[data-hero-text]` | Eyebrow fade; H1 từng dòng yPercent 105→0 trong mask; sub, CTA y 16→0 | Sau media 0.2s | H1 0.9s emphasis, stagger dòng 0.1; sub 0.6s, CTA 0.5s stagger 0.08; tổng ≈ 1.5s | L1 | Bỏ chia dòng: fade + y 12 trong 0.45s | Hiện ngay | H1 và CTA đọc được khi JS lỗi |
| H-01 parallax | media yPercent 0→5; chữ 0→-2 | `top top` → `bottom top`, scrub 0.8 | | | Bỏ | Bỏ | |
| H-01 gợi ý cuộn | Đường dọc 32px lên xuống 6px | Sau timeline | 1.7s yoyo | | Giữ | Đường tĩnh | Dừng sau lần cuộn đầu hoặc khi tab ẩn |
| **H-02 Reveal** `[data-reveal]` | Ghim section; 8 khung crossfade theo tiến trình (khung n hiện ở 12,5% × n); 3 bước chữ y 24→0 ở các mốc 0%, 40%, 75%; M1 dọc làm thanh tiến trình, mốc 01/02/03 đổi màu accent | `top top` → `+=200%`, scrub 0.8, `pin: true`, `anticipatePin: 1` | Chữ mỗi bước ≈ 10% tiến trình; mốc 0.18s | L0 nền sand; L1 8 ảnh REVEAL chồng nhau (chỉ 2 khung liền kề có opacity > 0); L2 chữ; L3 thanh tiến trình | **Không ghim:** 3 thẻ dọc (REVEAL-01, 05, 08 cắt 4:5), mỗi thẻ M2 khi vào màn hình | 3 thẻ tĩnh | Link "Skip the reveal" ngay đầu section, đưa focus tới H-03. 8 khung tải khi section cách 1,5 màn hình; chờ `decode()` xong mới tạo ScrollTrigger; lỗi tải → bản 3 thẻ |
| H-03 Collection | M1 → H2 mask; thẻ y 24→0 (ScrollTrigger.batch) | `top 85%` once | M1 0.6s; H2 0.7s; thẻ 0.55s stagger 0.08 | Ảnh thẻ | y 12 | Hiện ngay | |
| H-03 hover thẻ | Ảnh crossfade sang ảnh hover; scale 1.035; thẻ -4px | Rê chuột | 0.45s / 0.22s | Ảnh hover | Không hover | Đổi tức thì, không scale | Ảnh hover tải lười khi rê lần đầu |
| H-03 đổi chip | Thẻ cũ fade + y -8; thẻ mới y 8→0 | Bấm chip | 0.16s ra, 0.26s vào | | Giữ | Tức thì | Giữ chiều cao tối thiểu lưới để không nhảy layout |
| H-04 Monday | Ảnh M2 (inset 0 0 100% 0 → 0) + scale 1.03→1; ý y 12 stagger | `top 85%` | Mask 0.9s emphasis; scale 1.1s; ý 0.45s stagger 0.07 | SP01-06, LIFE-05 | Ảnh fade 0.35s | Hiện ngay | |
| H-05 Materials | Số đếm 0→70, 0→30; M1 dưới mỗi số dài đúng tỷ lệ (70% và 30% chiều rộng) | `top 80%` once | Đếm 0.9s, làm tròn; M1 0.8s inOut | SP01-05 M2 | Số hiện ngay, M1 giữ | Hiện ngay | DOM và `aria-label` luôn là giá trị cuối |
| H-06 Hands | Ảnh M2 | `top 85%` | 0.9s | SP01-07 | Fade | Hiện ngay | Section ẩn khi CL-04 pending |
| H-07 Trust | 3 cột y 24→0 | `top 85%` | 0.5s stagger 0.09 | | y 12 | Hiện ngay | |
| H-08 Studio | H2, body, nút lần lượt; magnetic nút chính | `top 78%` | 0.7 / 0.5 / 0.45s stagger 0.09 | | Bỏ magnetic | Hiện ngay | |

## 6. Shop

| Phần tử | Hiệu ứng | Mobile | Reduced |
|---|---|---|---|
| Header | H1 mask dòng 0.8s | Fade | Hiện ngay |
| Lưới | Batch như H-03 | y 12 | Hiện ngay |
| Lọc / sắp xếp | Như H-03 đổi chip | Ngăn kéo lọc y 100%→0, 0.32s | Tức thì |
| Bảng tầng | Hàng fade y 12, stagger 0.05 | Giữ | Hiện ngay |

## 7. Product

| Phần tử | Hiệu ứng | Trigger | Mobile | Reduced | Ghi chú |
|---|---|---|---|---|---|
| Gallery desktop | Cột thông tin `position: sticky` (CSS); chấm vị trí cập nhật | IntersectionObserver | Vuốt ngang CSS scroll-snap + nút Prev/Next | Giữ | Ảnh đầu không animation (LCP) |
| Đổi màu (SP02) | Ảnh crossfade 0.26s; gallery lọc theo màu | Chọn swatch | Giữ | Tức thì | Cập nhật `?colour=` bằng `history.replaceState` |
| Add to bag | Nhấn scale 0.98; "Adding…"; thành công mở cart drawer | Bấm | Giữ | Bỏ scale | |
| Thanh mua cố định | y 100%→0, 0.22s | Buy box rời màn hình | Mặc định | Hiện/ẩn tức thì | |
| P-02, P-03 | Fade y 12, 0.45s | `top 85%` | Giữ | Hiện ngay | |
| **P-04 Open it** | Ảnh `clip-path inset(0 0 100% 0) → inset(0)` theo cuộn, như lật nắp; H2 M1 + mask | `top 80%` → `center 50%`, scrub 0.6 | Mask 0.9s một lần, không scrub | Hiện ngay | Chỉ khi có ảnh `inside` |
| Accordion | Mở tức thì (không animate chiều cao); nội dung fade y 8→0 0.2s | Bấm | Giữ | Tức thì | `aria-expanded` |
| Lightbox | Nền 0.22s; ảnh scale 0.985→1 0.3s | Bấm ảnh | Vuốt + nút | Tức thì | Focus trap, ESC, trả focus |

## 8. Craft, About, Studio

| Phần tử | Hiệu ứng | Mobile | Reduced |
|---|---|---|---|
| CR-02 | Dùng lại component số đếm + M1 tỷ lệ của H-05 | Như H-05 | Như H-05 |
| CR-03, CR-04 | Ảnh M2; ảnh vải parallax 3% | Bỏ parallax | Hiện ngay |
| **CR-05 Timeline** | M1 dọc scaleY 0→1 theo cuộn (`top 78%` → `bottom 60%`, scrub 0.6); 5 mốc hiện lần lượt (desktop so le x ±20→0, 0.5s); mốc đổi màu accent khi M1 chạm | Một trục trái, mốc fade y 12 không scrub | Đường và mốc hiện đủ |
| About AB-01 | H1 mask dòng 0.8s; ảnh M2 | Fade | Hiện ngay |
| Studio ST-01 | Như hero rút gọn: H1 mask 0.8s | Fade | Hiện ngay |
| Studio form | Viền ô border-strong → text 0.16s khi focus; lỗi fade 0.2s + aria-live; nút giữ chiều rộng khi "Sending…" | Giữ | Tức thì |

## 9. Vùng làm việc (cart, checkout, order, help, legal, admin)

Không reveal theo cuộn, không page transition, không Lenis. Chỉ phản hồi thao tác 0.12 đến 0.22s: chọn phương thức thanh toán (viền 0.16s), lỗi fade 0.2s, nút "Copy" đổi "Copied" 1.5s. Order confirmation có một M1 dưới H1 (0.6s) làm khoảnh khắc hoàn tất. Biểu đồ admin không animation khi tải.

## 10. Kiểm tra motion (bắt buộc trước khi đóng slice)

Reload giữa trang không để nội dung kẹt ở opacity 0 · Back/forward không để overlay che màn hình · Resize và xoay màn hình không nhân đôi ScrollTrigger · Nút bấm được trong và sau animation · Focus không nhảy vào phần tử ẩn · Reduced motion tắt scrub, autoplay, cursor, smooth scroll · Tab ẩn thì vòng lặp dừng · Không gây CLS hoặc trễ H1/CTA · 60fps trên máy tầm trung (Chrome DevTools, CPU throttling 4×).
