# 04 · CONTENT BLUEPRINT

> **Cập nhật V2 (30/10/2026):** một số phần của file này đã được thay bằng `docs/10-UPDATE-V2.md` (xem mục 0 của file đó). Khi khác nhau, làm theo docs/10.

Nội dung từng trang theo thứ tự cuộn. EN là bản chính; VI đi kèm cho mọi headline, CTA, microcopy và đoạn chính. Chính sách tiếng Việt là bản gốc, nằm ở `04a-POLICIES-VI.md`.

**Quy ước mỗi section**
- `ID` · tầng hành trình (Attention / Relevance / Trust / Desire / Objections / Action)
- **Key i18n**: tiền tố trong `src/messages/{en,vi}.json`
- **Ảnh**: mã trong 03-ASSET-MANIFEST · **Claim**: mã trong 02-CONTENT-SOURCE mục 6
- **Nguồn**: K = kế hoạch dự án (PDF), O = quyết định chủ dự án, D = nhóm thiết kế đề xuất
- **Done khi**: acceptance criteria của section

Mọi câu gắn claim `pending` không render ở production. Section có ghi "ẩn khi" sẽ biến mất hoàn toàn nếu điều kiện chưa đạt.

---

## 0. Thành phần toàn cục

### Header · key `nav`

| Phần tử | EN | VI |
|---|---|---|
| Logo | Refvlks (link về trang chủ của locale) | Refvlks |
| Menu | Shop · Craft · About · Visit the studio | Cửa hàng · Thủ công · Về chúng tôi · Ghé studio |
| Shop panel | All bags · Heritage · Signature · Essential | Tất cả · Heritage · Signature · Essential |
| Ngôn ngữ | EN \| VI | EN \| VI |
| Giỏ hàng | Bag (2) | Giỏ (2) |
| Gợi ý ngôn ngữ (trình duyệt tiếng Việt, đang ở /en) | View this page in Vietnamese? | Xem trang bằng tiếng Việt? |

### Footer · key `footer`

| Cột | EN | VI |
|---|---|---|
| Shop | All bags, Heritage, Signature, Essential | Tất cả, Heritage, Signature, Essential |
| Refvlks | Craft & materials, About, Visit the studio | Thủ công & vật liệu, Về chúng tôi, Ghé studio |
| Help | Size & fit, Shipping & returns, Care & repair, FAQ, Contact | Kích thước, Giao hàng & đổi trả, Bảo quản & sửa chữa, Câu hỏi thường gặp, Liên hệ |
| Legal | Privacy, Terms of sale, Payment | Bảo mật, Điều khoản bán hàng, Thanh toán |
| Dòng doanh nghiệp | Refvlks · Representative: Nguyễn Tùng Anh · 22 Le Quy Don, Hai Ba Trung Ward, Hanoi · [Tax code] · [Phone] · [Email] | Refvlks · Người đại diện: Nguyễn Tùng Anh · 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội · [MST] · [Điện thoại] · [Email] |
| Thanh toán | We accept: Cash on delivery · Bank transfer | Chấp nhận: Thanh toán khi nhận hàng · Chuyển khoản |

Trường thiếu (MST, điện thoại, email, mạng xã hội) không render cho đến khi có dữ liệu.

### Microcopy dùng chung · key `common`

| Tình huống | EN | VI |
|---|---|---|
| Đang tải nút | Adding… / Sending… / Placing order… | Đang thêm… / Đang gửi… / Đang đặt hàng… |
| Lỗi mạng chung | Something went wrong. Please try again. | Có lỗi xảy ra. Vui lòng thử lại. |
| Hết hàng | Sold out | Hết hàng |
| Còn ít (chỉ khi tồn kho ≤ 2) | Only {n} left | Chỉ còn {n} chiếc |
| Đơn vị tiền | 1.890.000 ₫ (định dạng vi-VN ở cả hai locale) | 1.890.000 ₫ |

---

## 1. HOME · `/en` · `/vi`

| | EN | VI |
|---|---|---|
| Title (≤60) | Refvlks \| Work Bags, Quiet Outside, Woven Inside | Refvlks \| Túi đi làm, ngoài tĩnh, trong dệt tay |
| Meta (≤155) | Work totes with hand-woven details from a small studio in Hanoi. Inspect before you pay, or book a visit to try them on. | Túi đi làm có chi tiết dệt tay từ một studio nhỏ ở Hà Nội. Kiểm hàng trước khi trả tiền, hoặc đặt lịch đến thử túi. |
| H1 | Quiet on the outside. A story on the inside. | Ngoài tĩnh lặng. Trong là câu chuyện. |

### H-01 · Hero · Attention · key `home.hero`
- **Ảnh:** HOME-01 (desktop), HOME-02 (mobile) · **Claim:** CL-09 (eyebrow), CL-10, CL-13 · **Nguồn:** D, O

| Phần tử | EN | VI |
|---|---|---|
| Eyebrow | WORK BAGS · HANOI | TÚI ĐI LÀM · HÀ NỘI |
| Eyebrow khi CL-09 approved | WORK BAGS · MADE IN [CITY] | TÚI ĐI LÀM · LÀM TẠI [THÀNH PHỐ] |
| H1 | Quiet on the outside. A story on the inside. | Ngoài tĩnh lặng. Trong là câu chuyện. |
| Sub | Tailored work bags for city days, with textile woven by hand in Vietnam. | Túi đi làm may đo cho ngày ở thành phố, với vải dệt tay Việt Nam. |
| CTA chính | Shop the collection → `/shop` | Xem bộ sưu tập |
| CTA phụ | Visit the studio → `/studio` | Ghé studio |
| Dòng dưới CTA | Inspect before you pay · Studio visits by appointment | Kiểm hàng trước khi trả tiền · Ghé studio theo lịch hẹn |

**Done khi:** H1 và hai CTA đọc được khi tắt JS; ảnh hero là phần tử LCP < 2.5s trên 4G; không có claim pending.

