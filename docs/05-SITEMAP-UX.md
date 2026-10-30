# 05 · SITEMAP & UX

> **Cập nhật V2 (30/10/2026):** một số phần của file này đã được thay bằng `docs/10-UPDATE-V2.md` (xem mục 0 của file đó). Khi khác nhau, làm theo docs/10.

## 1. Quy ước URL

- `/` chuyển về `/en`. Không tự đổi ngôn ngữ theo trình duyệt; trình duyệt tiếng Việt thấy dải gợi ý "Xem trang bằng tiếng Việt?".
- Trang tĩnh có slug riêng từng ngôn ngữ (tiếng Việt không dấu). Sản phẩm dùng chung handle tiếng Anh ở cả hai ngôn ngữ.
- Mỗi trang có `hreflang` en/vi và `x-default` → bản EN. Trang lọc theo tầng (`/shop?tier=`) canonical về `/shop`.
- `robots.txt` chặn `/admin`, `/*/cart`, `/*/checkout`, `/*/order/`.
- Không có tài khoản khách hàng ở MVP.

## 2. Cây sitemap

```
refvlks (tên miền: CẦN BỔ SUNG)
│
├─ /en (mặc định)                                   /vi
│  ├─ Home ...................... /en                /vi                               [MVP]
│  ├─ Shop ...................... /en/shop           /vi/cua-hang                      [MVP]
│  │    lọc tầng: ?tier=essential | signature | heritage (không phải trang riêng)
│  ├─ Product (template) ........ /en/products/{h}   /vi/san-pham/{h}                  [MVP]
│  │    weft-structured-tote · loom-flap-tote (?colour=forest|wine)
│  │    loom-carryall · tram-shopper   (5 mẫu = 5 thẻ trên lưới)
│  ├─ Craft & materials ......... /en/craft          /vi/thu-cong                      [MVP]
│  ├─ About ..................... /en/about          /vi/ve-chung-toi                  [MVP]
│  ├─ Visit the studio .......... /en/studio         /vi/studio                        [MVP]
│  ├─ Cart (+ ngăn kéo) ......... /en/cart           /vi/gio-hang                      [MVP]
│  ├─ Checkout .................. /en/checkout       /vi/thanh-toan                    [MVP]
│  │  └─ Card preview ........... /en/checkout/card  /vi/thanh-toan/the                [MVP]
│  ├─ Order confirmation ........ /en/order/{token}  /vi/don-hang/{token}              [MVP]
│  ├─ Help
│  │  ├─ Size & fit ............. /en/help/size-fit          /vi/ho-tro/kich-thuoc     [MVP]
│  │  ├─ Shipping & returns ..... /en/help/shipping-returns  /vi/ho-tro/giao-hang-doi-tra [MVP]
│  │  ├─ Care & repair .......... /en/help/care-repair       /vi/ho-tro/bao-quan-sua-chua [MVP]
│  │  ├─ FAQ .................... /en/help/faq               /vi/ho-tro/cau-hoi        [MVP]
│  │  └─ Contact ................ /en/contact                /vi/lien-he               [MVP]
│  ├─ Legal
│  │  ├─ Privacy ................ /en/legal/privacy          /vi/phap-ly/bao-mat       [MVP]
│  │  ├─ Terms of sale .......... /en/legal/terms            /vi/phap-ly/dieu-khoan    [MVP]
│  │  └─ Payment ................ /en/legal/payment          /vi/phap-ly/thanh-toan    [MVP]
│  ├─ Collection pages .......... /en/collections/{tier}     /vi/bo-suu-tap/{tier}     [P2: khi mỗi tầng ≥ 3 mẫu]
│  ├─ Order status lookup ....... /en/order-status           /vi/tra-cuu-don           [P2]
│  ├─ Batch trace (QR) .......... /en/trace/{batch}          /vi/truy-xuat/{batch}     [P2]
│  ├─ Corporate gifts ........... /en/corporate-gifts        /vi/qua-tang-doanh-nghiep [P2]
│  ├─ Journal ................... /en/journal                /vi/nhat-ky               [P2]
│  └─ 404
│
└─ /admin (CMS, đăng nhập, noindex) .................................................... [sau frontend]
```

## 3. Mục đích từng trang

