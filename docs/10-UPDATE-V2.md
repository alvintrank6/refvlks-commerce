# 10 · UPDATE V2: Motion nâng cấp, Donation Event, cấu trúc trang mới

Phiên bản 2.0 · 30/10/2026 · Theo yêu cầu của chủ dự án.

## 0. Phạm vi và thứ tự ưu tiên

File này **ghi đè** các phần tương ứng của tài liệu cũ. Khi nội dung khác nhau, làm theo file này; đây không phải mâu thuẫn cần hỏi lại.

| File cũ | Phần bị ghi đè |
|---|---|
| 04-CONTENT-BLUEPRINT | Mục 1 Home, 2 Shop, 3 Product (cấu trúc section), 4 Craft, 5 About, 6 Studio, header và footer. Giữ nguyên: dữ liệu sản phẩm seed, Cart, Checkout, Card preview, Order, Help, Legal, cấu trúc key i18n (bổ sung key mới ở mục 3) |
| 05-SITEMAP-UX | Menu, cây sitemap (thêm Donation Event, bỏ mục P3 "Donation programme"), luồng F5 mới |
| 07-MOTION-SPEC | Giới hạn "3 motif" và "1 cinematic mỗi trang" được thay bằng Motion v2 (mục 2). Giữ nguyên: tokens, hạ tầng `src/motion/`, quy tắc reduced motion, không scroll-jacking, kiểm tra motion |
| 08-TECH-SPEC | Mục 12 (kế hoạch slice) thay bằng mục 7 file này; bổ sung dữ liệu mục 4 |
| 09-ACCEPTANCE-CRITERIA | Bổ sung mục 6 file này; ngân sách JS ban đầu nâng lên 220KB gzip |
| 02-CONTENT-SOURCE | Bổ sung claim CL-17 đến CL-23 (đã ghi vào 02 và `claims.ts`) |

**Quyết định mới**

| Mã | Quyết định | Nguồn |
|---|---|---|
| D17 | Website có nhiều animation, transition và hiệu ứng hơn (Motion v2). Đây là quyết định của chủ dự án, ghi đè giới hạn 2 đến 3 motif của SOP. Các luật an toàn của SOP vẫn giữ: không scroll-jacking, có bản reduced motion, nội dung hiện khi JS lỗi, ngân sách hiệu năng | Chủ dự án |
| D18 | Thêm tab **Donation Event**: mỗi tháng một lần, đội ngũ Refvlks tổ chức quyên góp quần áo cũ lên Tây Bắc và các vùng đồng bào miền núi khác. Quần áo được lọc rồi vận chuyển đến người nhận; quần áo không đạt (rách, sờn màu, nhiều lỗ) được Refvlks tái sử dụng làm vải tái chế | Chủ dự án |
| D19 | Độ dài trang: trang chủ 5 section; mỗi tab còn lại 3 section. Header và footer không tính. Trang hỗ trợ, pháp lý, giỏ hàng, thanh toán giữ cấu trúc cũ | Chủ dự án |
| D20 | Nội dung Donation Event và nội dung các section mới do nhóm nội dung viết dựa trên mô tả của chủ dự án; con số, địa điểm, đối tác chỉ hiển thị khi có dữ liệu thật (claims mục 5) | Nhóm thiết kế |

---

## 1. Điều hướng và sitemap

**Menu chính (5 mục):** Shop · Craft · Donation Event · About · Visit the studio
VI: Cửa hàng · Thủ công · Sự kiện quyên góp · Về chúng tôi · Ghé studio

| Trang | EN | VI | Section |
|---|---|---|---|
| Home | `/en` | `/vi` | 5 |
| Shop | `/en/shop` | `/vi/cua-hang` | 3 |
| Product (template) | `/en/products/{handle}` | `/vi/san-pham/{handle}` | 3 |
| Craft & materials | `/en/craft` | `/vi/thu-cong` | 3 |
| **Donation Event** (mới) | `/en/donation-event` | `/vi/su-kien-quyen-gop` | 3 |
| About | `/en/about` | `/vi/ve-chung-toi` | 3 |
| Visit the studio | `/en/studio` | `/vi/studio` | 3 |

Footer cột "Refvlks" thêm link Donation Event. Mục P3 `/donate` trong 05 bị bỏ; Donation Event thay thế và là trang MVP.

**Luồng mới F5 · Người quyên góp:** Home H-05 hoặc menu → Donation Event → đọc cách hoạt động → form đăng ký → nhận tin nhắn ngày và điểm nhận đồ → gửi đồ → (nếu đồ không mặc được) trở thành vải tái chế, dẫn sang Shop.

---

## 2. Motion v2

### 2.1 Nguyên tắc

1. **Nhiều hơn nhưng có hệ thống:** mỗi hiệu ứng có mã E, có chỗ dùng cụ thể, dùng chung tokens 07 mục 2.
2. **Ba tầng:** `full` (desktop, chuột, không reduced motion), `lite` (mobile, tablet cảm ứng), `off` (prefers-reduced-motion). Mọi hiệu ứng khai báo hành vi ở cả ba tầng qua `gsap.matchMedia()`.
3. **Giữ luật an toàn:** không khóa cuộn, không chặn click, nội dung đọc được khi JS lỗi, chỉ animate transform, opacity, clip-path, stroke-dashoffset, CSS variables màu nền.
4. **Mỗi trang tối đa 2 section ghim** (pin). Home: H-02 và H-04. Các trang khác: tối đa 1.
5. **Plugin GSAP** (miễn phí từ bản 3.13, có trong gói npm `gsap`): ScrollTrigger, SplitText, Flip, DrawSVGPlugin, Observer, CustomEase. Import động theo trang; chỉ `gsap` core và ScrollTrigger nằm trong bundle chung.

### 2.2 Thư viện hiệu ứng

