# 🎬 NgocHiepTV - Nền Tảng Xem Phim Trực Tuyến Cao Cấp

![NgocHiepTV Logo](/public/logo.png)

> **NgocHiepTV** là ứng dụng web xem phim trực tuyến hiện đại, thiết kế theo phong cách giao diện Netflix & RoPhim. Tối ưu hóa tốc độ tải trang siêu nhanh, phân trang chuẩn 25 phim/trang, tìm kiếm tự động thời gian thực và tương thích hoàn hảo 100% trên các thiết bị di động.

---

## ✨ Tính Năng Nổi Bật

- 🎨 **Giao Diện Netflix Dark Theme**: Thiết kế hiện đại với hiệu ứng mờ kính Glassmorphic, tone màu HSL sang trọng và animation mượt mà.
- ⚡ **Tìm Kiếm Tự Động Thời Gian Thực (Live Autocomplete Search)**: Đăng ký gợi ý kết quả ngay khi người dùng gõ từ khóa mà không cần bấm Tìm kiếm.
- 📊 **Thuật Toán Phân Trang 25 Phim/Trang (Page Aggregation)**: Tự động gộp các trang API NguonC và song song hóa dữ liệu trả về chính xác 25 phim trên mỗi trang danh sách.
- 🍿 **Trình Phát Cinema Player Đa Năng**:
  - Chế độ **Tắt Đèn (Light Dimming)** tập trung trải nghiệm xem phim.
  - Tự động nhớ tập phim, hỗ trợ chuyển **Tập Trước / Tập Tiếp**.
  - Đổi Server nguồn phát linh hoạt.
- 🏷️ **Bố Cục Thẻ Phim Chống Đè Badge (Layered Badge Layout)**: Phân tầng Chất lượng (HD), Số tập (Tập XX) và Bản chiếu (Sub + TM) hiển thị 100% rõ nét trên điện thoại di động.
- 📱 **Responsive 100% Trải Nghiệm Di Động**: Menu Drawer dạng cuộn, thao tác cảm ứng vuốt mượt mà trên điện thoại và tablet.
- 🎯 **Tối Ưu SEO Tự Động**:
  - Thẻ Meta động (Title, Description, OpenGraph, Twitter Cards).
  - Cấu trúc dữ liệu chuẩn Google **JSON-LD Schema.org Movie**.
  - Tự động sinh `sitemap.xml` và `robots.txt`.
- 🚨 **Trang Lỗi 404 Tùy Biến (Custom 404 Not Found)**: Thiết kế rực rỡ kèm danh sách gợi ý phim hot.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Core Framework** | [Next.js 15+](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Utility Helpers** | `clsx`, `tailwind-merge` |
| **API Provider** | NguonC REST API (`https://phim.nguonc.com/api`) |

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
NgocHiepTv/
├── public/                  # Logo, Favicon & Static Assets
│   ├── logo.png             # Brand logo (Cropped transparent margin)
│   └── favicon.png          # HD 512x512 Tab Favicon
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── danh-sach/[slug]/# Các trang danh sách (Phim bộ, Phim lẻ, Phim đang chiếu...)
│   │   ├── phim/[slug]/     # Trang chi tiết thông tin phim
│   │   ├── quoc-gia/[slug]/ # Trang lọc phim theo quốc gia
│   │   ├── the-loai/[slug]/ # Trang lọc phim theo thể loại
│   │   ├── tim-kiem/        # Trang kết quả tìm kiếm phim
│   │   ├── xem-phim/[slug]/ # Trang trình phát xem phim theo tập
│   │   ├── icon.png         # Tab Icon HD
│   │   ├── layout.tsx       # Root layout với Navbar & Footer
│   │   ├── not-found.tsx    # Trang Lỗi 404 tùy biến
│   │   ├── page.tsx         # Trang chủ với các Hàng Phim Slider (HeroBanner, Carousels)
│   │   ├── robots.ts        # Crawler rules
│   │   └── sitemap.ts       # Dynamic sitemap.xml generator
│   ├── components/          # Reusable UI Components
│   │   ├── Footer.tsx       # Chân trang chuyên nghiệp & Miễn trừ trách nhiệm
│   │   ├── HeroBanner.tsx   # Slider phông nền phim nổi bật trang chủ
│   │   ├── MovieCard.tsx    # Thẻ phim với 2-layer badge chống đè
│   │   ├── MovieCarousel.tsx# Hàng phim cuộn ngang mượt mà
│   │   ├── Navbar.tsx       # Thanh điều hướng Glassmorphism & Autocomplete Search
│   │   ├── Pagination.tsx   # Bộ phân trang 25 phim/trang
│   │   ├── Skeletons.tsx    # Loading skeleton placeholders
│   │   └── WatchPlayer.tsx  # Trình phát video Cinema & Chọn tập / Đổi Server
│   └── lib/
│       └── api.ts           # API Service Client & Page Aggregation Algorithm (25 items/page)
├── .gitignore               # Ignored build output, env & private notes
└── package.json             # Dependencies & scripts
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu hệ thống:
- **Node.js**: `>= 18.17.0`
- **npm** / **yarn** / **pnpm**

### 1. Clone repository & Cài đặt thư viện:
```bash
git clone https://github.com/your-username/NgocHiepTv.git
cd NgocHiepTv
npm install
```

### 2. Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### 3. Biên dịch phiên bản Production (Build):
```bash
npm run build
npm run start
```

---

## ⚖️ Miễn Trừ Trách Nhiệm & Mục Đích Phát Triển (Disclaimer)

- 🎓 **Mục Đích Học Tập**: Dự án **NgocHiepTV** được xây dựng thuần túy dành cho mục đích **học tập, nghiên cứu công nghệ lập trình Web** (Next.js 15, TypeScript, Tailwind CSS). Dự án hoàn toàn **phi thương mại**, không chạy quảng cáo và không thu bất kỳ chi phí nào từ người dùng.
- 🎬 **Quyền Bản Quyền**: NgocHiepTV không sở hữu hay lưu trữ bất kỳ tệp video nào trên máy chủ riêng. Tất cả nội dung phim được chia sẻ và nhúng trực tiếp từ các máy chủ chia sẻ video công khai trên Internet.
- 📩 Mọi thắc mắc liên quan đến bản quyền nội dung vui lòng liên hệ với nhà cung cấp máy chủ lưu trữ nguồn tương ứng.

---

© 2026 **NgocHiepTV**. Dự án phi thương mại phục vụ mục đích học tập. Built with ❤️ using **Next.js** & **Tailwind CSS**.
