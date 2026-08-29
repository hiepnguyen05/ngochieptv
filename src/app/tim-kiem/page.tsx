import React from 'react';
import { Metadata } from 'next';
import { searchMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Search, Film } from 'lucide-react';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = '' } = await searchParams;
  const title = q ? `Tìm Kiếm Phim: "${q}"` : 'Tìm Kiếm Phim Online';

  return {
    title,
    description: `Tìm kiếm bộ phim ${q} nhanh chóng, kết quả chuẩn xác vietsub HD mượt mà trên NgocHiepTV.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const query = q.trim();

  const res = query ? await searchMovies(query, currentPage) : null;
  const movies = res?.items || [];
  const paginate = res?.paginate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white">Kết Quả Tìm Kiếm</h1>
            <p className="text-[11px] sm:text-xs text-zinc-400">
              {query ? `Từ khóa: "${query}"` : 'Nhập tên phim để bắt đầu tìm kiếm'}
            </p>
          </div>
        </div>

        <form action="/tim-kiem" method="GET" className="relative max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Nhập tên phim, diễn viên..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-9 sm:pl-11 pr-20 sm:pr-24 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Tìm Kiếm
          </button>
        </form>
      </div>

      {/* Search Results */}
      {query ? (
        movies.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-xs text-zinc-400 font-semibold">
              {paginate ? `Tìm thấy ${paginate.total_items} phim phù hợp` : `Có ${movies.length} kết quả`}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {movies.map((movie, idx) => (
                <MovieCard key={movie.slug || idx} movie={movie} priority={idx < 5} />
              ))}
            </div>

            {paginate && <Pagination paginate={paginate} baseUrl={`/tim-kiem?q=${encodeURIComponent(query)}`} />}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl space-y-3">
            <Film className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-base font-semibold text-white">Không tìm thấy phim phù hợp</p>
            <p className="text-xs text-zinc-500">
              Hãy thử kiểm tra lại chính tả từ khóa hoặc tìm theo từ khóa chung hơn (ví dụ: &quot;Võ thuật&quot;, &quot;Hoạt hình&quot;).
            </p>
          </div>
        )
      ) : (
        <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl">
          Hãy nhập tên phim vào ô tìm kiếm ở trên để tra cứu.
        </div>
      )}
    </div>
  );
}