### H-02 · The Reveal · Desire + Trust (khoảnh khắc cinematic) · key `home.reveal`
- **Ảnh:** REVEAL-01→08 · **Claim:** CL-01, CL-02, CL-03 (dòng phụ), CL-04 · **Nguồn:** O (D07), D

| Bước | EN | VI |
|---|---|---|
| Link bỏ qua (cho bàn phím) | Skip the reveal | Bỏ qua phần trình diễn |
| 01 | A body cut from new technical textile. | Thân túi từ vải chuyên dụng mới. |
| 02 | Handles and flaps in recovered cotton, denim and synthetics. | Quai và nắp từ cotton, jeans và vải tổng hợp tái chế. |
| 02 dòng phụ (khi CL-03 approved) | Measured for every batch. | Đo theo từng lô. |
| 03 | Open it: a lining woven by hand. | Mở ra: lớp lót dệt tay. |
| CTA | See how it's made → `/craft` | Xem cách chúng tôi làm |

**Done khi:** tắt animation vẫn đọc đủ 3 bước và thấy ảnh lớp lót; link "Skip" đưa focus tới H-03.

### H-03 · The Collection · Relevance · key `home.collection`
- **Ảnh:** ảnh `-card` mặt trước mỗi sản phẩm; hover: SP01-03, SP02F-02, SP02W-02, SP03-02, SP04-02 · **Nguồn:** O, D

| Phần tử | EN | VI |
|---|---|---|
| H2 | Three ways to carry your day. | Ba cách mang theo một ngày. |
| Body | Essential for everyday. Signature for a flap that closes and a woven band you notice. Heritage for the full woven lining. | Essential cho mỗi ngày. Signature có nắp đóng và dải dệt làm điểm nhấn. Heritage với lớp lót dệt toàn phần. |
| Chip lọc | All · Essential · Signature · Heritage | Tất cả · Essential · Signature · Heritage |
| CTA | Shop all bags → `/shop` | Xem tất cả |
| Trạng thái trống | Nothing here yet. See all bags. | Chưa có mẫu nào. Xem tất cả. |

Thẻ sản phẩm: một thẻ cho mỗi màu (5 thẻ). Thẻ gồm ảnh, tên kèm màu ("Loom Flap Tote, Forest"), giá, nhãn tầng (mono). Không dùng nhãn "Bestseller".

**Done khi:** đủ mọi sản phẩm đang bán; hover chỉ là thông tin phụ (thông tin trong ảnh hover cũng có ở trang sản phẩm).

### H-04 · Made for Monday · Relevance · key `home.monday`
- **Ảnh:** SP01-06 (tay cầm), SP02W-02 hoặc LIFE-05 (văn phòng, hiệu sách) · **Claim:** CL-06, CL-07, CL-08 · **Nguồn:** O (D08), D

| Phần tử | EN | VI |
|---|---|---|
| H2 | Made for Monday, not for the shelf. | Làm cho thứ Hai, không phải để trưng bày. |
| Ý 1 (CL-07) | About the footprint of a 13 to 14-inch laptop. | Kích thước khoảng bằng một chiếc laptop 13 đến 14 inch. |
| Ý 2 | Holds its shape, full or almost empty. | Giữ phom dù đầy hay gần như trống. |
| Ý 3 (CL-08) | Handles tested to carry [x] kg. | Quai đã thử tải [x] kg. |
| Ý 4 | A flap or snap that closes over what you carry. | Nắp hoặc nút bấm đóng lại trên đồ bạn mang. |
| CTA | Size & fit guide → `/help/size-fit` | Hướng dẫn kích thước |

Ý 4 không đúng với Trám Shopper (không nắp), vì vậy câu chữ nói "a flap or snap" và chỉ áp dụng cho trang chủ. **Ẩn khi:** CL-07 và CL-08 đều pending, section chỉ còn Ý 2 và Ý 4.

### H-05 · What it's made of · Trust · key `home.materials`
- **Ảnh:** SP01-05 · **Claim:** CL-01, CL-02 · **Nguồn:** O (D07)

| Phần tử | EN | VI |
|---|---|---|
| H2 | What goes into every bag. | Trong mỗi chiếc túi có gì. |
| Khối 70% | **70%** New technical textile: dense jacquard canvas and felt, for a body that holds its shape and wears well. | **70%** Vải chuyên dụng mới: canvas jacquard và nỉ kỹ thuật dày, để thân túi giữ phom và bền. |
| Khối 30% | **30%** Recovered cotton, denim and synthetics, used for handles, flaps, straps and the scarf. | **30%** Cotton, jeans và vải tổng hợp tái chế, dùng cho quai, nắp, dải quai và khăn. |
| Ghi chú | Measured by textile weight. Every part is listed on each product page. | Tính theo khối lượng vải. Từng bộ phận được ghi trên trang sản phẩm. |
| CTA | Read about our materials → `/craft#materials` | Tìm hiểu vật liệu |

### H-06 · The hands behind it · Trust · key `home.hands`
- **Ảnh:** SP01-07 (tạm) · **Claim:** CL-04, CL-05 · **Ẩn khi:** CL-04 pending

| Phần tử | EN | VI |
|---|---|---|
| H2 | Every lining has a name behind it. | Sau mỗi lớp lót là một cái tên. |
| Body | Our linings are woven by [group] in [place]. We agree on patterns, credit and payment before a single thread is used. | Lớp lót được dệt bởi [nhóm] tại [địa phương]. Chúng tôi thống nhất mẫu, cách ghi nhận và tiền công trước khi dùng một sợi chỉ nào. |
| CTA | Meet the weavers → `/craft#weavers` | Gặp những người dệt |

### H-07 · Low-risk ways to buy · Objections · key `home.trust`
- **Claim:** CL-10, CL-11, CL-13

