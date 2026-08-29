import React from 'react';
import Link from 'next/link';
import { getNewMovies } from '@/lib/api';
import MovieCarousel from '@/components/MovieCarousel';
import { Home, Search, Film, AlertCircle, ArrowLeft } from 'lucide-react';

export default async function NotFound() {
  const newMoviesRes = await getNewMovies(1);
  const movies = newMoviesRes?.items?.slice(0, 8) || [];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
        {/* Glowing 404 Badge */}
        <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
          <AlertCircle className="w-4 h-4" />
          <span>Lỗi 404 - Đường dẫn không tồn tại</span>
        </div>

        {/* High-Impact 404 Graphic Number */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-500 drop-shadow-2xl">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ốp! Trang Bạn Tìm Kiếm Không Tồn Tại
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Đường dẫn phim này có thể đã bị thay đổi, xóa hoặc không còn hoạt động trên hệ thống NgocHiepTV.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-900/40 hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Quay Về Trang Chủ</span>
          </Link>

          <Link
            href="/tim-kiem"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl glass-panel hover:bg-white/10 text-zinc-200 border border-white/10 font-bold text-xs sm:text-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Tìm Kiếm Phim Khác</span>
          </Link>
        </div>
      </div>

      {/* Suggested Hot Movies Rail */}
      {movies.length > 0 && (
        <div className="w-full max-w-7xl mt-16 relative z-10 pt-8 border-t border-zinc-800/60">
          <MovieCarousel title="Khám Phá Phim Hot Ngay" movies={movies} />
        </div>
      )}
    </div>
  );
}