| Mã | Hiệu ứng | Mô tả kỹ thuật (full) | lite | off |
|---|---|---|---|---|
| E1 | Preloader dệt | Lần đầu trong phiên: 7 đường chỉ ngang vẽ từ trái sang (DrawSVG, stagger 0.06s), wordmark SVG hiện từ mask, overlay Cocoa trượt lên (yPercent 0→-100, 0.8s, ease.inOut). Chỉ chạy khi tài nguyên hero đã tải thật; tổng thời gian hiển thị tối đa 1.2s | Chỉ fade overlay 0.3s | Không có |
| E2 | Chuyển trang curtain | Panel Cocoa có pattern Weft lines quét từ dưới lên che màn hình (0.5s), điều hướng, quét lên tiếp để lộ trang mới (0.6s); wordmark nhỏ ở giữa panel | Fade nội dung 0.2s | Điều hướng thẳng |
| E3 | Chuyển cảnh chia sẻ phần tử | View Transitions API (thư viện `next-view-transitions` hoặc tương đương): ảnh thẻ sản phẩm biến hình thành ảnh đầu tiên của gallery khi mở trang sản phẩm; `view-transition-name` = `product-{handle}-{colour}`. Trình duyệt không hỗ trợ → dùng E2 | Giữ (nhanh, 0.35s) | Tắt |
| E4 | Cuộn mượt + thanh tiến trình | Lenis (lerp 0.1) desktop; đường chỉ Cinnabar 2px trên cùng màn hình, scaleX theo tiến trình cuộn trang | Không Lenis; thanh tiến trình giữ | Không Lenis, không thanh |
| E5 | Chữ tách dòng và từ | SplitText `lines,words` có mask (đệm 0.14em cho dấu tiếng Việt); dòng trượt lên yPercent 105→0, từ stagger 0.03s; dùng cho H1, H2 | Chỉ theo dòng, y 12px | Hiện ngay |
| E6 | Link "cuộn chữ" | Link menu và footer: chữ nhân đôi, hover thì bản trên trượt lên, bản dưới trượt vào (yPercent -100, 0.35s); gạch chân Cinnabar chạy theo | Không hover | Gạch chân tĩnh khi focus |
| E7 | Mask reveal ảnh | clip-path `inset(100% 0 0 0)` → `inset(0)` kèm scale 1.15→1 cho ảnh bên trong (0.9 đến 1.1s, ease.emphasis) | Fade + y 16 | Hiện ngay |
| E8 | Parallax nhiều lớp + nghiêng theo chuột | Ảnh hero dịch theo cuộn 0→8%, lớp pattern dịch ngược -4%; theo chuột ảnh nghiêng tối đa 3° (rotateX/Y, perspective 1200px, lerp 0.1) | Chỉ parallax cuộn 0→4% | Tắt |
| E9 | Chuỗi khung ghim | Như 07 H-02 (8 khung, scrub) | 3 thẻ dọc | 3 thẻ tĩnh |
| E10 | Gallery ngang ghim | Section ghim, dải ảnh dịch ngang theo cuộn (x = -(chiều rộng dải - viewport)), scrub 1; mỗi ảnh có parallax bên trong khung (xPercent -6→6); độ nghiêng skewX theo vận tốc cuộn (giới hạn ±4°, hồi về 0 trong 0.4s); con trỏ hiện nhãn "Drag" | Cuộn ngang bằng tay với CSS scroll-snap, không ghim | Lưới dọc 2 cột |
| E11 | Marquee | Dải chữ mono chạy ngang liên tục (CSS animation 40s), tốc độ tăng theo vận tốc cuộn (Observer), đổi chiều khi cuộn ngược | CSS animation cố định | Dừng, hiển thị tĩnh 1 dòng |
| E12 | Thẻ xếp chồng | Các thẻ `position: sticky` chồng lên nhau khi cuộn; thẻ phía dưới thu nhỏ scale 1→0.94 và tối dần (opacity overlay 0→0.25) | Danh sách thẻ thường, reveal y 16 | Danh sách tĩnh |
| E13 | Vẽ đường SVG | DrawSVG vẽ đường theo cuộn (scrub): đường Weft line, đường hành trình Donation Event | Vẽ một lần khi vào màn hình | Hiện đầy đủ |
| E14 | Bộ đếm | Số đếm từ 0 khi vào màn hình (0.9 đến 1.4s), thanh tỷ lệ chạy theo | Giữ | Hiện số cuối |
| E15 | Flip | GSAP Flip cho lọc và sắp xếp ở Shop, đổi màu ở trang sản phẩm, "bay vào giỏ" (ảnh thu nhỏ bay tới biểu tượng giỏ 0.7s) | Lọc: fade 0.2s; bay vào giỏ giữ | Đổi tức thì |
| E16 | Hover thẻ | Ảnh zoom 1.06 (0.6s), đổi sang ảnh hover bằng clip-path từ dưới lên, thẻ nghiêng tối đa 4° theo chuột, nhãn con trỏ "View" | Không hover | Không hover |
| E17 | Nút từ tính + nút "dệt" | Nút chính hút theo chuột tối đa 8px; khi hover, nền Cinnabar mỏng chạy từ trái sang dưới chữ (scaleX 0→1, 0.35s) | Chỉ trạng thái nhấn scale 0.98 | Chỉ đổi màu |
| E18 | Con trỏ tùy biến | Chấm 8px Cocoa, đổi thành vòng 72px kèm nhãn theo ngữ cảnh: View, Drag, Open, Play; ẩn trên form | Tắt | Tắt |
| E19 | Đổi màu nền theo section | Khi section vào giữa màn hình, biến `--page-bg` chuyển Bone ↔ Cocoa ↔ Sand (0.6s); chữ đổi theo để giữ tương phản AA | Giữ | Đổi tức thì |
| E20 | Footer kéo rèm | Footer cố định phía dưới, nội dung trang trượt lên để lộ footer; wordmark lớn trong footer hiện bằng E5 | Footer thường | Footer thường |
| E21 | Hotspot sản phẩm | Chấm Cinnabar nhấp nháy nhẹ trên ảnh sản phẩm (scale 1→1.4, opacity 1→0, lặp 2s); bấm mở nhãn chất liệu (popover) | Giữ, không nhấp nháy | Không nhấp nháy |

**Tokens bổ sung** (`src/motion/tokens.ts`): `duration.reveal = 1.0`, `duration.curtain = 0.55`, `ease.curtain = "power4.inOut"`, `skew.max = 4`, `tilt.max = 3`, `magnetic.max = 8`, `marquee.seconds = 40`.

**Ngân sách:** JS ban đầu ≤ 220KB gzip (nâng từ 200KB vì Motion v2); plugin GSAP và Lenis tải động sau khi trang tương tác được; LCP < 2.5s, CLS < 0.1, INP < 200ms giữ nguyên; 60fps trên máy tầm trung, nếu tụt thì tắt E8 tilt và E10 skew trước.

### 2.3 Hiệu ứng theo trang

| Trang | Hiệu ứng |
|---|---|
| Toàn cục | E1, E2, E3, E4, E6, E17, E18, E20 |
| Home | E5, E7, E8, E9 (H-02), E10 (H-04), E14, E16, E19 (H-05), E15 (bay vào giỏ) |
| Shop | E5, E11, E15, E16, E7 |
| Product | E3, E7, E15, E21, E14, E10 lite (hàng "You may also like") |
| Craft | E5, E14, E12, E13, E7 |
| Donation Event | E5, E13 (đường hành trình), E12, E11, E14, E19 |
| About | E5, E8, E12, E7 |
| Studio | E5, E7, E17 |

