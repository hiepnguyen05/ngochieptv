'use client';

import React, { useState, useEffect } from 'react';
import { MovieListResponse, getMoviesByCategory, getMoviesByGenre, getMoviesByCountry, API_BASE, TARGET_ITEMS_PER_PAGE } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { MovieGridSkeleton } from '@/components/Skeletons';
import { Film } from 'lucide-react';

interface CategoryListClientProps {
  titleName: string;
  slug: string;
  type: 'category' | 'genre' | 'country';
  currentPage: number;
  initialRes: MovieListResponse | null;
  baseUrl: string;
}

export default function CategoryListClient({
  titleName,
  slug,
  type,
  currentPage,
  initialRes,
  baseUrl,
}: CategoryListClientProps) {
  const [data, setData] = useState<MovieListResponse | null>(initialRes);
  const [isLoading, setIsLoading] = useState(!initialRes || !initialRes.items || initialRes.items.length === 0);

  useEffect(() => {
    // If server fetch succeeded, use server data
    if (initialRes && initialRes.items && initialRes.items.length > 0) {
      setData(initialRes);
      setIsLoading(false);
      return;
    }

    // Client-side fallback fetch directly from user's browser
    let isMounted = true;
    setIsLoading(true);

    async function clientFetch() {
      try {
        let endpoint = '';
        if (type === 'category') endpoint = `/films/danh-sach/${slug}`;
        else if (type === 'genre') endpoint = `/films/the-loai/${slug}`;
        else if (type === 'country') endpoint = `/films/quoc-gia/${slug}`;

        // Aggregated client fetch for 25 items/page
        const startIdx = (currentPage - 1) * TARGET_ITEMS_PER_PAGE;
        const endIdx = startIdx + TARGET_ITEMS_PER_PAGE;
        const startApi = Math.floor(startIdx / 10) + 1;
        const endApi = Math.floor((endIdx - 1) / 10) + 1;

        const promises = [];
        for (let p = startApi; p <= endApi; p++) {
          promises.push(
            fetch(`${API_BASE}${endpoint}?page=${p}`).then((r) => (r.ok ? r.json() : null))
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
        console.error('Client Fallback Fetch Error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    clientFetch();
    return () => {
      isMounted = false;
    };
  }, [slug, type, currentPage, initialRes]);

  const movies = data?.items || [];
  const paginate = data?.paginate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 min-h-screen">
      {/* Header Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
          <Film className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{titleName}</h1>
          <p className="text-xs text-zinc-400">
            {paginate ? `Tổng số ${paginate.total_items} bộ phim` : 'Danh sách phim chất lượng cao Vietsub'}
          </p>
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <MovieGridSkeleton count={25} />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {movies.map((movie, idx) => (
            <MovieCard key={movie.slug || idx} movie={movie} priority={idx < 5} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl text-sm">
          Chưa tìm thấy bộ phim nào trong danh mục này.
        </div>
      )}

      {/* Pagination */}
      {paginate && <Pagination paginate={paginate} baseUrl={baseUrl} />}
    </div>
  );
}