| Cột | EN | VI |
|---|---|---|
| H2 | Low-risk ways to buy. | Mua hàng không lo rủi ro. |
| 1 | **Inspect before you pay.** Open the parcel and check your bag before paying the courier. | **Kiểm hàng rồi trả tiền.** Mở gói và kiểm túi trước khi trả tiền cho người giao hàng. |
| 2 | **Repairs we stand behind.** Handles, buckles and seams can come back to us for repair. | **Sửa chữa có cam kết.** Quai, khóa và đường may có thể gửi lại để chúng tôi sửa. |
| 3 | **See it in person.** Book a time and try any bag at our studio on Le Quy Don. | **Xem tận tay.** Đặt lịch và thử bất kỳ mẫu nào tại studio trên phố Lê Quý Đôn. |
| CTA | Shipping & returns → `/help/shipping-returns` | Giao hàng & đổi trả |

### H-08 · Visit the studio · Action · key `home.studio`
- **Ảnh:** không dùng (chưa có ảnh studio thật) · **Claim:** CL-13

| Phần tử | EN | VI |
|---|---|---|
| H2 | Come and carry one. | Đến và đeo thử một chiếc. |
| Body | 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. Open every day, 8:00 to 21:30, by appointment. | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. Mở cửa hằng ngày, 8:00 đến 21:30, theo lịch hẹn. |
| CTA chính | Shop the collection | Xem bộ sưu tập |
| CTA phụ | Book a visit → `/studio#book` | Đặt lịch ghé studio |

---

## 2. SHOP · `/en/shop` · `/vi/cua-hang`

| | EN | VI |
|---|---|---|
| Title | Shop Work Bags & Totes \| Refvlks | Túi đi làm và túi tote \| Refvlks |
| Meta | Tailored work totes from 1.290.000 ₫, with hand-woven details. Cash on delivery: inspect your bag before you pay. | Túi đi làm may đo từ 1.290.000 ₫, có chi tiết dệt tay. Thanh toán khi nhận hàng: kiểm túi trước khi trả tiền. |
| H1 | All bags | Tất cả sản phẩm |

| Section | Nội dung |
|---|---|
| S-01 Header | Sub: "Every bag is built for work first." / "Mỗi chiếc túi đều được làm để đi làm trước tiên." · Đếm tự động theo số thẻ (mỗi màu một thẻ): `{n} bags` / `{n} mẫu` |
| S-02 Bộ lọc | Tier (`?tier=heritage`) · Colour · Price. Sắp xếp: Featured, Price low to high, Price high to low. Trống: "No bags match these filters." + "Clear filters" / "Không có mẫu phù hợp." + "Xóa bộ lọc". Mobile: nút "Filter (2)", ngăn kéo đáy, nút cuối "Show {n} bags" |
| S-03 Lưới | Thẻ như H-03 |
| S-04 What changes between tiers | Bảng 3 cột × hàng: Shape, Closure, Woven detail, Price. Dữ liệu: Essential = open shopper, no flap, all-over motif; Signature = flared tote, snap-tab flap, woven band or panel; Heritage = structured tote, buckled flap, full woven lining |
| S-05 Trust strip | Inspect before you pay · Repairs available · Try them at the studio |

Khi chọn tầng, H1 đổi thành tên tầng và `<title>` đổi theo; canonical giữ `/shop` (trang tầng không index ở MVP).

**Done khi:** lọc chạy được khi tắt JS (form GET); không có claim pending; đúng số sản phẩm.

---

## 3. PRODUCT DETAIL (template) · `/en/products/{handle}` · `/vi/san-pham/{handle}`

**SEO:** Title `{Name}, {Colour} | Refvlks` · Meta `{Short description} Cash on delivery, inspect before you pay.` · H1 = tên. Structured data `Product` (giá, tình trạng còn hàng, ảnh); không có `AggregateRating`.

### Các section

| ID | Tầng | Nội dung | Điều kiện hiển thị |
|---|---|---|---|
| P-01 Gallery + Buy box | Attention, Action | Gallery theo 03-ASSET-MANIFEST mục 4. Buy box: eyebrow mono `{TIER}`, H1, giá, mô tả ngắn, chọn màu (hiện `Colour: Forest`), trạng thái kho, nút **Add to bag / Thêm vào giỏ**, link **Try it at the studio / Thử tại studio** → `/studio?bag={handle}#book`, hàng tin cậy `Inspect before you pay · Repairs available` | Luôn |
| P-02 The details | Relevance | Bảng: Size (cm), Weight, Laptop fit, Compartments, Closure, Handle drop. H2 "The details." / "Thông số." · Link "Full size & fit guide" | Mỗi hàng ẩn nếu chưa có dữ liệu; cả section ẩn nếu không còn hàng nào |
| P-03 What it's made of | Trust | Nhãn hồ sơ mono (bên dưới). H2 "What it's made of." / "Chất liệu." · Link "How we measure this" | Luôn |
| P-04 Open it | Trust, Desire | H2 "Open it." / "Mở ra." · Ảnh vai trò `inside`/`open` · Body về lớp lót | Chỉ khi có ảnh bên trong; câu về nghệ nhân theo CL-04 |
| P-05 Care | Objections | Hướng dẫn theo vật liệu, lấy từ Care & repair | Luôn |
| P-06 Delivery, payment & returns | Objections | Accordion 3 mục, mỗi mục ≤ 35 từ | Luôn |
| P-07 Questions | Objections | 3 đến 5 câu riêng của mẫu, câu mặc định bên dưới | Luôn |
| P-08 You may also like | Relevance | 3 thẻ: ưu tiên khác tầng | Khi có ≥ 2 sản phẩm khác |
| Thanh mua cố định (mobile) | Action | Tên rút gọn, giá, "Add to bag" | Khi buy box ra khỏi màn hình |

**Nhãn hồ sơ P-03 (mẫu SP01, dữ liệu từ 02 mục 5):**
```
BODY          Jacquard canvas, diamond weave, water-repellent finish
SIDES         Brushed cotton twill
LINING        Woven brocade
FLAP, BAND    Recovered cotton-denim canvas, matte coated finish
HANDLES       Recovered canvas rolled over a recovered cotton cord
HARDWARE      Brass-tone zinc alloy buckle
SHARE         70% new technical textile · 30% recovered, by textile weight
```
Mỗi dòng lấy từ dữ liệu sản phẩm; dòng thiếu dữ liệu không render. Bản VI dùng cột VI ở 02 mục 5.

