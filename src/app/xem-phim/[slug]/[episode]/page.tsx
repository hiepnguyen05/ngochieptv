import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMovieDetail, getNewMovies } from '@/lib/api';
import WatchPlayer from '@/components/WatchPlayer';
import MovieCarousel from '@/components/MovieCarousel';

interface Props {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, episode } = await params;
  const res = await getMovieDetail(slug);
  const movie = res?.movie;

  if (!movie) {
    return { title: 'Tập phim không tồn tại' };
  }

  const title = `Xem Phim ${movie.name} ${episode.replace('tap-', 'Tập ')} HD Vietsub`;
  const description = `Xem phim ${movie.name} ${episode.replace('tap-', 'Tập ')} chất lượng cao HD Vietsub miễn phí trực tuyến trên NgocHiepTV.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.episode',
      images: [{ url: movie.poster_url || movie.thumb_url }],
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug, episode } = await params;
  const [detailRes, newMoviesRes] = await Promise.all([
    getMovieDetail(slug),
    getNewMovies(1),
  ]);

  const movie = detailRes?.movie;
  if (!movie) {
    notFound();
  }

  const relatedMovies = newMoviesRes?.items?.filter((m) => m.slug !== movie.slug) || [];

  return (
    <div className="min-h-screen pb-16 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
        <div className="glass-panel p-6 rounded-2xl space-y-4">
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
        <div className="pt-4">
          <MovieCarousel title="Phim Đề Xuất Cho Bạn" movies={relatedMovies} />
        </div>
      </div>
    </div>
  );
}
