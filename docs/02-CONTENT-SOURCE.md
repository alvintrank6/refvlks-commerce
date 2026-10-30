# 02 · CONTENT SOURCE

Nguồn sự thật cho mọi dữ kiện hiển thị trên website. Code đọc dữ kiện từ `src/content/site.ts`, `src/content/claims.ts` và database; các file đó phải khớp với tài liệu này.

Trạng thái: **verified** (chủ dự án đã xác nhận) · **assumed** (giả định, chờ duyệt) · **missing** (chưa có) · **approved / pending** (dành cho tuyên bố, xem mục 6).

## 1. Thương hiệu và pháp lý

| Trường | Giá trị | Trạng thái |
|---|---|---|
| Tên hiển thị | Refvlks | verified |
| Cách đọc | "re·folks" | assumed |
| Tagline | Quiet on the outside. A story on the inside. | assumed |
| Người đại diện | Nguyễn Tùng Anh | verified |
| Tên pháp nhân, mã số thuế, địa chỉ đăng ký | | missing |
| VAT trong giá, hóa đơn điện tử | | missing |
| Tên miền | | missing |
| Điện thoại / Zalo, email, Instagram, Facebook, TikTok | | missing |

## 2. Studio

| Trường | Giá trị | Trạng thái |
|---|---|---|
| Tên hiển thị | Refvlks Studio | assumed |
| Địa chỉ (VI) | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội | verified |
| Địa chỉ (EN) | 22 Le Quy Don, Hai Ba Trung Ward, Hanoi | verified |
| Hình thức | Chỉ theo lịch hẹn | verified |
| Giờ mở cửa | 08:00 đến 21:30 | verified |
| Ngày mở cửa | Tất cả các ngày trong tuần | verified |
| Khung giờ đặt lịch | 30 phút một lượt, lượt đầu 08:00, lượt cuối bắt đầu 21:00 | assumed |
| Thanh toán tại studio | Tiền mặt, chuyển khoản | assumed |

## 3. Thanh toán

| Trường | Giá trị | Trạng thái |
|---|---|---|
| Phương thức | COD; chuyển khoản; thẻ = bản xem trước, không nhận thanh toán | verified |
| Người thụ hưởng | NGUYEN TUNG ANH | verified |
| Số tài khoản | 19070671343017 | verified |
| Ngân hàng | Techcombank (Ngân hàng TMCP Kỹ Thương Việt Nam), mã BIN 970407 | verified (BIN theo danh sách mã định danh ngân hàng của Ngân hàng Nhà nước) |
| Mã QR | VietQR tạo tự động cho từng đơn: BIN 970407 + số tài khoản + số tiền + nội dung | assumed (cách làm) |
| Nội dung chuyển khoản | Mã đơn, dạng `RV1024` | assumed |
| Hạn chuyển khoản | 24 giờ | assumed |

Hiển thị người thụ hưởng ở checkout và trang xác nhận đơn dạng: **NGUYEN TUNG ANH (Refvlks)**, kèm một dòng giải thích: tài khoản đứng tên người đại diện của Refvlks. Mục đích: khách không nghi ngờ khi tên người nhận khác tên thương hiệu.

## 4. Sản phẩm

Giá, tên sản phẩm và tầng giá là **assumed**. Hình dáng và màu sắc lấy từ bộ ảnh chính thức (**verified**).

| Mã | Handle | Tên | Tầng | Giá (VND) | Màu | Ảnh |
|---|---|---|---|---|---|---|
| SP01 | weft-structured-tote | Weft Structured Tote | Heritage | 1.890.000 | Brown | Đủ: mặt trước, 3/4, bên trong, mở nắp, chi tiết khóa, tay cầm, người mẫu, phố, chuỗi 8 khung |
| SP02 | loom-flap-tote | Loom Flap Tote | Signature | 1.590.000 | Forest, Wine (2 biến thể) | Mặt trước mỗi màu + người mẫu |
| SP03 | loom-carryall | Loom Carryall | Signature | 1.590.000 | Black / Cinnabar | Mặt trước + 5 ảnh người mẫu |
| SP04 | tram-shopper | Trám Shopper | Essential | 1.290.000 | Cream / Brown | Mặt trước + 2 ảnh người mẫu |