**Microcopy P-01:** thêm thành công "Added to your bag." / "Đã thêm vào giỏ." · lỗi "We couldn't add this to your bag. Please try again." / "Chưa thêm được vào giỏ. Vui lòng thử lại." · hết hàng: nút "Sold out" + link "Ask the studio about the next batch" / "Hỏi studio về đợt hàng tới" → Contact.

**P-06 accordion:**
- Delivery: "Hanoi in {1 to 2} working days, elsewhere in Vietnam in {3 to 5}. Fees are shown at checkout." / "Hà Nội {1 đến 2} ngày làm việc, tỉnh thành khác {3 đến 5} ngày. Phí hiển thị ở bước thanh toán."
- Payment: "Cash on delivery or bank transfer. Card payments are coming soon." / "Thanh toán khi nhận hàng hoặc chuyển khoản. Thanh toán thẻ sắp ra mắt."
- Returns: "Exchange an unused bag within {7} days. Defects are exchanged or refunded." / "Đổi túi chưa sử dụng trong {7} ngày. Lỗi sản xuất được đổi hoặc hoàn tiền."

**P-07 câu mặc định:**
- How big is it? → theo dữ liệu P-02; trước khi có số đo dùng CL-07.
- Is the flap leather? → "No. Handles and flaps are recovered cotton-denim canvas with a matte coated finish, which gives them their smooth look." / "Không. Quai và nắp là canvas cotton-jeans tái chế phủ hoàn thiện mờ, nên bề mặt trông mịn."
- Are recovered handles strong enough? → "The handles are recovered canvas rolled over a cotton cord core. They are tested to [x] kg." (câu thứ hai theo CL-08; ẩn đến khi approved)
- Can I see it first? → "Yes. Book a visit to our studio." + link.

### Dữ liệu sản phẩm (seed)

5 mẫu ra mắt, 5 thẻ trên lưới. Chất liệu chi tiết từng mẫu: 02 mục 5.

**SP01 · Weft Structured Tote · Heritage · 1.890.000 ₫**
- Short EN: A structured work tote with a buckled flap, a diamond-weave body and a woven lining you see when you open it.
- Short VI: Túi đi làm phom cứng, nắp có khóa cài, thân hoa văn hình thoi và lớp lót dệt hiện ra khi mở túi.
- Long EN: Built around a working day. The Weft Structured Tote keeps its shape whether it is full or almost empty, and the buckled flap closes over everything inside. The body is a dense jacquard canvas in a diamond weave; the flap, band and handles are recovered cotton-denim canvas with a matte coated finish. Open the flap and the bag changes character: a woven lining in blue, ochre and cream. Quiet on the outside. A story on the inside.
- Long VI: Được thiết kế quanh một ngày làm việc. Weft Structured Tote giữ phom dù đầy đồ hay gần như trống, nắp có khóa cài đóng lại trên mọi thứ bên trong. Thân túi là canvas jacquard mật độ cao dệt hoa văn hình thoi; nắp, dải ngang và quai là canvas cotton-jeans tái chế phủ mờ. Mở nắp ra, chiếc túi đổi tính cách: lớp lót dệt màu xanh, vàng đất và kem. Ngoài tĩnh lặng. Trong là câu chuyện.
- P-04 body EN: The lining is a multicolour woven brocade. [When CL-04 approved: woven by hand by {group} in {place}.] / VI: Lớp lót là thổ cẩm dệt nhiều màu. [Khi CL-04 approved: dệt tay bởi {nhóm} tại {địa phương}.]

**SP02 · Loom Flap Tote · Signature · 1.590.000 ₫ · Forest / Wine (2 thẻ trên lưới)**
- Short EN: An everyday tote with a flared opening, a snap-tab flap and a woven band around the base. In forest or wine.
- Short VI: Túi tote hằng ngày với miệng loe, nắp tab có nút bấm và dải dệt quanh đáy. Màu xanh rừng hoặc đỏ rượu.
- Long EN: Easy to reach into, easy to close. The opening flares wide, a small tab snaps shut at the centre, and a jacquard band runs around the lower third of the bag. The body is a dense technical felt that keeps its shape; the tab and handles are recovered canvas with a matte coated finish. Forest pairs a deep green body with a cream band; Wine keeps the band tone-on-tone for a quieter look.
- Long VI: Dễ lấy đồ, dễ đóng lại. Miệng túi loe rộng, nắp tab nhỏ bấm lại ở giữa, và một dải jacquard chạy quanh một phần ba thân dưới. Thân túi là nỉ kỹ thuật dày giữ phom; nắp tab và quai là canvas tái chế phủ mờ. Màu Forest kết hợp thân xanh rừng với dải kem; màu Wine giữ dải cùng tông cho vẻ trầm hơn.

**SP03 · Loom Carryall · Signature · 1.590.000 ₫ · Black / Cinnabar**
- Short EN: A black carryall with a cinnabar flap, a triangular woven panel and handles wrapped in a woven scarf.
- Short VI: Túi đen với nắp đỏ son, mảng dệt tam giác và quai quấn khăn dệt.
- Long EN: The most graphic bag in the collection. A matte black felt body, a small cinnabar tab that snaps shut, and a triangle of multicolour brocade across the lower front. The handles are wrapped in a scarf woven from recovered cotton and polyester yarn; handles and tab are recovered canvas with a matte coated finish.
- Long VI: Chiếc túi nổi bật nhất trong bộ sưu tập. Thân nỉ đen lì, nắp tab đỏ son bấm lại, và một mảng thổ cẩm nhiều màu hình tam giác ở nửa dưới mặt trước. Quai được quấn khăn dệt từ sợi cotton và polyester tái chế; quai và nắp tab là canvas tái chế phủ mờ.