---

## 3. Nội dung từng trang

Quy ước như 04: **Ảnh** là mã trong `assets.json`; **Claim** là mã trong 02. Key i18n mới đặt theo tiền tố ghi ở đầu mỗi section.

### 3.1 HOME (5 section) · `/en` · `/vi`

SEO giữ như 04 mục 1.

**H-01 · Hero** · Attention · key `home.hero` · Ảnh HOME-01, HOME-02 · Hiệu ứng E1 → E5, E7, E8, E17 · Claim CL-10, CL-13

| Phần tử | EN | VI |
|---|---|---|
| Eyebrow | WORK BAGS · HANOI | TÚI ĐI LÀM · HÀ NỘI |
| H1 | Quiet on the outside. A story on the inside. | Ngoài tĩnh lặng. Trong là câu chuyện. |
| Sub | Tailored work bags for city days, with textile woven in Vietnam on the inside. | Túi đi làm may đo cho ngày ở thành phố, bên trong là vải dệt Việt Nam. |
| CTA chính | Shop the collection | Xem bộ sưu tập |
| CTA phụ | Visit the studio | Ghé studio |
| Dòng dưới | Inspect before you pay · Studio visits by appointment, 8:00 to 21:30 | Kiểm hàng trước khi trả tiền · Ghé studio theo lịch hẹn, 8:00 đến 21:30 |

Bố cục: ảnh tràn màn hình, lớp pattern Weft lines mờ (opacity 0.35) phủ dải dưới ảnh làm lớp parallax thứ hai; chữ bên trái. Done khi: H1 và CTA đọc được khi tắt JS; ảnh LCP không bắt đầu ở opacity 0.

**H-02 · The Reveal** · Desire + Trust · key `home.reveal` · Ảnh REVEAL-01→08 · Hiệu ứng E9, E14, E13 · Claim CL-01, CL-02, CL-21

| Bước | EN | VI |
|---|---|---|
| Link bỏ qua | Skip the reveal | Bỏ qua phần trình diễn |
| 01 (số đếm 70%) | **70%** A body of new technical textile, cut to hold its shape. | **70%** Thân túi bằng vải chuyên dụng mới, cắt để giữ phom. |
| 02 (số đếm 30%) | **30%** Handles and flaps in recovered cotton, denim and synthetics. Some of it comes from clothes donated to our monthly drives. | **30%** Quai và nắp từ cotton, jeans và vải tổng hợp tái chế. Một phần đến từ quần áo quyên góp trong các chuyến hằng tháng. |
| 03 | Open it: a lining woven in Vietnam. | Mở ra: lớp lót dệt tại Việt Nam. |
| CTA | See how it's made | Xem cách chúng tôi làm |

Thanh tiến trình bên trái là đường chỉ dọc vẽ theo cuộn (E13). Mobile và reduced: 3 thẻ dùng REVEAL-01, 05, 08.

**H-03 · The Collection** · Relevance · key `home.collection` · Ảnh thẻ SP01-01, SP02F-01, SP02W-01, SP03-01, SP04-01; hover SP01-03, SP02F-02, SP02W-02, SP03-02, SP04-02 · Hiệu ứng E5, E7, E15, E16, E3

| Phần tử | EN | VI |
|---|---|---|
| H2 | Five bags for the working week. | Năm chiếc túi cho tuần làm việc. |
| Body | Essential for every day. Signature for a flap that closes and a woven detail you notice. Heritage for the full woven lining. | Essential cho mỗi ngày. Signature có nắp đóng và chi tiết dệt làm điểm nhấn. Heritage với lớp lót dệt toàn phần. |
| Chip | All · Essential · Signature · Heritage | Tất cả · Essential · Signature · Heritage |
| Nhãn thẻ | {TIER} · {Name}, {Colour} · {Price} | |
| CTA | Shop all bags | Xem tất cả |

Bố cục desktop: lưới so le (thẻ 2 và 4 lệch xuống 64px), thẻ xuất hiện bằng E7 stagger 0.08s.

**H-04 · Carried in Hanoi** · Desire + Objections · key `home.carried` · Ảnh theo thứ tự: LIFE-01, SP02F-02, LIFE-05, LIFE-04, LIFE-08, SP03-03, LIFE-02, LIFE-07 · Hiệu ứng E10, E5, E18 ("Drag") · Claim CL-10, CL-11, CL-13

| Phần tử | EN | VI |
|---|---|---|
| Panel mở đầu H2 | Carried in Hanoi. | Mang theo khắp Hà Nội. |
| Panel mở đầu body | From office lobbies to tree-lined streets, five bags made for the way the city moves. | Từ sảnh văn phòng đến những con phố rợp cây, năm chiếc túi làm cho nhịp sống của thành phố. |
| Chú thích mỗi ảnh (mono, link tới sản phẩm) | WEFT STRUCTURED TOTE / LOOM FLAP TOTE · FOREST / LOOM CARRYALL / LOOM FLAP TOTE · WINE / TRÁM SHOPPER / LOOM CARRYALL / LOOM FLAP TOTE · FOREST / LOOM CARRYALL | giữ nguyên tên |
| Panel kết: 3 cam kết | **Inspect before you pay.** Open the parcel and check your bag before paying the courier. · **Repairs we stand behind.** Handles, buckles and seams can come back to us. · **See it in person.** Book a time at our studio on Le Quy Don. | **Kiểm hàng rồi trả tiền.** Mở gói và kiểm túi trước khi trả tiền cho người giao hàng. · **Sửa chữa có cam kết.** Quai, khóa và đường may có thể gửi lại cho chúng tôi. · **Xem tận tay.** Đặt lịch tại studio trên phố Lê Quý Đôn. |
| CTA panel kết | Shipping & returns | Giao hàng & đổi trả |

Thanh tiến trình dưới dải ảnh là đường chỉ Cinnabar chạy ngang theo scrub.

**H-05 · Two invitations** · Action · key `home.invite` · Ảnh: nửa trái pattern + SP03-01 (khung nhỏ), nửa phải LIFE-03 · Hiệu ứng E19 (nền Bone → Cocoa), E13, E7, E17 · Claim CL-17, CL-21, CL-13

