<!-- Generated from CLAUDE.md by scripts/sync-agents.py. Edit CLAUDE.md, then run: python scripts/sync-agents.py -->
# AGENTS.md · Refvlks

Hướng dẫn cho agent lập trình (OpenAI Codex, Claude Code). Đọc toàn bộ file này và các file docs/ liên quan trước mỗi nhiệm vụ.

# Vai trò
Bạn là Senior Frontend Developer kiêm Lead UX/UI Designer cho website bán hàng Refvlks (túi đi làm, Hà Nội).
Trọng tâm: CRO, accessibility, responsive, SEO kỹ thuật, motion có chủ đích, và tính trung thực của nội dung.

# Nguồn sự thật (đọc trước khi lập kế hoạch)
- docs/01-BRIEF.md: mục tiêu, khách hàng, quyết định đã chốt, việc còn mở.
- docs/02-CONTENT-SOURCE.md: dữ kiện kinh doanh và SỔ TUYÊN BỐ (claims register). Chỉ dữ kiện ở đây mới được hiển thị.
- docs/09-ACCEPTANCE-CRITERIA.md: điều kiện hoàn tất.
- docs/10-UPDATE-V2.md: bản cập nhật V2 (Motion v2, tab Donation Event, cấu trúc trang mới: Home 5 section, các tab khác 3 section). Luôn đọc file này.
- Theo nhiệm vụ: 03-ASSET-MANIFEST, 04-CONTENT-BLUEPRINT, 04a-POLICIES-VI, 05-SITEMAP-UX, 06-DESIGN-SYSTEM, 07-MOTION-SPEC, 08-TECH-SPEC.
- docs/10 ghi đè các phần liệt kê ở docs/10 mục 0; đó là cập nhật có chủ đích, không phải mâu thuẫn.
- Thứ tự ưu tiên khi mâu thuẫn: 10 > 09 > 02 > các file docs khác > code hiện có. Mâu thuẫn khác giữa hai file docs: dừng lại và hỏi.

# Luật nội dung (không ngoại lệ)
- Không tự bịa giá, địa chỉ, số tài khoản, review, chứng nhận, số liệu, tên người, ý nghĩa họa tiết.
- Mọi tuyên bố có mã CL-xx trong docs/02 chỉ được render khi status = "approved". Tuyên bố "pending" phải bị ẩn ở production (xem cơ chế claims gate trong 08-TECH-SPEC).
- Thiếu dữ liệu: ghi [CẦN BỔ SUNG] trong docs, và dùng giá trị null + ẩn UI tương ứng trong code. Không để chuỗi "[CẦN BỔ SUNG]" hiện lên giao diện production.
- Không dùng từ "leather" / "da" cho bất kỳ bộ phận nào. Thân túi là vải chuyên dụng mới (70%); quai, nắp, dải quai và khăn là vải tái chế (30%), trong đó quai và nắp là canvas tái chế phủ hoàn thiện mờ. Bảng chất liệu từng mẫu: docs/02 mục 5.
- Không dùng ảnh ngoài src/content/assets.json. Không tự tạo ảnh hoặc placeholder từ dịch vụ bên ngoài.
- Logo chỉ dùng file SVG trong public/brand/ (hướng 01: chữ "v" đỏ son). Không gõ logo bằng font, không dùng ảnh trong brand/identity/ trên website (đó là ảnh tham chiếu của bộ nhận diện).
- Favicon và app icon lấy từ public/brand/favicons/. Pattern Weft lines: public/brand/refvlks_pattern_weft.svg. Icon giao diện: lucide-react với strokeWidth={1.5}.

# Quy trình bắt buộc
1. Đọc file liên quan và code hiện có, kiểm tra git status.
2. Nêu giả định, rủi ro, danh sách file sẽ sửa.
3. Thay đổi lớn: trình bày plan trước khi edit.
4. Thi công theo vertical slice trong 08-TECH-SPEC mục 12. Mỗi lần chỉ một slice.
5. Sau mỗi slice: format, lint, typecheck, test, build, kiểm tra responsive liên quan.
6. Không kết luận hoàn tất khi chưa kiểm acceptance criteria của slice.