**SP04 · Trám Shopper · Essential · 1.290.000 ₫**
- Short EN: An open shopper in an all-over diamond motif, with two straps that run from the handles down the front.
- Short VI: Túi shopper mở miệng phủ họa tiết hình trám, hai dải quai chạy từ quai xuống mặt trước.
- Long EN: Named after the trám, the diamond shape repeated across its body. With no flap, it is the quickest bag to load. The body is a jacquard canvas with a stain-resistant finish; two straps run from the handles down the front, each with a small buckle, all in recovered cotton-denim canvas.
- Long VI: Đặt tên theo hình trám lặp lại trên thân túi. Không có nắp nên đây là chiếc túi bỏ đồ nhanh nhất. Thân túi là canvas jacquard phủ chống bám bẩn; hai dải quai chạy từ quai xuống mặt trước, mỗi dải có một khóa nhỏ, tất cả bằng canvas cotton-jeans tái chế.

---

## 4. CRAFT & MATERIALS · `/en/craft` · `/vi/thu-cong`

| | EN | VI |
|---|---|---|
| Title | Craft & Materials: Inside Every Refvlks Bag | Thủ công & vật liệu: bên trong túi Refvlks |
| Meta | What our bags are made of: 70% new technical textile for the body, 30% recovered textile in handles and flaps, and woven details. | Túi Refvlks làm từ gì: 70% vải chuyên dụng mới cho thân túi, 30% vải tái chế ở quai và nắp, cùng chi tiết dệt. |
| H1 | What goes into a Refvlks bag. | Trong một chiếc túi Refvlks có gì. |

| ID | Nội dung EN | Nội dung VI | Điều kiện |
|---|---|---|---|
| CR-01 Intro | We would rather show you than tell you. Here is what we use and where it goes. | Chúng tôi muốn cho bạn thấy hơn là chỉ nói. Đây là những gì chúng tôi dùng và dùng ở đâu. | |
| CR-02 Materials `#materials` | H2 "Seventy, thirty." Khối 70%: new technical textile (dense jacquard canvas, 3 mm felt) for the body, because the body carries the shape and takes the wear. Khối 30%: recovered cotton, denim and synthetics for handles, flaps, straps and the scarf; the canvas gets a matte water-based finish so it stays smooth and easy to wipe. Measured by textile weight. Ảnh SP01-05 | H2 "Bảy mươi, ba mươi." Khối 70%: vải chuyên dụng mới (canvas jacquard mật độ cao, nỉ dày 3 mm) cho thân túi, vì thân túi giữ phom và chịu mài mòn. Khối 30%: cotton, jeans và vải tổng hợp tái chế cho quai, nắp, dải quai và khăn; canvas được phủ hoàn thiện mờ gốc nước để mịn và dễ lau. Tính theo khối lượng vải. | |
| CR-03 The weave | H2 "A pattern with a story." Mô tả kỹ thuật dệt và ý nghĩa họa tiết. Ảnh SP01-07 | H2 "Hoa văn có câu chuyện." | Ẩn khi CL-15 pending |
| CR-04 The weavers `#weavers` | H2 "Who we work with." Tên nhóm, địa phương, cách hợp tác, 3 cam kết (CL-16) | H2 "Chúng tôi làm việc cùng ai." | Ẩn khi CL-04 pending |
| CR-05 From pattern to bag | Timeline 5 bước: Design and sample → Woven details ordered → Materials logged → Cut and sewn → Checked one by one (shape, seams, handles, closures) | Thiết kế và làm mẫu → Đặt phần dệt → Ghi nhận vật liệu → Cắt và may → Kiểm từng chiếc (phom, đường may, quai, khóa) | |
| CR-06 What we don't claim yet | QR codes that trace each bag to its batch are in development. So is a donation programme that matches donated clothes to real needs. When they are ready, they will be here, with evidence. | Mã QR truy xuất từng chiếc túi về lô sản xuất đang được phát triển. Chương trình quyên góp kết nối quần áo với nhu cầu thật cũng vậy. Khi sẵn sàng, chúng sẽ có mặt ở đây, kèm bằng chứng. | |
| CR-07 CTA | See it on the bag. → Shop Heritage (`/shop?tier=heritage`) | Xem trên chiếc túi. → Xem dòng Heritage | |

---

## 5. ABOUT · `/en/about` · `/vi/ve-chung-toi`

| | EN | VI |
|---|---|---|
| Title | About Refvlks \| Why We Started | Về Refvlks \| Vì sao chúng tôi bắt đầu |
| Meta | Refvlks started in Hanoi with two problems: donated clothes going to waste, and weavers losing their market. Our answer is a well-made work bag. | Refvlks bắt đầu ở Hà Nội từ hai vấn đề: quần áo quyên góp bị lãng phí và nghề dệt mất dần đầu ra. Câu trả lời là một chiếc túi đi làm chỉn chu. |
| H1 | Why we started Refvlks. | Vì sao chúng tôi làm Refvlks. |

| ID | EN | VI | Điều kiện |
|---|---|---|---|
| AB-01 Opening | Two things kept coming up. Donated clothes left in piles by the roadside in Ky Son, Nghe An, because nobody had asked what was needed. And skilled weavers with fewer orders every year. We could not fix either alone, but we could make something people actually want to carry, and build it from both. Ảnh LIFE-01. Link nguồn (Doãn Hòa, 2022) | Có hai điều cứ lặp lại. Quần áo quyên góp bị bỏ thành đống bên đường ở Kỳ Sơn, Nghệ An, vì không ai hỏi người dân thực sự cần gì. Và những người thợ dệt giỏi có ít đơn hàng hơn mỗi năm. Chúng tôi không thể tự giải quyết cả hai, nhưng có thể làm ra thứ người ta thật sự muốn mang theo, và làm nó từ cả hai. | |
| AB-02 Three promises | Bags built for work first. Recovered textile, used where it counts. Weavers paid and credited on agreed terms. | Túi làm để đi làm trước tiên. Vải tái chế được dùng đúng chỗ. Người dệt được trả công và ghi nhận theo thỏa thuận. | Ý 3 ẩn khi CL-16 pending |
| AB-03 The name | Say it "re·folks". [Ý nghĩa tên] | Đọc là "re·folks". [Ý nghĩa tên] | Ý nghĩa tên [CẦN BỔ SUNG]; khi thiếu chỉ giữ cách đọc |
| AB-04 Team | Ảnh, tên, vai trò | | Ẩn (`showTeam = false`) |
| AB-05 What comes next | QR traceability, a needs-first donation programme, accessories made fully from recovered textile. Ghi rõ là kế hoạch | Truy xuất bằng QR, chương trình quyên góp theo nhu cầu, phụ kiện làm hoàn toàn từ vải tái chế. | |
| AB-06 CTA | Shop the collection · Visit the studio | Xem bộ sưu tập · Ghé studio | |