| Nửa | EN | VI |
|---|---|---|
| Trái · eyebrow | DONATION EVENT · EVERY MONTH | SỰ KIỆN QUYÊN GÓP · MỖI THÁNG |
| Trái · H3 | Your old clothes, up the mountain. | Áo cũ của bạn, lên với vùng cao. |
| Trái · body | Once a month we take sorted, wearable clothes to communities in the Northwest. Worn-out pieces become the recovered textile in our bags. | Mỗi tháng, chúng tôi mang quần áo đã phân loại, còn mặc tốt lên với bà con Tây Bắc. Áo đã quá cũ trở thành vải tái chế trong túi Refvlks. |
| Trái · CTA | Join the next drive | Tham gia chuyến tới |
| Phải · eyebrow | THE STUDIO · BY APPOINTMENT | STUDIO · THEO LỊCH HẸN |
| Phải · H3 | Come and carry one. | Đến và đeo thử một chiếc. |
| Phải · body | 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. Every day, 8:00 to 21:30. | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. Mở cửa hằng ngày, 8:00 đến 21:30. |
| Phải · CTA | Book a visit | Đặt lịch ghé studio |

Sau H-05 là footer kéo rèm (E20).

### 3.2 SHOP (3 section) · `/en/shop` · `/vi/cua-hang`

SEO giữ như 04 mục 2.

**S-01 · Header** · key `shop.header` · Hiệu ứng E5, E11

| Phần tử | EN | VI |
|---|---|---|
| H1 | All bags | Tất cả sản phẩm |
| Sub | Every bag is built for work first. | Mỗi chiếc túi đều được làm để đi làm trước tiên. |
| Marquee | INSPECT BEFORE YOU PAY · REPAIRS AVAILABLE · STUDIO VISITS BY APPOINTMENT · 70% NEW TECHNICAL TEXTILE · 30% RECOVERED · | KIỂM HÀNG TRƯỚC KHI TRẢ TIỀN · CÓ DỊCH VỤ SỬA CHỮA · GHÉ STUDIO THEO LỊCH HẸN · 70% VẢI CHUYÊN DỤNG MỚI · 30% VẢI TÁI CHẾ · |

**S-02 · The bags** · key `shop.grid` · Ảnh thẻ như H-03 · Hiệu ứng E15 (lọc, sắp xếp), E16, E7, E3
Thanh lọc dính trên cùng khi cuộn (Tier, Colour, Price, sắp xếp); microcopy như 04 mục 2. Đếm `{n} bags` / `{n} mẫu`.

**S-03 · Three tiers** · key `shop.tiers` · Ảnh: Essential LIFE-08, Signature LIFE-02, Heritage LIFE-01 · Hiệu ứng E7, E5

| Cột | EN | VI |
|---|---|---|
| H2 | Three tiers, one standard. | Ba dòng, một tiêu chuẩn. |
| Essential | Open and easy. An all-over woven motif and no flap, for the fastest grab-and-go. From 1.290.000 ₫. | Mở miệng, dễ dùng. Họa tiết dệt phủ toàn thân, không nắp, lấy đồ nhanh nhất. Từ 1.290.000 ₫. |
| Signature | A flap that snaps shut and a woven band or panel you notice. From 1.590.000 ₫. | Nắp bấm đóng lại và một dải hoặc mảng dệt làm điểm nhấn. Từ 1.590.000 ₫. |
| Heritage | Our most structured bag, with a buckled flap and a full woven lining. 1.890.000 ₫. | Chiếc túi đứng phom nhất, nắp có khóa cài và lớp lót dệt toàn phần. 1.890.000 ₫. |
| Mỗi cột · link | Shop {tier} | Xem dòng {tier} |
| Hàng tin cậy | Inspect before you pay · Repairs available · Try them at the studio | Kiểm hàng trước khi trả tiền · Có sửa chữa · Thử tại studio |

Giá trong bảng lấy từ dữ liệu sản phẩm, không gõ cứng.

### 3.3 PRODUCT (3 section, template) · `/en/products/{handle}`

SEO, dữ liệu sản phẩm, microcopy giữ như 04 mục 3.

**P-01 · Gallery + Buy** · key `product.buy` · Ảnh: gallery theo `products.seed.json` · Hiệu ứng E3 (ảnh đầu nhận chuyển cảnh từ thẻ), E7, E15 (đổi màu, bay vào giỏ), E17
Nội dung buy box như 04 P-01. Desktop: cột ảnh cuộn, mỗi ảnh có parallax nhẹ bên trong khung, chỉ số "01 / 08" (mono) đổi theo ảnh đang xem; cột thông tin sticky.

**P-02 · Inside the bag** · key `product.inside` · Ảnh: ảnh mặt trước (hotspot), ảnh vai trò `open` hoặc `inside` nếu có · Hiệu ứng E21, E14, E7 · Claim CL-01, CL-02

| Phần tử | EN | VI |
|---|---|---|
| H2 | Inside the bag. | Bên trong chiếc túi. |
| Hotspot | Mỗi bộ phận trong `materials.parts` có một chấm trên ảnh (toạ độ lưu trong dữ liệu sản phẩm, trường `hotspots`, đơn vị %); popover hiện `part` + `en`/`vi` | |
| Thanh tỷ lệ | 70% new technical textile · 30% recovered, by textile weight | 70% vải chuyên dụng mới · 30% vải tái chế, tính theo khối lượng vải |
| Bảng thông số | Như 04 P-02 (hàng thiếu dữ liệu ẩn) | |
| Open it (nếu có ảnh) | Open it. + mô tả lớp lót SP01 | Mở ra. |

Toạ độ hotspot mặc định (chỉnh khi xem trên ảnh thật): SP01 body 50/72, sides 12/62, flap+band 50/38, handles 50/12; SP02 body 50/60, band 50/82, flap tab 50/36, handles 50/12; SP03 body 30/55, panel 50/80, flap 50/36, handles 40/12, scarf 62/18; SP04 body 35/55, handles+straps 62/45.

**P-03 · Before you buy** · key `product.before` · Ảnh: hàng "You may also like" dùng ảnh thẻ · Hiệu ứng E10 lite (rail cuộn ngang), E16
Accordion: Delivery, Payment, Returns, Care, Questions (nội dung 04 P-05 đến P-07, gồm câu "Is the flap leather?"). Dưới accordion: H3 "You may also like." / "Có thể bạn thích." và rail 4 thẻ.

### 3.4 CRAFT (3 section) · `/en/craft` · `/vi/thu-cong`

| | EN | VI |
|---|---|---|
| Title | Craft & Materials: Inside Every Refvlks Bag | Thủ công & vật liệu: bên trong túi Refvlks |
| Meta | 70% new technical textile, 30% recovered textile from handles to scarves, part of it from donated clothes too worn to give. | 70% vải chuyên dụng mới, 30% vải tái chế từ quai đến khăn, một phần từ quần áo quyên góp đã quá cũ. |
| H1 | Seventy, thirty. | Bảy mươi, ba mươi. |

