import React from 'react';
import { getNewMovies, getMoviesByCategory } from '@/lib/api';
import HeroBanner from '@/components/HeroBanner';
import MovieCarousel from '@/components/MovieCarousel';
import { Film, Tv, Flame, Clapperboard, Sparkles } from 'lucide-react';

export const revalidate = 600; // Revalidate home page every 10 minutes

export default async function HomePage() {
  const [newMoviesRes, seriesRes, singleMoviesRes, airingRes] = await Promise.all([
    getNewMovies(1),
    getMoviesByCategory('phim-bo', 1),
    getMoviesByCategory('phim-le', 1),
    getMoviesByCategory('dang-chieu', 1),
  ]);

  const newMovies = newMoviesRes?.items || [];
  const seriesMovies = seriesRes?.items || [];
  const singleMovies = singleMoviesRes?.items || [];
  const airingMovies = airingRes?.items || [];

  return (
    <div className="pb-16 space-y-4">
      {/* Top Featured Hero Banner */}
      <HeroBanner movies={newMovies} />

      {/* Movie Rails */}
      <div className="space-y-6 -mt-8 relative z-20">
        <MovieCarousel
          title="Phim Mới Cập Nhật"
          movies={newMovies}
          icon={<Flame className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />}
        />

        <MovieCarousel
          title="Phim Bộ Nổi Bật"
          movies={seriesMovies}
          viewMoreUrl="/danh-sach/phim-bo"
          icon={<Tv className="w-6 h-6 text-blue-500" />}
        />

        <MovieCarousel
          title="Phim Lẻ Chiếu Rạp"
          movies={singleMovies}
          viewMoreUrl="/danh-sach/phim-le"
          icon={<Clapperboard className="w-6 h-6 text-purple-500" />}
        />

        <MovieCarousel
          title="Phim Đang Chiếu Hot"
          movies={airingMovies}
          viewMoreUrl="/danh-sach/dang-chieu"
          icon={<Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />}
        />
      </div>
    </div>
  );
}