---

## 6. VISIT THE STUDIO · `/en/studio` · `/vi/studio`

| | EN | VI |
|---|---|---|
| Title | Visit the Refvlks Studio in Hanoi | Ghé Refvlks Studio tại Hà Nội |
| Meta | Try any Refvlks bag before you buy. Open every day, 8:00 to 21:30, by appointment, at 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. | Thử mọi mẫu túi Refvlks trước khi mua. Mở cửa hằng ngày 8:00 đến 21:30 theo lịch hẹn, tại 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. |
| H1 | Try it on before you decide. | Đeo thử rồi hãy quyết định. |

| ID | EN | VI |
|---|---|---|
| ST-01 Header | Sub: 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. By appointment only. CTA "Book a visit" → `#book` · Link "Open in Google Maps" (tab mới) | 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. Chỉ tiếp theo lịch hẹn. "Đặt lịch" · "Mở Google Maps" |
| ST-02 What to expect | Bring your laptop and what you carry every day. · Take your time; there is no pressure to buy. · Pay by cash or bank transfer at the studio. | Mang theo laptop và đồ dùng hằng ngày. · Cứ thong thả, không ai ép mua. · Thanh toán bằng tiền mặt hoặc chuyển khoản tại studio. |
| ST-03 Booking form `#book` | H2 "Book a visit." | H2 "Đặt lịch ghé studio." |
| ST-04 Hours & location | Address, "Open every day, 8:00 to 21:30, by appointment", ảnh bản đồ tĩnh + nút Google Maps | Địa chỉ, "Mở cửa hằng ngày, 8:00 đến 21:30, theo lịch hẹn" |

**Form ST-03 · key `studio.form`**

| Trường | EN label | VI label | Validation |
|---|---|---|---|
| name | Name | Họ tên | bắt buộc |
| phone | Phone or Zalo | Số điện thoại hoặc Zalo | bắt buộc, 10 số, bắt đầu bằng 0 |
| email | Email (optional) | Email (không bắt buộc) | định dạng email |
| date | Date | Ngày | bắt buộc, từ hôm nay đến 30 ngày tới |
| time | Time | Giờ | bắt buộc, khung 30 phút, lượt đầu 8:00, lượt cuối 21:00 |
| bags | Bags you'd like to try | Mẫu muốn thử | chọn nhiều; chọn sẵn nếu có `?bag=` |
| language | Language: English / Tiếng Việt | Ngôn ngữ | mặc định theo locale |
| note | Note (optional) | Ghi chú | ≤ 300 ký tự |
| consent | I agree to the Privacy Policy | Tôi đồng ý với Chính sách bảo mật | bắt buộc |

Nút: "Request a visit" / "Gửi yêu cầu đặt lịch". Thành công: "Thanks, {name}. We'll confirm your time by phone or Zalo." / "Cảm ơn {tên}. Chúng tôi sẽ xác nhận lịch qua điện thoại hoặc Zalo." Lỗi: "Please enter a phone number we can reach you on." · "Please choose a date and time." Khung giờ đã có người đặt hiển thị disabled.

---

## 7. CART · `/en/cart` · `/vi/gio-hang` (noindex)

| Phần tử | EN | VI |
|---|---|---|
| Tiêu đề ngăn kéo | Your bag ({n}) | Giỏ hàng ({n}) |
| Dòng sản phẩm | ảnh, tên, màu, giá, số lượng (− 1 +), Remove | ảnh, tên, màu, giá, số lượng, Xóa |
| Tạm tính | Subtotal | Tạm tính |
| Ghi chú | Shipping is calculated at checkout. | Phí giao hàng tính ở bước thanh toán. |
| CTA | Checkout | Thanh toán |
| Trống | Your bag is empty. → Shop the collection | Giỏ hàng trống. → Xem bộ sưu tập |
| Vượt tồn kho | Only {n} left in {colour}. We've updated your bag. | Chỉ còn {n} chiếc màu {màu}. Giỏ hàng đã được cập nhật. |
| Đã xóa | Removed. Undo | Đã xóa. Hoàn tác |
| Hàng tin cậy | Inspect before you pay · Repairs available | Kiểm hàng trước khi trả tiền · Có dịch vụ sửa chữa |

Trang `/cart` có thêm ô ghi chú đơn (≤ 200 ký tự).

---

## 8. CHECKOUT · `/en/checkout` · `/vi/thanh-toan` (noindex)

| Khối | EN | VI |
|---|---|---|
| CO-01 Contact | Full name · Phone (for delivery and order confirmation) · Email (optional, for your receipt). Ghi chú: "We only use this to deliver your order and contact you about it." | Họ tên · Số điện thoại (để giao hàng và xác nhận đơn) · Email (không bắt buộc, để nhận biên nhận). "Chúng tôi chỉ dùng thông tin này để giao hàng và liên hệ về đơn." |
| CO-02 Delivery | Delivery / Pick up at the studio (free, by appointment). Địa chỉ 2 cấp: Province or city → Ward or commune → Street and house number | Giao tận nơi / Nhận tại studio (miễn phí, theo lịch hẹn). Tỉnh/thành phố → Phường/xã → Số nhà, tên đường |
| CO-03 Payment | **Cash on delivery** "Pay the courier when it arrives. You can open the parcel and check your bag first." · **Bank transfer** "We'll show a QR code after you place your order. We ship once payment arrives." · **Card** (khóa) "Coming soon" + link "Learn more" | **Thanh toán khi nhận hàng** "Trả tiền cho người giao hàng sau khi mở gói và kiểm túi." · **Chuyển khoản** "Mã QR hiện sau khi đặt hàng. Chúng tôi gửi hàng khi nhận được tiền." · **Thẻ** "Sắp ra mắt" |
| CO-04 Review | Checkbox: "I agree to the Terms of sale and the Shipping & returns policy." Nút: "Place order · Pay on delivery" / "Place order · Pay by transfer". Dưới nút (COD): "We'll call or message you on Zalo to confirm before we ship." | "Tôi đồng ý với Điều khoản bán hàng và Chính sách giao hàng & đổi trả." "Đặt hàng · Trả khi nhận" / "Đặt hàng · Chuyển khoản". "Chúng tôi sẽ gọi hoặc nhắn Zalo để xác nhận trước khi gửi hàng." |