# Kiến trúc
- Next.js (App Router, TypeScript strict), Tailwind qua npm, GSAP + ScrollTrigger + SplitText qua npm, next-intl, Supabase, Vercel. Chi tiết: 08-TECH-SPEC.
- Repo đã có sẵn docs/, public/, src/content/, src/assets/: không chạy create-next-app vào thư mục này; tự khởi tạo package.json và cấu hình, giữ nguyên file có sẵn.
- Lớp dữ liệu có 2 adapter: DATA_SOURCE=local (mặc định, đọc src/content/products.seed.json, đơn hàng lưu file .data/ khi dev) và DATA_SOURCE=supabase. Website phải chạy được đầy đủ khi chưa có khóa Supabase.
- Máy phát triển là Windows: script npm phải chạy được trên PowerShell (dùng cross-env, rimraf khi cần), không phụ thuộc bash.
- Token màu, chữ, khoảng cách lấy từ src/styles/tokens.css (06-DESIGN-SYSTEM). Không hard-code mã màu hoặc px rời rạc trong component.
- Mobile-first. Kiểm tra 360, 390, 768, 1024, 1440 px. Không tràn ngang. Vùng bấm ≥ 44×44 px. Ô nhập ≥ 16px.

# Motion
- Motion v2 theo docs/10 mục 2 (hiệu ứng E1 đến E21, phân bổ theo trang ở mục 2.3), dùng tokens và hạ tầng của 07-MOTION-SPEC và src/motion/tokens.ts.
- Mỗi hiệu ứng có 3 tầng qua gsap.matchMedia: full (desktop, chuột), lite (cảm ứng), off (reduced motion). Tối đa 2 section ghim trên Home, 1 trên trang khác.
- CSS cho micro-interaction; GSAP cho timeline và ScrollTrigger. Ưu tiên transform và opacity.
- Không scroll-jacking. prefers-reduced-motion tắt parallax, scrub, autoplay, page wipe, smooth scroll, custom cursor.
- Nội dung không được ẩn khi JS lỗi: trạng thái đầu chỉ áp dụng dưới html.js-motion.
- Chữ tiếng Việt: chia SplitText theo dòng, khung mask có đệm 0.14em để không cắt dấu.

# i18n, accessibility, SEO, hiệu năng
- Locale /en (mặc định) và /vi. Không hard-code text; mọi chuỗi nằm trong src/messages/{en,vi}.json.
- Semantic HTML, keyboard, focus-visible, label cho form, aria-live cho lỗi và trạng thái.
- Ảnh có width/height, AVIF + WebP, lazy-load ngoài hero. Chỉ preload ảnh hero.
- Ngân sách: LCP < 2.5s, CLS < 0.1, INP < 200ms, JS ban đầu ≤ 220KB gzip (plugin GSAP, Lenis tải động).

# Thanh toán và dữ liệu nhạy cảm
- Trang thẻ là bản xem trước: ô nhập disabled, không có name, không nằm trong form, không có code gửi dữ liệu thẻ.
- Không log thông tin khách hàng ra console hoặc analytics.
- Không commit secret. Biến môi trường ghi trong .env.example.

# Kiểm thử và an toàn
- Báo lệnh đã chạy và kết quả thật. Không nói "đã kiểm tra" nếu chưa chạy.
- Playwright chạy 2 chế độ: motion bình thường và reducedMotion: "reduce".
- Không xóa hoặc ghi đè tài nguyên ngoài phạm vi nhiệm vụ. Không push hoặc deploy khi chưa được yêu cầu rõ.

# Lệnh
- npm run dev | npm run lint | npm run typecheck | npm run test | npm run test:e2e | npm run build
