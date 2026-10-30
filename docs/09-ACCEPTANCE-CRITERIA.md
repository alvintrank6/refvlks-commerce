# 09 · ACCEPTANCE CRITERIA

> **Cập nhật V2 (30/10/2026):** một số phần của file này đã được thay bằng `docs/10-UPDATE-V2.md` (xem mục 0 của file đó). Khi khác nhau, làm theo docs/10.

Không slice nào được coi là xong khi chưa có bằng chứng (lệnh đã chạy, kết quả, ảnh chụp màn hình) cho các tiêu chí liên quan.

## 1. Mọi slice

- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` thoát mã 0.
- [ ] Kiểm tra ở 360, 390, 768, 1024, 1440 px: không tràn ngang, không cắt chữ (kể cả chữ tiếng Việt có dấu chồng).
- [ ] Mọi chuỗi giao diện nằm trong `messages/en.json` và `vi.json`; không hard-code.
- [ ] Không có màu hoặc px rời ngoài token.
- [ ] Không render tuyên bố pending; HTML không chứa `[CẦN`, `[x]`, `{group}`, `TODO`.
- [ ] Ảnh lấy từ `assets.json` hoặc Storage, có width, height, alt theo locale.
- [ ] Logo là SVG trong `public/brand/`; không có logo dạng chữ gõ bằng font hoặc ảnh bitmap.
- [ ] `npm run build` và `npm run dev` chạy được khi chưa có biến môi trường Supabase (DATA_SOURCE=local).

## 2. Nội dung và tính trung thực

- [ ] Giá, tên, mô tả, ảnh mỗi sản phẩm khớp 02-CONTENT-SOURCE và database.
- [ ] Không có từ "leather" / "da" mô tả bất kỳ bộ phận nào; nhãn chất liệu từng mẫu khớp 02 mục 5.
- [ ] Thông tin thanh toán hiển thị đúng: Techcombank, NGUYEN TUNG ANH (Refvlks), 19070671343017; VietQR có số tiền và nội dung đúng đơn.
- [ ] Địa chỉ studio đúng: 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội; giờ 8:00 đến 21:30 hằng ngày; ghi rõ "theo lịch hẹn".
- [ ] Footer có người đại diện Nguyễn Tùng Anh; trường pháp nhân còn thiếu không hiện chuỗi rỗng.
- [ ] Trang thẻ: không ô nào nhập được; không có request mạng nào chứa dữ liệu thẻ.

## 3. Theo trang

| Trang | Tiêu chí |
|---|---|
| Home | H1 + 2 CTA đọc được khi tắt JS; H-02 có link Skip và bản 3 thẻ cho mobile/reduced; H-06 ẩn khi CL-04 pending |
| Shop | Đúng 5 thẻ (mỗi màu một thẻ); lọc tầng và sắp xếp chạy khi tắt JS; trạng thái trống có nút xóa lọc |
| Product | Gallery đúng thứ tự 03 mục 4; SP02 đổi màu đổi gallery và URL; P-02 ẩn hàng thiếu dữ liệu; P-04 chỉ hiện khi có ảnh bên trong; thanh mua cố định trên mobile |
| Cart | Thêm, đổi số lượng, xóa, hoàn tác; giới hạn theo tồn kho |
| Checkout | Lỗi từng ô có aria-live; COD ẩn khi > 2 sản phẩm; đặt đơn thành công tạo đơn đúng giá DB và trừ kho; đặt đơn thất bại không trừ kho |
| Order | Token sai trả trang "không tìm thấy"; chuyển khoản hiện số tiền, nội dung, nút Copy; nút "I've made the transfer" ghi `customer_marked_paid_at` |
| Studio | Khung 30 phút từ 8:00, lượt cuối 21:00; khung đã xác nhận bị disabled; `?bag=` chọn sẵn mẫu |
| Contact | Tin lưu vào `messages`, admin nhận email |
| Help, Legal | Con số chính sách lấy từ `policy.ts`; bản EN có dòng "Vietnamese version applies" |

## 4. Ma trận QA (slice F11)

| Nhóm | Kiểm tra | Đạt khi |
|---|---|---|
| Build | install, lint, typecheck, test, build | Mã 0, không cảnh báo nghiêm trọng; chạy được trên Windows PowerShell |
| Thương hiệu | Favicon, apple icon, manifest, ảnh OG từng trang | Hiển thị đúng; OG có wordmark và ảnh sản phẩm |
| Responsive | 360×800, 390×844, 768×1024, 1024×768, 1440×900 | Đúng 05 mục 6 |
| Trình duyệt | Chrome/Edge, Safari/WebKit (cả iOS), Firefox | Điều hướng, giỏ, checkout, motion cốt lõi chạy |
| Accessibility | Bàn phím toàn trang, focus-visible, label, tương phản, axe | 0 lỗi nghiêm trọng |
| Motion | 07 mục 10, chạy ở 2 chế độ motion | Không kẹt opacity 0, không overlay treo, không trigger trùng |
| Nội dung | EN/VI, dấu tiếng Việt, chuỗi dài, link, số điện thoại | Không thiếu, không cắt |
| Hiệu năng | Lighthouse mobile (4G, CPU 4×) trang Home, Shop, Product | LCP < 2.5s, CLS < 0.1, INP < 200ms, JS ban đầu ≤ 200KB gzip |
| CRO | Đường từ Home tới đặt đơn ≤ 5 bước; CTA chính luôn thấy trên mobile | |
| Bảo mật | RLS: ẩn danh không đọc được đơn, lịch hẹn, tin nhắn; service role chỉ ở server | |

## 5. Ngân sách hiệu năng

| Hạng mục | Giới hạn |
|---|---|
| Ảnh hero desktop / mobile (AVIF) | 180KB / 120KB |
| Mỗi khung REVEAL | 90KB (tổng 8 khung ≤ 720KB, tải muộn) |
| Ảnh thẻ sản phẩm (card) | 60KB |
| Ảnh gallery | 150KB |
| Ảnh lifestyle | 140KB |
| Tổng tải ban đầu trang chủ trước khi cuộn | ≤ 1MB |
| Font | 3 họ, subset latin + vietnamese, chỉ preload Fraunces (H1) và Be Vietnam Pro 400 |

Bộ ảnh hiện tại đã đạt các giới hạn trên (xem 03-ASSET-MANIFEST).

## 6. Cổng ra mắt (pre-launch)

- [ ] Tên miền, HTTPS, chuyển hướng www, canonical đúng tên miền.
- [ ] Thông tin pháp nhân đầy đủ ở footer và Điều khoản.
- [ ] Đã thông báo website thương mại điện tử theo quy định [CẦN XÁC NHẬN thủ tục].
- [ ] Chủ dự án duyệt giá, tên sản phẩm, toàn bộ con số chính sách.
- [ ] Chính sách đã được rà soát pháp lý.
- [ ] Quét thử VietQR bằng app Techcombank và một app ngân hàng khác: đúng người nhận, số tiền, nội dung.
- [ ] Đơn vị vận chuyển và phí đã chốt.
- [ ] Đặt thử 1 đơn COD và 1 đơn chuyển khoản trên production, hủy và hoàn kho.
- [ ] Email giao dịch đến hộp thư thật (không vào spam).
- [ ] Chất liệu hiển thị (02 mục 5) khớp mẫu sản xuất thật của cả 5 mẫu.
- [ ] Có kế hoạch rollback (Vercel promote bản trước).

## 7. Definition of Done của dự án

100% nội dung bắt buộc có mặt, đúng ngôn ngữ · mọi route, CTA, form, trạng thái lỗi hoạt động · responsive qua ma trận viewport · motion đúng spec, có reduced motion, không kẹt giao diện · accessibility, SEO, hiệu năng đạt ngân sách · production build đã kiểm · README và HANDOVER đầy đủ · điểm chưa hoàn tất được ghi rõ.