| Trang | Mục đích | Đối tượng | CTA chính |
|---|---|---|---|
| Home | Hiểu sản phẩm trong 5 giây; khoảnh khắc mở túi; dẫn vào Shop | P1, P2 lần đầu | Shop the collection |
| Shop | Xem 5 mẫu (mỗi màu một thẻ), lọc theo tầng, màu, giá | Khách có ý định | Mở sản phẩm |
| Product | Thuyết phục và chốt | Mọi khách mua | Add to bag |
| Craft | Bằng chứng cho giá và cho câu chuyện vật liệu | P2 hoài nghi, P1 quan tâm văn hóa | Shop Heritage |
| About | Lý do tồn tại | Khách tìm hiểu, đối tác | Shop the collection |
| Studio | Đặt lịch xem và thử túi | P1 expat | Book a visit |
| Cart, Checkout | Hoàn tất đơn | Khách mua | Place order |
| Card preview | Báo thanh toán thẻ sắp có, đưa khách về COD/chuyển khoản | Khách quen trả thẻ | Back to checkout |
| Order confirmation | Xác nhận; hướng dẫn chuyển khoản | Khách vừa đặt | Continue shopping |
| Help, Legal | Gỡ lo ngại, đáp ứng pháp lý | Khách đang phân vân | Quay lại mua |

## 4. Luồng chính

**F1 · Mua hàng**
```
Mạng xã hội / nhóm expat / tìm kiếm
  → Home → Shop → Product → Add to bag → Cart drawer → Checkout
      ├─ COD ............ → Confirmation → Studio gọi/nhắn xác nhận → Gửi hàng → Kiểm hàng → Trả tiền
      ├─ Chuyển khoản ... → Confirmation + VietQR → Admin thấy tiền về → Gửi hàng
      └─ Thẻ (khóa) ..... → Card preview → quay lại chọn COD hoặc chuyển khoản
```

**F2 · Khách hoài nghi (P2)**
`Product → P-03 Materials → Craft → Shipping & returns → Product → Add to bag`. Link Craft và đổi trả đặt ngay trong buy box và P-03, không giấu ở footer.

**F3 · Expat thử trước khi mua (P1)**
`Product (EN) → "Try it at the studio" → Studio form (mẫu túi chọn sẵn) → Studio xác nhận qua điện thoại/Zalo → Thử túi → Nhân viên tạo đơn thủ công trong /admin/orders/new`

**F4 · Vận hành**
`Đăng nhập admin → Đơn mới → Gọi xác nhận COD hoặc đối chiếu tiền chuyển khoản → Đổi trạng thái → Đã gửi → Đã giao → Dashboard cập nhật doanh thu`

## 5. Menu

**Desktop (≥ 1024px):** `[Refvlks]  Shop ▾  Craft  About  Visit the studio      EN | VI   Bag (2)`. Shop mở panel nhỏ: All bags · Heritage · Signature · Essential, mỗi mục kèm ảnh thẻ 1 mẫu.

**Mobile (< 1024px):** `[☰]  [Refvlks]  [Bag (2)]`. Panel trượt từ trái: Shop (mở rộng 4 mục) · Craft & materials · About · Visit the studio · đường kẻ · Help · Contact · EN | VI.

**Footer:** 4 cột (Shop, Refvlks, Help, Legal) + dòng thông tin doanh nghiệp + phương thức thanh toán.

## 6. UX blueprint theo breakpoint

| Template | 360 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| Header | Logo giữa, menu và giỏ hai bên, cao 56px | Như 360 | Như 360, cao 64px | Menu ngang đầy đủ | Như 1024, container 1280px |
| Home H-01 | Ảnh 4:5 trên, chữ dưới, H1 40px, 2 CTA xếp dọc rộng 100% | Như 360, CTA rộng 100% | Ảnh 3:2 tràn, chữ đè vùng trống bên trái | Ảnh 16:9 cao 100vh, chữ trái | Như 1024, H1 80px |
| Home H-02 | 3 thẻ dọc (khung 01, 05, 08) | Như 360 | 3 thẻ dọc, ảnh 3:2 | Ghim, chuỗi 8 khung | Như 1024 |
| Shop | Lưới 2 cột, gap 12px, lọc ở ngăn kéo đáy | Lưới 2 cột, gap 16px | Lưới 3 cột | Lưới 3 cột, thanh lọc ngang | Lưới 4 cột |
| Product | Gallery vuốt ngang (scroll-snap) + chấm vị trí, thông tin dưới, thanh mua cố định đáy | Như 360 | Gallery trên, thông số 2 cột | 2 cột: gallery 7/12 cuộn, thông tin 5/12 sticky | Như 1024 |
| Checkout | 1 cột, tóm tắt đơn thu gọn ở đầu | Như 360 | 1 cột rộng 640px giữa | 2 cột: form 7/12, tóm tắt 5/12 sticky | Như 1024 |
| Studio form | 1 cột | 1 cột | 2 cột cho Date/Time | Form 6/12 + địa chỉ 6/12 | Như 1024 |
| Admin | Chỉ xem đơn, đổi trạng thái | Như 360 | Đầy đủ, sidebar thu gọn | Sidebar mở | Như 1024 |