Ra mắt với **5 mẫu** (verified): 4 thiết kế, Loom Flap Tote có 2 màu. Lưới Home và Shop hiển thị 5 thẻ, mỗi màu một thẻ; hai thẻ Loom Flap Tote cùng dẫn về một trang sản phẩm với `?colour=forest|wine`. Code vẫn phải chạy đúng với số sản phẩm bất kỳ.

### Mô tả hình dáng (từ ảnh, verified)

- **SP01 Weft Structured Tote:** phom cứng hình thang, rộng hơn cao, hai cánh hông xòe. Nắp gập nâu sẫm có dải ngang màu nâu bò và khóa cài chữ nhật lớn màu đồng. Thân dưới phủ hoa văn mắt lưới hình thoi màu caramel trên nền nâu cà phê. Hai quai tròn nâu sẫm. Lót thổ cẩm nhiều màu (xanh, vàng đất, kem, đen).
- **SP02 Loom Flap Tote:** miệng loe, thân thu về đáy phẳng. Nắp tab nhỏ nâu sẫm ở giữa miệng với nút bấm tròn màu kim loại sáng. Dải hoa văn dệt ở khoảng một phần ba thân dưới, ngăn bằng một đường kẻ ngang. Forest: thân xanh rừng, dải hoa văn kem. Wine: thân đỏ rượu, dải hoa văn cùng tông.
- **SP03 Loom Carryall:** thân đen lì, miệng loe. Nắp tab đỏ son có nút bấm tròn. Mảng vải dệt tam giác nhiều màu (đỏ, cam, xanh ngọc, kem, đen) ở nửa dưới mặt trước. Hai quai sẫm quấn khăn vải dệt nhiều màu.
- **SP04 Trám Shopper:** hình chữ nhật, rộng hơn cao, góc đáy bo, không nắp. Nền kem phủ họa tiết mắt xích hình thoi nâu. Hai quai nâu nối với hai dải đứng chạy xuống gần đáy, có khóa kim loại chữ nhật nhỏ gần đầu quai.

### Thông số mỗi mẫu (missing, bắt buộc trước khi ra mắt)

Kích thước R × C × S (cm) · trọng lượng (g) · cỡ laptop đựng vừa (inch) · số ngăn trong · kiểu đóng · độ cao quai (cm) · tải trọng quai đã thử (kg) · phụ kiện kim loại · nơi may.

Thông tin hiện có: kích thước túi tương đương một chiếc laptop cỡ vừa nhỏ (verified). Cách hiển thị tạm: "About the footprint of a 13 to 14-inch laptop" (assumed, chỉ dùng khi chủ dự án duyệt cách diễn đạt).

## 5. Vật liệu

**Nguyên tắc (verified, D07):** 70% vải chính chuyên dụng mới · 30% vải tái chế (cotton, jeans, vải tổng hợp) cho quai, nắp đóng mở, dải quai và khăn. Tỷ lệ tính theo **khối lượng vải** của túi, không tính phụ kiện kim loại, chỉ may và keo.

**Bảng chất liệu từng mẫu:** đề xuất của nhóm thiết kế dựa trên hình dáng và bề mặt trong ảnh, chủ dự án ủy quyền ngày 30/10/2026. Đây là dữ liệu hiển thị trên trang sản phẩm (`materials_en`, `materials_vi`). Trước khi ra mắt phải đối chiếu với mẫu sản xuất thật (09 mục 6).

Lý do chọn: quai và nắp trong ảnh có bề mặt trơn, mờ, nên dùng **canvas cotton-jeans tái chế phủ hoàn thiện mờ gốc nước** (cho bề mặt mịn, chống bẩn) thay cho da; thân cần giữ phom nên dùng **canvas jacquard mật độ cao** (SP01, SP04: thấy rõ hoa văn dệt) hoặc **nỉ kỹ thuật dày 3 mm** (SP02, SP03: bề mặt lì, hơi xù).

