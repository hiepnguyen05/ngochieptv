'use client';

import React, { useState, useEffect } from 'react';
import { MovieListResponse, API_BASE, TARGET_ITEMS_PER_PAGE } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { MovieGridSkeleton } from '@/components/Skeletons';
import { Search, Film } from 'lucide-react';

interface SearchClientProps {
  query: string;
  currentPage: number;
  initialRes: MovieListResponse | null;
}

export default function SearchClient({ query, currentPage, initialRes }: SearchClientProps) {
  const [data, setData] = useState<MovieListResponse | null>(initialRes);
  const [isLoading, setIsLoading] = useState(query ? (!initialRes || !initialRes.items || initialRes.items.length === 0) : false);

  useEffect(() => {
    if (!query) {
      setData(null);
      setIsLoading(false);
      return;
    }

    if (initialRes && initialRes.items && initialRes.items.length > 0) {
      setData(initialRes);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    async function clientFetch() {
      try {
        const startIdx = (currentPage - 1) * TARGET_ITEMS_PER_PAGE;
        const endIdx = startIdx + TARGET_ITEMS_PER_PAGE;
        const startApi = Math.floor(startIdx / 10) + 1;
        const endApi = Math.floor((endIdx - 1) / 10) + 1;

        const promises = [];
        for (let p = startApi; p <= endApi; p++) {
          promises.push(
            fetch(`${API_BASE}/films/search?keyword=${encodeURIComponent(query)}&page=${p}`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() =>
                fetch(`/api/search?q=${encodeURIComponent(query)}&page=${p}`).then((r) =>
                  r.ok ? r.json() : null
                )
              )
          );
        }

        const responses = await Promise.all(promises);
        const validRes = responses.filter(Boolean);

        if (validRes.length > 0) {
          let combinedItems: any[] = [];
          validRes.forEach((r) => {
            if (r.items) combinedItems = combinedItems.concat(r.items);
          });

          const totalItems = validRes[0]?.paginate?.total_items || combinedItems.length;
          const totalPage = Math.ceil(totalItems / TARGET_ITEMS_PER_PAGE) || 1;

          const sliceStart = startIdx - (startApi - 1) * 10;
          const pageItems = combinedItems.slice(sliceStart, sliceStart + TARGET_ITEMS_PER_PAGE);

          if (isMounted) {
            setData({
              status: 'success',
              items: pageItems,
              paginate: {
                current_page: currentPage,
                total_page: totalPage,
                total_items: totalItems,
                items_per_page: TARGET_ITEMS_PER_PAGE,
              },
            });
          }
        }
      } catch (err) {
        console.error('Client Search Fetch Error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    clientFetch();
    return () => {
      isMounted = false;
    };
  }, [query, currentPage, initialRes]);

  const movies = data?.items || [];
  const paginate = data?.paginate;

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
        isLoading ? (
          <MovieGridSkeleton count={25} />
        ) : movies.length > 0 ? (
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
              Hãy thử kiểm tra lại chính tả từ khóa hoặc tìm theo từ khóa chung hơn.
            </p>
          </div>
        )
      ) : (
        <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl text-sm">
          Hãy nhập tên phim vào ô tìm kiếm ở trên để tra cứu.
        </div>
      )}
    </div>
  );
}