Độ dài dòng nội dung tối đa 68 ký tự (`max-width: 68ch`). Container tối đa 1280px nội dung, ảnh tràn được tới 1440px.

## 7. Trạng thái trống và lỗi theo trang

| Trang | Trạng thái |
|---|---|
| Shop | Không có sản phẩm khớp bộ lọc · Lỗi tải: thông báo + nút thử lại |
| Product | Hết hàng mọi màu: nút Sold out + link hỏi đợt tới · Handle không tồn tại: 404 |
| Cart | Giỏ trống · Sản phẩm hết hàng trong giỏ: gạch và báo |
| Checkout | Lỗi từng ô · Hết hàng giữa chừng · Lỗi đặt đơn |
| Order | Token sai hoặc hết hạn: "We can't find this order. Check the link in your message." |
| Studio | Khung giờ đã kín: disabled · Gửi lỗi: gợi ý liên hệ trực tiếp khi có số điện thoại |

## 8. CMS `/admin`

Cấu trúc theo cách Shopify admin chia khu vực, giao diện theo design system Refvlks.

```
/admin
├─ /login .................. Email + mật khẩu (Supabase Auth)
├─ / (Home) ................ Doanh thu hôm nay / 7 / 30 ngày, số đơn, giá trị đơn trung bình,
│                            đơn chờ xác nhận COD, đơn chờ tiền chuyển khoản, sắp hết hàng,
│                            sản phẩm bán chạy, phễu: lượt xem sản phẩm → đơn đặt → đơn đã thanh toán
├─ /orders ................. Danh sách, lọc theo trạng thái, phương thức, kênh (web / studio)
│  ├─ /orders/{id} ......... Chi tiết, đổi trạng thái, ghi chú nội bộ, in phiếu giao
│  └─ /orders/new .......... Tạo đơn thủ công (bán tại studio)
├─ /products ............... Danh sách, lọc tầng, trạng thái nháp / đang bán / ẩn
│  ├─ /products/new
│  └─ /products/{id} ....... Tên + mô tả EN/VI, ảnh (kéo thả, sắp xếp, vai trò ảnh, alt EN/VI),
│                            biến thể màu, giá, SKU, tồn kho, tầng, vật liệu theo bộ phận,
│                            thông số, chi tiết dệt và ghi nhận nghệ nhân, SEO title/description
├─ /inventory .............. Tồn kho theo biến thể, cảnh báo ≤ 2
├─ /customers .............. Khách sinh ra từ đơn hàng (chỉ vai trò Owner xem số điện thoại đầy đủ)
├─ /analytics .............. Doanh thu theo ngày, sản phẩm, tầng, phương thức thanh toán, kênh
├─ /studio-visits .......... Lịch hẹn: xác nhận, đổi giờ, hủy, đánh dấu đã đến
├─ /messages ............... Tin nhắn từ form Contact, lọc theo chủ đề, trạng thái đã xử lý
├─ /settings
│  ├─ /store ............... Tên, pháp nhân, người đại diện, liên hệ, giờ mở cửa (mặc định 8:00 đến 21:30 hằng ngày)
│  ├─ /payments ............ COD bật/tắt, giới hạn COD, ngân hàng (Techcombank, BIN 970407), số tài khoản, hạn chuyển khoản
│  ├─ /shipping ............ Vùng và phí
│  ├─ /claims .............. Duyệt trạng thái tuyên bố CL-xx (chỉ Owner)
│  └─ /staff ............... Tài khoản và vai trò (Owner, Staff)
└─ [P2] /content · /discounts · /batches (lô sản xuất, mã QR)
```

**Trạng thái đơn:** `pending_payment` (chuyển khoản) | `pending_confirmation` (COD) → `confirmed` → `packed` → `shipped` → `delivered`; nhánh `cancelled`, `returned`. Doanh thu chỉ tính đơn `delivered` (COD đã thu tiền) và đơn chuyển khoản đã ghi nhận tiền.