| Mẫu | Bộ phận | EN (hiển thị) | VI (hiển thị) | Nhóm |
|---|---|---|---|---|
| SP01 Weft Structured Tote | Body | Jacquard canvas, diamond weave, water-repellent finish | Canvas jacquard dệt hoa văn hình thoi, phủ chống thấm nhẹ | 70% mới |
| | Sides | Brushed cotton twill | Twill cotton chải mịn | 70% mới |
| | Lining | Woven brocade | Thổ cẩm dệt | 70% mới |
| | Flap and band | Recovered cotton-denim canvas, matte coated finish | Canvas cotton-jeans tái chế, phủ mờ | 30% tái chế |
| | Handles | Recovered canvas rolled over a recovered cotton cord | Canvas tái chế cuộn quanh lõi dây cotton tái chế | 30% tái chế |
| | Hardware | Brass-tone zinc alloy buckle | Khóa hợp kim kẽm màu đồng | Kim loại |
| SP02 Loom Flap Tote (Forest, Wine) | Body | Dense technical felt, 3 mm | Nỉ kỹ thuật dày 3 mm | 70% mới |
| | Band | Jacquard-woven band | Dải dệt jacquard | 70% mới |
| | Lining | Cotton canvas | Canvas cotton | 70% mới |
| | Flap tab | Recovered cotton-denim canvas, matte coated finish | Canvas cotton-jeans tái chế, phủ mờ | 30% tái chế |
| | Handles | Recovered canvas rolled over a recovered cotton cord | Canvas tái chế cuộn quanh lõi dây cotton tái chế | 30% tái chế |
| | Hardware | Metal snap | Nút bấm kim loại | Kim loại |
| SP03 Loom Carryall | Body | Dense technical felt, 3 mm, black | Nỉ kỹ thuật dày 3 mm, màu đen | 70% mới |
| | Panel | Multicolour woven brocade | Thổ cẩm dệt nhiều màu | 70% mới |
| | Lining | Cotton canvas | Canvas cotton | 70% mới |
| | Flap tab | Recovered canvas in cinnabar, matte coated finish | Canvas tái chế màu đỏ son, phủ mờ | 30% tái chế |
| | Handles | Recovered canvas rolled over a recovered cotton cord | Canvas tái chế cuộn quanh lõi dây cotton tái chế | 30% tái chế |
| | Scarf | Woven from recovered cotton and polyester yarn | Dệt từ sợi cotton và polyester tái chế | 30% tái chế |
| | Hardware | Metal snap | Nút bấm kim loại | Kim loại |
| SP04 Trám Shopper | Body | Jacquard canvas, trám (diamond) motif, stain-resistant finish | Canvas jacquard họa tiết hình trám, phủ chống bám bẩn | 70% mới |
| | Lining | Cotton canvas | Canvas cotton | 70% mới |
| | Handles and straps | Recovered cotton-denim canvas, matte coated finish | Canvas cotton-jeans tái chế, phủ mờ | 30% tái chế |
| | Hardware | Brass-tone zinc alloy buckles | Khóa hợp kim kẽm màu đồng | Kim loại |

Dòng tổng hiển thị ở mọi mẫu: **"70% new technical textile · 30% recovered textile, by textile weight"** / **"70% vải chuyên dụng mới · 30% vải tái chế, tính theo khối lượng vải"**.

Còn thiếu (không chặn thi công): nơi may (CL-09); nguồn nghệ nhân của phần thổ cẩm (CL-04).

## 6. Sổ tuyên bố (claims register)

Mọi câu khẳng định trên web có mã CL. Chỉ render khi `approved`. Trong code: `src/content/claims.ts` export `{ id, status }`; component nhận prop `claim="CL-03"` và trả về null nếu chưa approved (08-TECH-SPEC mục 7).