**CR-01 · Seventy, thirty** · key `craft.share` · Ảnh SP01-05 · Hiệu ứng E5, E14 (hai số lớn đếm lên + thanh tỷ lệ), E7

| Phần tử | EN | VI |
|---|---|---|
| Lead | Every Refvlks bag is built from two kinds of cloth, each where it works best. | Mỗi chiếc túi Refvlks làm từ hai loại vải, mỗi loại ở đúng chỗ của nó. |
| Khối 70% | **70%** New technical textile for the body: dense jacquard canvas and 3 mm felt that hold their shape and take daily wear. | **70%** Vải chuyên dụng mới cho thân túi: canvas jacquard dày và nỉ 3 mm, giữ phom và chịu được mài mòn hằng ngày. |
| Khối 30% | **30%** Recovered cotton, denim and synthetics for handles, flaps, straps and scarves, finished with a matte water-based coating so they stay smooth and easy to wipe. | **30%** Cotton, jeans và vải tổng hợp tái chế cho quai, nắp, dải quai và khăn, phủ lớp hoàn thiện mờ gốc nước để mịn và dễ lau. |
| Ghi chú | Measured by textile weight. Every part is listed on each product page. | Tính theo khối lượng vải. Từng bộ phận được ghi trên trang sản phẩm. |

**CR-02 · From cloth to bag** · key `craft.process` · Ảnh theo bước: SP01-05, SP01-06, SP01-02, SP01-07, SP01-01 · Hiệu ứng E12 (5 thẻ xếp chồng, ảnh đổi theo thẻ), E13 (đường chỉ dọc nối các bước) · Claim CL-21

| Bước | EN | VI |
|---|---|---|
| H2 | From cloth to bag. | Từ tấm vải đến chiếc túi. |
| 01 Sort | Clothes too worn to give away, including pieces from our monthly donation drives, are set aside for recovery. | Quần áo đã quá cũ để trao tặng, gồm cả những chiếc từ các chuyến quyên góp hằng tháng, được để riêng để tái chế. |
| 02 Clean and cut | They are washed, opened at the seams and cut into panels by type: cotton, denim, synthetics. | Chúng được giặt sạch, tháo đường may và cắt thành tấm theo loại: cotton, jeans, vải tổng hợp. |
| 03 Coat | Panels for handles and flaps get a matte water-based finish, so recovered cloth feels smooth and wipes clean. | Tấm vải cho quai và nắp được phủ lớp hoàn thiện mờ gốc nước, để vải tái chế mịn tay và dễ lau. |
| 04 Sew | Recovered parts are sewn to a body of new jacquard canvas or felt, with a woven lining or panel. | Phần tái chế được may cùng thân túi bằng canvas jacquard hoặc nỉ mới, kèm lớp lót hoặc mảng dệt. |
| 05 Check | Every bag is checked by hand: shape, seams, handles and closures. | Từng chiếc túi được kiểm tra thủ công: phom, đường may, quai và khóa. |

**CR-03 · The weave, and what we don't claim yet** · key `craft.weave` · Ảnh SP01-07, REVEAL-08, SP03-01 · Hiệu ứng E7, E5 · Claim CL-04, CL-15, CL-16

| Phần tử | EN | VI |
|---|---|---|
| H2 | The weave. | Phần dệt. |
| Body | The lining of the Weft Structured Tote and the panel of the Loom Carryall are multicolour woven brocade. | Lớp lót của Weft Structured Tote và mảng dệt của Loom Carryall là thổ cẩm dệt nhiều màu. |
| Khi CL-04 approved | Woven by hand by {group} in {place}, on agreed terms. | Dệt tay bởi {nhóm} tại {địa phương}, theo thỏa thuận. |
| H3 | What we don't claim yet. | Điều chúng tôi chưa khẳng định. |
| Body | QR codes that trace each bag to its batch are in development. Batch-by-batch measurement of the 70/30 split is being set up. When they are ready, they will be here, with evidence. | Mã QR truy xuất từng chiếc túi về lô sản xuất đang được phát triển. Việc đo tỷ lệ 70/30 theo từng lô đang được thiết lập. Khi sẵn sàng, chúng sẽ có mặt ở đây, kèm bằng chứng. |
| CTA | Shop Heritage · Join the donation event | Xem dòng Heritage · Tham gia quyên góp |

### 3.5 DONATION EVENT (3 section, mới) · `/en/donation-event` · `/vi/su-kien-quyen-gop`

| | EN | VI |
|---|---|---|
| Title (≤60) | Donation Event: Clothes to the Mountains \| Refvlks | Sự kiện quyên góp áo quần lên vùng cao \| Refvlks |
| Meta (≤155) | Once a month, Refvlks takes sorted, wearable clothes to mountain communities in the Northwest. Worn-out pieces become recovered textile. | Mỗi tháng, Refvlks mang quần áo đã phân loại lên với bà con vùng cao Tây Bắc. Áo quá cũ được tái chế thành vải cho túi. |
| H1 | Once a month, we take clothes to the mountains. | Mỗi tháng một lần, chúng tôi mang áo quần lên vùng cao. |

Giọng văn: tôn trọng, ngang hàng, cụ thể. Không dùng từ ngữ thương hại ("người nghèo khổ", "poor tribes"), không phóng đại tác động, không dùng ảnh trẻ em nhận diện được khi chưa có đồng ý của người giám hộ.

**DE-01 · Hero** · Attention · key `donation.hero` · Ảnh: không dùng ảnh người (chưa có ảnh chuyến đi thật); nền Sand với pattern Weft lines vẽ dần (E13) và một đường hành trình SVG cách điệu từ nhãn "HANOI" lên nhãn "NORTHWEST" (không phải bản đồ thật) · Hiệu ứng E5, E13, E11, E17 · Claim CL-17, CL-18, CL-21

| Phần tử | EN | VI |
|---|---|---|
| Eyebrow | DONATION EVENT · EVERY MONTH | SỰ KIỆN QUYÊN GÓP · MỖI THÁNG |
| H1 | Once a month, we take clothes to the mountains. | Mỗi tháng một lần, chúng tôi mang áo quần lên vùng cao. |
| Sub | Bring us the clothes you no longer wear. We check every piece, take the wearable ones to communities in the Northwest and other mountain regions, and turn the rest into the recovered textile in our bags. | Hãy gửi chúng tôi những bộ quần áo bạn không còn mặc. Chúng tôi kiểm từng chiếc, mang những chiếc còn mặc tốt lên với bà con Tây Bắc và các vùng núi khác, phần còn lại trở thành vải tái chế trong túi Refvlks. |
| CTA chính | Join the next drive → `#join` | Đăng ký tham gia |
| CTA phụ | How it works → `#how` | Cách hoạt động |
| Marquee | MONTHLY TRIPS · EVERY PIECE CHECKED · WORN-OUT PIECES RECYCLED · NOTHING GOES TO WASTE · | MỖI THÁNG MỘT CHUYẾN · KIỂM TỪNG CHIẾC · ÁO QUÁ CŨ ĐƯỢC TÁI CHẾ · KHÔNG CHIẾC NÀO BỊ BỎ PHÍ · |
| Dải tác động (chỉ khi CL-20 approved, E14) | {kg} kg collected · {n} pieces delivered · {kg} kg recycled into textile | {kg} kg đã nhận · {n} chiếc đã trao · {kg} kg tái chế thành vải |

