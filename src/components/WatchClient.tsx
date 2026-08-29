'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MovieDetail, MovieListItem, API_BASE } from '@/lib/api';
import WatchPlayer from '@/components/WatchPlayer';
import MovieCarousel from '@/components/MovieCarousel';
import { HeroBannerSkeleton } from '@/components/Skeletons';

interface WatchClientProps {
  slug: string;
  episode: string;
  initialMovie: MovieDetail | null;
  initialRelatedMovies: MovieListItem[];
}

export default function WatchClient({
  slug,
  episode,
  initialMovie,
  initialRelatedMovies,
}: WatchClientProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(initialMovie);
  const [relatedMovies, setRelatedMovies] = useState<MovieListItem[]>(initialRelatedMovies);
  const [isLoading, setIsLoading] = useState(!initialMovie);

  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    async function clientFetch() {
      try {
        const [detailRes, newRes] = await Promise.all([
          fetch(`${API_BASE}/film/${slug}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`${API_BASE}/films/phim-moi-cap-nhat?page=1`).then((r) => (r.ok ? r.json() : null)),
        ]);

        if (!isMounted) return;

        if (detailRes?.movie) {
          setMovie(detailRes.movie);
        }
        if (newRes?.items) {
          setRelatedMovies(newRes.items.filter((m: MovieListItem) => m.slug !== slug));
        }
      } catch (err) {
        console.error('Client Watch Page Fetch Error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    clientFetch();
    return () => {
      isMounted = false;
    };
  }, [slug, initialMovie]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen pb-16 pt-8 max-w-7xl mx-auto px-4 space-y-6">
        <HeroBannerSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-red-500">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link href={`/phim/${movie.slug}`} className="hover:text-red-500 line-clamp-1">
            {movie.name}
          </Link>
          <span>/</span>
          <span className="text-red-400 font-semibold uppercase">{episode.replace('tap-', 'Tập ')}</span>
        </div>

        {/* Video Player & Episode Selector */}
        <WatchPlayer movie={movie} currentEpisodeSlug={episode} />

        {/* Movie Info Card Below Player */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{movie.name}</h1>
              {movie.original_name && (
                <p className="text-sm text-zinc-400 italic">{movie.original_name}</p>
              )}
            </div>

            <Link
              href={`/phim/${movie.slug}`}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-zinc-700 transition-all"
            >
              Xem Chi Tiết Phim
            </Link>
          </div>

          <div
            className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-4"
            dangerouslySetInnerHTML={{ __html: movie.description || '' }}
          />
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="pt-4">
            <MovieCarousel title="Phim Đề Xuất Cho Bạn" movies={relatedMovies} />
          </div>
        )}
      </div>
    </div>
  );
}