| Mã | Tuyên bố (EN) | Xuất hiện ở | Trạng thái | Điều kiện để approved |
|---|---|---|---|---|
| CL-01 | 70% new technical textile for the body (jacquard canvas or dense felt) | H-02, H-05, P-03, CR-02 | approved | |
| CL-02 | 30% recovered cotton, denim and synthetics in the handles, flaps, straps and scarf, by textile weight | H-02, H-05, P-03, CR-02, FAQ | approved | |
| CL-03 | Measured for every production batch | H-02 | pending | Có quy trình đo theo lô |
| CL-04 | The lining is woven by hand by [group] in [place] | H-06, P-04, CR-03, CR-04 | pending | Có thông tin nghệ nhân |
| CL-05 | Their name stays with every bag from the batch | H-06, P-04 | pending | Có thỏa thuận ghi nhận |
| CL-06 | Fits a [x]-inch laptop | P-02, Size & fit, FAQ | pending | Đo thật từng mẫu |
| CL-07 | About the footprint of a 13 to 14-inch laptop | H-04, Size & fit | pending | Chủ dự án duyệt cách diễn đạt |
| CL-08 | Handles tested to carry [x] kg | H-04, FAQ | pending | Có kết quả thử tải |
| CL-09 | Made in [city] | H-01 eyebrow, P-03 | pending | Xác nhận nơi may |
| CL-10 | Inspect before you pay (COD) | H-01, H-07, CA-01, CO-03, chính sách | approved | |
| CL-11 | Repairs available | H-07, P-01, Care & repair | approved | Điều kiện theo 04a-POLICIES-VI |
| CL-12 | Ships in [x] working days | P-01, FAQ | assumed (1 đến 2 ngày chuẩn bị) | Chủ dự án duyệt |
| CL-13 | Studio visits by appointment, every day, 8:00 to 21:30 | H-01, H-08, Studio, FAQ | approved | |
| CL-14 | We reply within [x] | Contact | pending | Chủ dự án duyệt |
| CL-15 | Pattern meaning: [text] | CR-03 | pending | Nghệ nhân xác nhận |
| CL-16 | Agreed patterns, agreed price, credit on every bag | CR-04 | pending | Có thỏa thuận thật |
| CL-17 | Monthly donation trips to the Northwest and other mountain regions | H-05, DE-01, DE-02, AB-02 | approved | Chủ dự án (D18) |
| CL-18 | Every donated piece is checked by our team | DE-01, DE-02 | approved | Chủ dự án (D18) |
| CL-19 | Needs are checked with local partners before each trip | DE-02 | pending | Có đối tác và quy trình hỏi nhu cầu |
| CL-20 | Impact numbers: kg collected, pieces delivered, kg recycled | DE-01 | pending | Có số liệu chuyến đầu tiên |
| CL-21 | Clothes unfit to wear become recovered textile in Refvlks bags | H-02, H-05, DE-01, DE-02, CR-02, AB-02 | approved | Chủ dự án (D18) |
| CL-22 | Drop-off at the studio during collection week | DE-02, ST-03 | pending | Chủ dự án xác nhận nhận đồ tại studio |
| CL-23 | Destinations and results posted after every trip | DE-03 | pending | Đội ngũ cam kết đăng tổng kết |

## 7. Số liệu nguồn dùng trong câu chuyện thương hiệu (About)

- Quần áo quyên góp bị bỏ đống bên đường tại Kỳ Sơn, Nghệ An do không khảo sát nhu cầu trước (nguồn trong kế hoạch dự án: Doãn Hòa, 2022). Hiển thị kèm link nguồn.

## 8. Con số chính sách

Toàn bộ là **assumed**, chi tiết trong 04a-POLICIES-VI. Một chỗ duy nhất trong code: `src/content/policy.ts`, để đổi một con số là cả website và chính sách cùng cập nhật.

| Khóa | Giá trị |
|---|---|
| shippingFeeHanoi | 30.000 ₫ |
| shippingFeeOther | 40.000 ₫ |
| prepDays | 1 đến 2 ngày làm việc |
| deliveryDaysHanoi / deliveryDaysOther | 1 đến 2 / 3 đến 5 ngày làm việc |
| codConfirmHours | 4 giờ làm việc |
| codAutoCancelHours | 24 giờ |
| codMaxItems / codDepositPercent | 2 / 30% |
| inspectMinutes | 10 phút |
| claimHours | 48 giờ |
| exchangeDays / exchangeLimit | 7 ngày / 1 lần |
| refundWorkingDays | 7 ngày làm việc |
| freeRepairMonths | 6 tháng |
| transferDeadlineHours | 24 giờ |
| contactRetentionMonths | 12 tháng |
