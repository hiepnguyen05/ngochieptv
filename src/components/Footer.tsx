import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Monitor, Film, Heart, Sparkles } from 'lucide-react';
import { CATEGORY_LIST, GENRE_LIST } from '@/lib/api';

export default function Footer() {
  const navCategories = CATEGORY_LIST.filter((cat) => cat.slug !== 'sap-chieu');

  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-[#090a0d] text-zinc-400 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand & Slogan */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="NgocHiepTV Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            NgocHiepTV - Nền tảng xem phim trực tuyến chất lượng cao hàng đầu. Mang đến trải nghiệm điện ảnh mượt mà với hàng ngàn bộ phim truyền hình, phim chiếu rạp Vietsub HD hoàn toàn miễn phí.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Zap className="w-3 h-3 text-red-500" />
              <span>Phát Nhanh HD</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Vietsub Chuẩn</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Monitor className="w-3 h-3 text-blue-500" />
              <span>Đa Thiết Bị</span>
            </span>
          </div>
        </div>

        {/* Col 2: Khám Phá Phim */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
            Khám Phá
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors">
                Trang Chủ
              </Link>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/danh-sach/${cat.slug}`} className="hover:text-red-500 transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tim-kiem" className="hover:text-red-500 transition-colors">
                Tìm Kiếm Phim
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Thể Loại Hot */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
            Thể Loại Hot
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {GENRE_LIST.slice(0, 8).map((genre) => (
              <li key={genre.slug}>
                <Link href={`/the-loai/${genre.slug}`} className="hover:text-red-500 transition-colors">
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Tuyên bố pháp lý & Miễn trừ */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
            Miễn Trừ Trách Nhiệm
          </h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            🎓 <span className="text-zinc-300">Dự án phi thương mại</span> xây dựng thuần túy cho mục đích học tập & nghiên cứu công nghệ lập trình Web.
          </p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            NgocHiepTV không sở hữu hay lưu trữ bất kỳ tệp video nào trên máy chủ riêng. Tất cả nội dung được nhúng từ các máy chủ công khai trên Internet.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <p>© {new Date().getFullYear()} NgocHiepTV. Dự án học tập phi thương mại.</p>
        <div className="flex items-center space-x-4 text-xs">
          <span>Tối ưu trải nghiệm cho Cinema Player</span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center space-x-1">
            <span>Powered by Next.js</span>
            <Sparkles className="w-3 h-3 text-red-500" />
          </span>
        </div>
      </div>
    </footer>
  );
}
