'use client';

import React, { useState, useEffect } from 'react';
import { MovieListItem, API_BASE } from '@/lib/api';
import HeroBanner from '@/components/HeroBanner';
import MovieCarousel from '@/components/MovieCarousel';
import { HeroBannerSkeleton, MovieGridSkeleton } from '@/components/Skeletons';
import { Flame, Tv, Clapperboard, Sparkles } from 'lucide-react';

interface HomeClientProps {
  initialNewMovies: MovieListItem[];
  initialSeriesMovies: MovieListItem[];
  initialSingleMovies: MovieListItem[];
  initialAiringMovies: MovieListItem[];
}

export default function HomeClient({
  initialNewMovies,
  initialSeriesMovies,
  initialSingleMovies,
  initialAiringMovies,
}: HomeClientProps) {
  const [newMovies, setNewMovies] = useState<MovieListItem[]>(initialNewMovies);
  const [seriesMovies, setSeriesMovies] = useState<MovieListItem[]>(initialSeriesMovies);
  const [singleMovies, setSingleMovies] = useState<MovieListItem[]>(initialSingleMovies);
  const [airingMovies, setAiringMovies] = useState<MovieListItem[]>(initialAiringMovies);
  const [isLoading, setIsLoading] = useState(initialNewMovies.length === 0);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllRails() {
      try {
        const endpoints = [
          { key: 'new', url: `${API_BASE}/films/phim-moi-cap-nhat?page=1` },
          { key: 'series', url: `${API_BASE}/films/danh-sach/phim-bo?page=1` },
          { key: 'single', url: `${API_BASE}/films/danh-sach/phim-le?page=1` },
          { key: 'airing', url: `${API_BASE}/films/danh-sach/dang-chieu?page=1` },
        ];

        const results = await Promise.all(
          endpoints.map((ep) =>
            fetch(ep.url)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          )
        );

        if (!isMounted) return;

        if (results[0]?.items?.length) setNewMovies(results[0].items);
        if (results[1]?.items?.length) setSeriesMovies(results[1].items);
        if (results[2]?.items?.length) setSingleMovies(results[2].items);
        if (results[3]?.items?.length) setAiringMovies(results[3].items);
      } catch (err) {
        console.error('Client Home Fetch Error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Only client fetch if initial server fetch returned empty arrays (Vercel 403)
    if (
      initialNewMovies.length === 0 ||
      initialSeriesMovies.length === 0 ||
      initialSingleMovies.length === 0
    ) {
      fetchAllRails();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialNewMovies, initialSeriesMovies, initialSingleMovies, initialAiringMovies]);

  if (isLoading && newMovies.length === 0) {
    return (
      <div className="pb-16 space-y-8">
        <HeroBannerSkeleton />
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <MovieGridSkeleton count={10} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 space-y-4">
      {/* Top Featured Hero Banner */}
      {newMovies.length > 0 && <HeroBanner movies={newMovies} />}

      {/* Movie Rails */}
      <div className="space-y-6 -mt-8 relative z-20">
        {newMovies.length > 0 && (
          <MovieCarousel
            title="Phim Mới Cập Nhật"
            movies={newMovies}
            icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500 animate-pulse" />}
          />
        )}

        {seriesMovies.length > 0 && (
          <MovieCarousel
            title="Phim Bộ Nổi Bật"
            movies={seriesMovies}
            viewMoreUrl="/danh-sach/phim-bo"
            icon={<Tv className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
          />
        )}

        {singleMovies.length > 0 && (
          <MovieCarousel
            title="Phim Lẻ Chiếu Rạp"
            movies={singleMovies}
            viewMoreUrl="/danh-sach/phim-le"
            icon={<Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />}
          />
        )}

        {airingMovies.length > 0 && (
          <MovieCarousel
            title="Phim Đang Chiếu Hot"
            movies={airingMovies}
            viewMoreUrl="/danh-sach/dang-chieu"
            icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />}
          />
        )}
      </div>
    </div>
  );
}