**DE-02 · How it works** · Relevance + Trust · `#how` · key `donation.how` · Ảnh: bước 04 dùng SP01-05 (quai, nắp từ vải tái chế) và SP03-01 (khăn); icon Lucide PackageOpen, Shirt, Truck, Recycle · Hiệu ứng E12 (4 thẻ xếp chồng), E13 (đường hành trình vẽ theo cuộn, đi qua 4 thẻ) · Claim CL-17, CL-18, CL-19, CL-21, CL-22

| Phần tử | EN | VI |
|---|---|---|
| H2 | From your wardrobe to the mountains, in four steps. | Từ tủ đồ của bạn lên vùng cao, qua bốn bước. |
| 01 Bring | Drop your clothes at our studio during collection week, or register and we'll message you this month's collection point. | Mang quần áo đến studio trong tuần nhận đồ, hoặc đăng ký để chúng tôi nhắn điểm nhận đồ của tháng. |
| 01 khi CL-22 pending | Register and we'll message you this month's collection point. | Đăng ký để chúng tôi nhắn điểm nhận đồ của tháng. |
| 02 Sort | Our team checks every piece. Clean, intact clothes are folded and packed by size and type: adults, children, warm layers. | Đội ngũ kiểm tra từng chiếc. Quần áo sạch, còn nguyên vẹn được gấp và đóng gói theo cỡ và loại: người lớn, trẻ em, đồ ấm. |
| 03 Deliver | Once a month the team travels north and hands the clothes over in person, to communities in the Northwest and other mountain regions of Vietnam. | Mỗi tháng một lần, đội ngũ lên đường và trao tận tay quần áo cho bà con Tây Bắc và các vùng núi khác của Việt Nam. |
| 03 thêm khi CL-19 approved | Before each trip we ask local partners what is needed, so we only pack what will be worn. | Trước mỗi chuyến, chúng tôi hỏi đối tác địa phương bà con đang cần gì, để chỉ mang những thứ thật sự được dùng. |
| 04 Recycle the rest | Torn, faded or worn-through pieces never go up the mountain. We clean and cut them into the recovered textile used in our handles, flaps and scarves. | Những chiếc rách, bạc màu hay thủng nhiều không được mang lên vùng cao. Chúng tôi làm sạch, cắt và biến chúng thành vải tái chế cho quai, nắp và khăn của túi. |
| 04 link | See where it ends up → `/shop` | Xem chúng trở thành gì |
| Khối "Please bring" | Clean clothes in good condition · Warm layers: jackets, sweaters, scarves · Children's clothes · Torn or faded cotton and denim: we'll recycle it | Quần áo sạch, còn tốt · Đồ ấm: áo khoác, áo len, khăn · Quần áo trẻ em · Đồ cotton, jeans đã rách hoặc bạc màu: chúng tôi sẽ tái chế |
| Khối "Please don't bring" | Underwear and socks · Wet, mouldy or unwashed clothes · Shoes, bags and other non-textile items | Đồ lót và tất · Quần áo ẩm, mốc hoặc chưa giặt · Giày, túi và đồ không phải vải |

**DE-03 · Join the next drive** · Action · `#join` · key `donation.join` · Dữ liệu `src/content/donation-events.json` · Hiệu ứng E19 (nền Bone → Cocoa nhẹ), E5, E17, E13 (đường chỉ vẽ khi gửi thành công) · Claim CL-20, CL-23

| Phần tử | EN | VI |
|---|---|---|
| H2 | Join the next drive. | Tham gia chuyến tới. |
| Thẻ chuyến tới (khi có dữ liệu) | NEXT DRIVE · {date} · Collection: {window} · Destination: {destination} | CHUYẾN TỚI · {ngày} · Nhận đồ: {thời gian} · Điểm đến: {địa điểm} |
| Thẻ chuyến tới (khi chưa có) | The date for next month's drive is announced here and sent to everyone who registers. | Ngày của chuyến tháng tới sẽ được công bố tại đây và gửi tới mọi người đã đăng ký. |
| Nút gửi | Count me in | Đăng ký tham gia |
| Thành công | Thanks, {name}. We'll message you the date and collection details for the next drive. | Cảm ơn {tên}. Chúng tôi sẽ nhắn bạn ngày và thông tin nhận đồ của chuyến tới. |

Form `donation.form`:

| Trường | EN | VI | Validation |
|---|---|---|---|
| name | Name | Họ tên | bắt buộc |
| phone | Phone or Zalo | Số điện thoại hoặc Zalo | bắt buộc, 10 số bắt đầu bằng 0 |
| email | Email (optional) | Email (không bắt buộc) | định dạng |
| role | I'd like to: Donate clothes / Volunteer on a trip / Both | Tôi muốn: Quyên góp quần áo / Đi tình nguyện / Cả hai | bắt buộc |
| amount (khi chọn quyên góp) | Roughly how much? One bag / Two to three bags / More than three bags | Khoảng bao nhiêu? Một túi / Hai đến ba túi / Hơn ba túi | |
| note | Note (optional) | Ghi chú | ≤ 300 ký tự |
| consentPrivacy | I agree to the Privacy Policy | Tôi đồng ý với Chính sách bảo mật | bắt buộc |
| consentRecycle | I understand that clothes unfit to wear may be recycled into textile for Refvlks products. | Tôi hiểu rằng quần áo không còn mặc được có thể được tái chế thành vải cho sản phẩm của Refvlks. | bắt buộc khi quyên góp |

Câu hỏi nhanh (accordion, 3 câu):