Quy tắc COD: tối đa 2 sản phẩm mỗi đơn; nhiều hơn thì ẩn COD và hiện "For orders of more than 2 bags, please pay a 30% deposit by transfer." / "Đơn từ 3 túi trở lên vui lòng chuyển khoản đặt cọc 30%."

**Lỗi (dưới từng ô, aria-live):** "Please enter your full name." · "This phone number doesn't look right. Use 10 digits, for example 09xx xxx xxx." · "Please choose your ward or commune." · "Please agree to the Terms of sale to continue." · đặt hàng lỗi: "We couldn't place your order. Nothing has been charged. Please try again or message us." · hết hàng giữa chừng: "Sorry, {product} sold out while you were checking out. We've removed it from your order."

## 9. CARD PAYMENTS (preview) · `/en/checkout/card` (noindex)

| EN | VI |
|---|---|
| H1: Card payments are coming soon. | Thanh toán thẻ sắp ra mắt. |
| We're setting up secure card payments with a licensed payment provider. Until then, you can pay on delivery after checking your bag, or by bank transfer. | Chúng tôi đang thiết lập thanh toán thẻ an toàn với đơn vị trung gian thanh toán được cấp phép. Trong thời gian này, bạn có thể trả tiền khi nhận hàng sau khi kiểm túi, hoặc chuyển khoản. |
| Khối xem trước: Card number, Expiry, CVC hiển thị mờ, nhãn "Preview only" | "Chỉ là bản xem trước" |
| CTA: Back to checkout | Quay lại thanh toán |

## 10. ORDER CONFIRMATION · `/en/order/{token}` (noindex)

**COD:** H1 "Thank you, {first name}. Your order is in." / "Cảm ơn {tên}. Đơn hàng đã được ghi nhận." · Body: "Order {RV1024}. We'll call or message you within 4 working hours to confirm, then ship. When it arrives, open the parcel and check your bag before paying." / "Đơn {RV1024}. Chúng tôi sẽ gọi hoặc nhắn tin trong 4 giờ làm việc để xác nhận rồi gửi hàng. Khi nhận, hãy mở gói và kiểm túi trước khi trả tiền."

**Chuyển khoản:** H1 "One more step: complete your transfer." / "Còn một bước: hoàn tất chuyển khoản."

| Dòng | EN | VI |
|---|---|---|
| QR | VietQR theo đơn (số tiền và nội dung điền sẵn) | |
| Bank | Techcombank | Techcombank |
| Account name | NGUYEN TUNG ANH (Refvlks) | NGUYEN TUNG ANH (Refvlks) |
| Ghi chú tên | The account is held by Refvlks' legal representative. | Tài khoản đứng tên người đại diện pháp lý của Refvlks. |
| Account number | 19070671343017 · Copy | 19070671343017 · Sao chép |
| Amount | 3.210.000 ₫ · Copy | |
| Reference | RV1024 · Copy · "Please use this exact reference so we can match your payment." | "Vui lòng ghi đúng nội dung này để chúng tôi đối chiếu." |
| Hạn | Please transfer within 24 hours. Unpaid orders are cancelled automatically after that. | Vui lòng chuyển trong 24 giờ. Sau thời gian này, đơn chưa thanh toán sẽ tự hủy. |
| Nút | I've made the transfer | Tôi đã chuyển khoản |
| Sau khi bấm | Thanks. We'll confirm as soon as the payment arrives. | Cảm ơn. Chúng tôi sẽ xác nhận ngay khi nhận được tiền. |

Mã VietQR (BIN 970407) điền sẵn số tài khoản, số tiền và nội dung. Nếu tạo QR lỗi: vẫn hiện đủ thông tin chuyển khoản dạng chữ.

**Nhận tại studio:** thêm "We'll message you to set a pick-up time at 22 Le Quy Don. Bring your order number." / "Chúng tôi sẽ nhắn tin hẹn giờ nhận tại 22 Lê Quý Đôn. Vui lòng mang theo mã đơn."

---

## 11. HELP

### Size & fit · `/help/size-fit` · `/vi/ho-tro/kich-thuoc`
- Title: Size & Fit Guide | Refvlks · Meta: How big each Refvlks bag is, what fits inside on a working day, and how to measure your laptop.
- H1: Size & fit / Kích thước
- SF-01: "Every bag is about the footprint of a 13 to 14-inch laptop. Exact measurements are below." (CL-07) / "Mỗi chiếc túi có kích thước khoảng bằng laptop 13 đến 14 inch. Số đo chính xác ở bên dưới."
- SF-02: bảng tất cả mẫu: W × H × D, Weight, Laptop fit, Handle drop, Compartments (hàng thiếu dữ liệu hiện "Coming soon" thay vì để trống, chỉ ở trang này)
- SF-03: mỗi mẫu một khối có anchor `#{handle}`, ảnh mặt trước
- SF-04: "Not sure? Bring your laptop to the studio." → `/studio#book`