| Q (EN) | A (EN) | Q (VI) | A (VI) | Điều kiện |
|---|---|---|---|---|
| Can I donate torn or faded clothes? | Yes. They won't go up the mountain, but they will become recovered textile in our bags. | Tôi có thể gửi quần áo rách hoặc bạc màu không? | Có. Chúng sẽ không được mang lên vùng cao, nhưng sẽ trở thành vải tái chế trong túi của chúng tôi. | |
| Do you sell the clothes we donate? | No. Wearable clothes are given away for free. Only pieces too worn to wear are recycled into fabric, and that fabric is used in Refvlks bags. | Refvlks có bán quần áo quyên góp không? | Không. Quần áo còn mặc được đều được tặng miễn phí. Chỉ những chiếc quá cũ mới được tái chế thành vải, và vải đó được dùng trong túi Refvlks. | |
| Where do the clothes go? | Each drive goes to a community in the Northwest or another mountain region. After every trip we post where we went and what we delivered. | Quần áo được mang đi đâu? | Mỗi chuyến đến một cộng đồng ở Tây Bắc hoặc vùng núi khác. Sau mỗi chuyến, chúng tôi đăng nơi đã đến và những gì đã trao. | Ẩn khi CL-23 pending |

### 3.6 ABOUT (3 section) · `/en/about` · `/vi/ve-chung-toi`

SEO giữ như 04 mục 5.

**AB-01 · Why we started** · key `about.why` · Ảnh LIFE-01 (parallax E8) · Hiệu ứng E5, E7, E8

| EN | VI |
|---|---|
| H1: Why we started Refvlks. | Vì sao chúng tôi làm Refvlks. |
| Two things kept coming up. Donated clothes left in piles by the roadside in Ky Son, Nghe An, because nobody had asked what was needed. And skilled weavers with fewer orders every year. We could not fix either alone, but we could make something people actually want to carry, and build it from both. | Có hai điều cứ lặp lại. Quần áo quyên góp bị bỏ thành đống bên đường ở Kỳ Sơn, Nghệ An, vì không ai hỏi người dân thực sự cần gì. Và những người thợ dệt giỏi có ít đơn hàng hơn mỗi năm. Chúng tôi không thể tự giải quyết cả hai, nhưng có thể làm ra thứ người ta thật sự muốn mang theo, và làm nó từ cả hai. |
| Nguồn (link nhỏ): Doãn Hòa, 2022 | |

**AB-02 · What we promise** · key `about.promises` · Ảnh: SP01-06, SP01-05, (thẻ 3 dùng pattern + icon Truck) · Hiệu ứng E12 (3 thẻ xếp chồng), E7 · Claim CL-17, CL-21

| Thẻ | EN | VI |
|---|---|---|
| H2 | What we promise. | Điều chúng tôi cam kết. |
| 1 | **Built for work first.** A bag has to carry your day before it can carry a story. | **Làm để đi làm trước tiên.** Một chiếc túi phải mang được ngày làm việc của bạn trước khi mang một câu chuyện. |
| 2 | **Recovered textile, where it counts.** 30% of every bag, from handles to scarves, measured by textile weight. | **Vải tái chế, đúng chỗ.** 30% mỗi chiếc túi, từ quai đến khăn, tính theo khối lượng vải. |
| 3 | **Clothes that reach people.** Every month, wearable clothes go to mountain communities; the rest becomes our fabric. | **Áo quần đến đúng người.** Mỗi tháng, quần áo còn mặc tốt được mang lên vùng cao; phần còn lại thành vải của chúng tôi. |
| Chú thích tên | Say it "re·folks". | Đọc là "re·folks". |

**AB-03 · What comes next** · key `about.next` · Ảnh LIFE-06 · Hiệu ứng E7, E5, E17

| EN | VI |
|---|---|
| H2: What comes next. | Tiếp theo là gì. |
| QR codes that trace every bag to its batch. Accessories made entirely from recovered textile. More drives, to more communities. These are plans, and we will show them here when they are real. | Mã QR truy xuất từng chiếc túi về lô sản xuất. Phụ kiện làm hoàn toàn từ vải tái chế. Thêm nhiều chuyến quyên góp, đến thêm nhiều cộng đồng. Đây là kế hoạch, và chúng tôi sẽ cho bạn thấy ở đây khi chúng thành hiện thực. |
| CTA: Shop the collection · Join the donation event | Xem bộ sưu tập · Tham gia quyên góp |

Section đội ngũ (AB-04 cũ) bỏ khỏi MVP.

### 3.7 VISIT THE STUDIO (3 section) · `/en/studio` · `/vi/studio`

SEO giữ như 04 mục 6.

**ST-01 · Try it before you decide** · key `studio.hero` · Ảnh LIFE-04 · Hiệu ứng E5, E7

| EN | VI |
|---|---|
| H1: Try it on before you decide. | Đeo thử rồi hãy quyết định. |
| Sub: 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. Every day, 8:00 to 21:30, by appointment. | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. Mở cửa hằng ngày, 8:00 đến 21:30, theo lịch hẹn. |
| 3 ý: Bring your laptop and what you carry every day. · Take your time; there is no pressure to buy. · Pay by cash or bank transfer at the studio. | Mang theo laptop và đồ dùng hằng ngày. · Cứ thong thả, không ai ép mua. · Thanh toán bằng tiền mặt hoặc chuyển khoản tại studio. |
| CTA: Book a visit → `#book` | Đặt lịch |

**ST-02 · Book a visit** · `#book` · key `studio.form` · Hiệu ứng E5, E17
Form như 04 mục 6 (khung 30 phút, lượt đầu 8:00, lượt cuối 21:00).

**ST-03 · Hours and location** · key `studio.location` · Hiệu ứng E7, E13 · Claim CL-13, CL-22

| EN | VI |
|---|---|
| H2: Find us. | Tìm chúng tôi. |
| 22 Le Quy Don, Hai Ba Trung Ward, Hanoi · Open every day, 8:00 to 21:30, by appointment · Open in Google Maps | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội · Mở cửa hằng ngày, 8:00 đến 21:30, theo lịch hẹn · Mở Google Maps |
| Khi CL-22 approved: Bringing clothes for the donation drive? You can drop them off during your visit. | Mang quần áo cho chuyến quyên góp? Bạn có thể gửi khi ghé studio. |

Bản đồ: ảnh tĩnh vẽ bằng SVG cách điệu (đường phố dạng Weft lines, một chấm Cinnabar) + nút mở Google Maps; không nhúng iframe bản đồ.

---

## 4. Dữ liệu và kỹ thuật bổ sung

| Hạng mục | Chi tiết |
|---|---|
| `src/content/donation-events.json` | `nextEvent { date, collectionWindow{en,vi}, destination{en,vi}, status }`, `pastEvents[]` (date, destination, kgCollected, piecesDelivered, kgRecycled, photos[]), `impact` tổng. Giá trị null → UI ẩn trường đó |
| Bảng `donation_signups` (Supabase) | id, name, phone, email, role (`donate`/`volunteer`/`both`), amount, note, consent_privacy, consent_recycle, locale, event_id, status (`new`/`contacted`/`dropped_off`), created_at. Adapter local ghi vào `.data/` |
| Bảng `donation_events` (Supabase) | Như cấu trúc JSON; chỉ owner sửa |
| Form | Server Action `registerDonation`; bẫy bot; 3 lần/giờ mỗi IP; email cho admin qua Resend |
| CMS | Slice mới **C7 Donation**: tạo và công bố chuyến (ngày, thời gian nhận đồ, điểm đến), danh sách người đăng ký và trạng thái, nhập số liệu sau chuyến, ảnh tổng kết, duyệt claim CL-20, CL-23 |
| Hotspot | Thêm trường `hotspots: [{part, x, y}]` cho mỗi sản phẩm trong `products.seed.json` (toạ độ mục 3.3) |
| Thư viện | `next-view-transitions` (E3), plugin GSAP Flip, DrawSVGPlugin, Observer, CustomEase (đều trong gói `gsap`) |
| SEO | Trang Donation Event: JSON-LD `Event` chỉ khi `nextEvent.date` có giá trị (eventAttendanceMode offline, location theo `destination`); thêm vào sitemap cả 2 locale |
| Email | Thư xác nhận đăng ký quyên góp (khi có email): tiêu đề "You're on the list for the next drive" / "Bạn đã đăng ký chuyến quyên góp tới" |

---

## 5. Claims mới (đã thêm vào 02 mục 6 và `claims.ts`)

| Mã | Tuyên bố | Trạng thái | Điều kiện |
|---|---|---|---|
| CL-17 | Monthly donation trips to the Northwest and other mountain regions | approved | Chủ dự án (D18) |
| CL-18 | Every donated piece is checked by our team | approved | Chủ dự án (D18) |
| CL-19 | Needs are checked with local partners before each trip | pending | Có đối tác và quy trình hỏi nhu cầu |
| CL-20 | Impact numbers (kg collected, pieces delivered, kg recycled) | pending | Có số liệu chuyến đầu tiên |
| CL-21 | Clothes unfit to wear become recovered textile in Refvlks bags | approved | Chủ dự án (D18) |
| CL-22 | Drop-off at the studio during collection week | pending | Chủ dự án xác nhận nhận đồ tại studio |
| CL-23 | Destinations and results posted after every trip | pending | Đội ngũ cam kết đăng tổng kết |

---

## 6. Acceptance bổ sung

- [ ] Menu có 5 mục, Donation Event ở cả `/en/donation-event` và `/vi/su-kien-quyen-gop`, có trong sitemap.xml.
- [ ] Home đúng 5 section (H-01 đến H-05); Shop, Product, Craft, Donation Event, About, Studio mỗi trang 3 section (không tính header, footer).
- [ ] Mọi hiệu ứng E1 đến E21 được dùng đúng trang theo mục 2.3 và có hành vi `lite`, `off`; Playwright ở chế độ reduced motion không thấy animation lặp, không ghim, không Lenis.
- [ ] Mỗi trang tối đa 2 section ghim (Home) hoặc 1 (trang khác); cuộn bằng bàn phím (Space, PageDown) đi qua section ghim bình thường.
- [ ] E3: mở sản phẩm từ thẻ có chuyển cảnh ảnh trên Chrome; trình duyệt không hỗ trợ dùng E2; back/forward không để lại overlay.
- [ ] Form Donation Event lưu được ở adapter local; bắt buộc đồng ý tái chế khi chọn quyên góp; thông báo thành công đọc được bởi trình đọc màn hình.
- [ ] Không có số liệu tác động, ngày, điểm đến hay câu hỏi CL-23 khi dữ liệu hoặc claim chưa có.
- [ ] Trang Donation Event không dùng ảnh người mẫu như ảnh chuyến đi.
- [ ] Ngân sách: LCP < 2.5s, CLS < 0.1, INP < 200ms, JS ban đầu ≤ 220KB gzip trên Home, Shop, Product, Donation Event.

---

## 7. Kế hoạch slice V2 (thay 08 mục 12 phần frontend)

| Slice | Phạm vi | Ghi chú |
|---|---|---|
| F1 Foundation | Như 08, thêm nav 5 mục và route Donation Event (trang trống có H1) | |
| F2 Data | Như 08, thêm `donation-events.json`, interface `getDonationEvent`, `registerDonation`, `hotspots` trong seed | |
| F3 Shell + Home H-01, H-03 | Header (E6), footer kéo rèm (E20), hero (E8), lưới sản phẩm (E16) | |
| F4 Product + giỏ | P-01 đến P-03 (E21 hotspot, E15 bay vào giỏ), cart | |
| F5 Motion v2 core | Preloader E1, curtain E2, View Transitions E3, Lenis + thanh tiến trình E4, SplitText E5, cursor E18, magnetic E17; H-02 Reveal (E9) | |
| F6 Home H-04, H-05 | Gallery ngang ghim E10, đổi nền E19 | |
| F7 Shop | S-01 đến S-03 (E11 marquee, E15 Flip) | |
| F8 Checkout | Như 08 F7 | |
| F9 Studio + Contact | Như 08 F8 với cấu trúc 3 section mới | |
| F10 Craft + About | Cấu trúc 3 section mới (E12, E13, E14) | |
| F11 Donation Event | DE-01 đến DE-03, form, email, JSON-LD Event | Mới |
| F12 Help, Legal, 404 | Như 08 F9 | |
| F13 SEO + analytics | Như 08 F10, thêm trang mới | |
| F14 QA tổng | Như 08 F11, thêm acceptance mục 6 | |

CMS: C1 đến C6 như 08, thêm **C7 Donation**.

**Nếu Codex đã làm xong một số slice theo kế hoạch cũ:** giữ phần đã đạt, ánh xạ sang bảng trên, bổ sung phần thiếu (cấu trúc section mới, hiệu ứng mới, Donation Event) trong slice tương ứng, ghi rõ trong `docs/PROGRESS.md`.

---

## 8. Việc còn mở của V2

| Nội dung | Người cung cấp |
|---|---|
| Ngày cố định trong tháng (hoặc lịch từng tháng), thời gian nhận đồ, điểm đến từng chuyến | Chủ dự án |
| Có nhận đồ tại studio không (CL-22) | Chủ dự án |
| Đối tác địa phương và quy trình hỏi nhu cầu (CL-19) | Chủ dự án |
| Ảnh thật sau chuyến đầu tiên: ưu tiên ảnh tay, quần áo, cảnh vật, đội ngũ; ảnh người nhận chỉ khi có đồng ý, trẻ em cần đồng ý của người giám hộ | Chủ dự án |
| Số liệu sau mỗi chuyến (CL-20) | Chủ dự án |