### Care & repair · `/help/care-repair` · `/vi/ho-tro/bao-quan-sua-chua`
- Title: Care & Repair | Refvlks · Meta: How to look after jacquard canvas, technical felt, recovered handles and woven details, and how to send your bag back to us for repair.
- Care theo vật liệu (EN):
  - **Body, jacquard canvas (Weft Structured Tote, Trám Shopper):** spot clean with a damp cloth and mild soap; blot, don't rub; no machine wash, bleach or tumble dry.
  - **Body, technical felt (Loom Flap Tote, Loom Carryall):** lift lint with a soft brush or lint roller; spot clean with cold water; dry flat, away from heat.
  - **Handles, flaps and straps (coated recovered canvas):** wipe with a damp cloth; avoid alcohol and solvents; keep away from heat so the finish stays smooth.
  - **Scarf (recovered yarn):** hand wash cold on its own; dry flat. Recovered denim and dyed yarn may transfer some colour onto light clothing when new or damp.
  - **Woven lining and panels:** don't scrub; keep pens capped and keys in a pocket so nothing snags the weave.
  - **Storage:** empty the bag, fill it with paper to hold its shape, keep it in its dust bag away from damp.
- Natural variation: "Every woven detail and every recovered panel is different. Small differences in pattern placement, colour and texture between bags are expected and are not defects." / "Mỗi chi tiết dệt và mỗi mảnh vải tái chế đều khác nhau. Chênh lệch nhỏ về vị trí họa tiết, màu và bề mặt giữa các túi là bình thường, không phải lỗi."
- Repairs: tóm tắt 04a mục 6, CTA "Request a repair" → `/contact?topic=repair`

### FAQ · `/help/faq` · `/vi/ho-tro/cau-hoi` · structured data `FAQPage`

| Nhóm | Q (EN) | A (EN) | Điều kiện |
|---|---|---|---|
| Product | How big are the bags? | About the footprint of a 13 to 14-inch laptop. See the Size & fit guide for each bag. | CL-07 |
| Product | Are the bags waterproof? | [CẦN XÁC NHẬN] | Ẩn đến khi có |
| Materials | What is recovered textile used for? | Handles, flaps, straps and the scarf: 30% of each bag by textile weight. The body is new technical textile, either jacquard canvas or dense felt. | |
| Materials | Is the flap leather? | No. None of our bags use leather. Handles and flaps are recovered cotton-denim canvas with a matte coated finish, which gives them their smooth look. | |
| Materials | Are recovered handles strong enough? | They are tested to carry [x] kg. | CL-08 |
| Materials | Why do two bags look slightly different? | Woven details and recovered panels vary from piece to piece. That is expected, not a defect. | |
| Ordering | How do I pay? | Cash on delivery or bank transfer. Card payments are coming soon. | |
| Ordering | Can I check the bag before paying? | Yes. With cash on delivery you can open the parcel and inspect the bag in front of the courier before paying. | |
| Ordering | I paid by transfer. When will you ship? | As soon as the payment arrives. Orders are prepared within 1 to 2 working days. | |
| Ordering | The account name is a person's name. Is that right? | Yes. Our account is held by Refvlks' legal representative, Nguyen Tung Anh. | |
| Delivery | How long does delivery take? | Hanoi: 1 to 2 working days. Elsewhere in Vietnam: 3 to 5 working days. | |
| Returns | Can I return a bag I don't like? | You can exchange an unused bag within 7 days. Refunds are for defects or wrong items. | |
| Studio | Where is the studio? | 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. | |
| Studio | Do I need to book? | Yes. The studio is open every day from 8:00 to 21:30, by appointment only. | |

VI: dịch tương đương trong `vi.json`, key `faq.items[n]`.

### Contact · `/contact` · `/vi/lien-he`
- Title: Contact Refvlks · Meta: Questions about an order, a repair, a studio visit or corporate gifts? Send us a message and the Hanoi studio team will reply.
- Kênh: Phone/Zalo, Email, Instagram [CẦN BỔ SUNG; không render khi trống] · địa chỉ studio
- Form: Name · Phone or email · Topic (Order / Studio visit / Repair / Corporate gifts / Press & partnerships / Something else) · Order number (chỉ khi Order hoặc Repair) · Message · Privacy consent
- Nút: "Send message" / "Gửi tin nhắn" · Thành công: "Thanks. We'll get back to you soon." (khi CL-14 approved: "We reply within {x}.") · Lỗi: "Please write a message." · "Please add a phone number or email so we can reply."

### 404
- H1 "This page has wandered off." / "Trang này đã đi lạc." · Body "The link may be old or mistyped." · CTA "Shop the collection" · Link "Go to homepage"

---

## 12. LEGAL · `/legal/privacy` · `/legal/terms` · `/legal/payment` · `/help/shipping-returns`

Nội dung gốc tiếng Việt: `04a-POLICIES-VI.md`. Bản EN dịch từ đó và ghi: "This English version is a translation. If there is any difference, the Vietnamese version applies."

| Trang | Title EN | Meta EN |
|---|---|---|
| Shipping & returns | Shipping, Inspection & Returns \| Refvlks | Delivery times and fees, how to inspect your bag before paying, and how exchanges, refunds and repairs work at Refvlks. |
| Privacy | Privacy Policy \| Refvlks | What personal data Refvlks collects, why, who receives it and how to exercise your rights. |
| Terms | Terms of Sale \| Refvlks | The terms that apply when you buy from Refvlks online or at our Hanoi studio. |
| Payment | Payment Policy \| Refvlks | Cash on delivery, bank transfer and how we confirm your payment. Card payments are coming soon. |

---

## 13. Cấu trúc key i18n

```
nav.*  footer.*  common.*
home.hero.*  home.reveal.steps[3]  home.collection.*  home.monday.items[4]
home.materials.*  home.hands.*  home.trust.items[3]  home.studio.*
shop.*  shop.filters.*  shop.tiers.{essential,signature,heritage}.*
product.buy.*  product.details.*  product.materials.*  product.openIt.*
product.care.*  product.accordion.*  product.faq.*  product.related.*
craft.*  about.*  studio.*  studio.form.*
cart.*  checkout.*  checkout.errors.*  cardPreview.*  order.cod.*  order.transfer.*
help.sizeFit.*  help.care.*  faq.items[n]  contact.*  contact.form.*
legal.*  seo.{page}.{title,description}
```
Nội dung sản phẩm (tên, mô tả, chất liệu) nằm trong database theo cột `_en` và `_vi`, không nằm trong file messages.
