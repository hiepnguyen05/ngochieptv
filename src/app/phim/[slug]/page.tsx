import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMovieDetail, getNewMovies } from '@/lib/api';
import MovieCarousel from '@/components/MovieCarousel';
import { Play, Star, Calendar, Clock, Film, User, Tag, Globe } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getMovieDetail(slug);
  const movie = res?.movie;

  if (!movie) {
    return {
      title: 'Phim không tồn tại',
    };
  }

  const title = `Phim ${movie.name} (${movie.original_name || ''}) HD Vietsub`;
  const description = movie.description
    ? movie.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
    : `Xem phim ${movie.name} full HD Vietsub vietsub chất lượng cao mượt mà trên NgocHiepTV.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.movie',
      url: `https://ngochieptv.com/phim/${movie.slug}`,
      images: [{ url: movie.poster_url || movie.thumb_url }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [movie.poster_url || movie.thumb_url],
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const [detailRes, newMoviesRes] = await Promise.all([
    getMovieDetail(slug),
    getNewMovies(1),
  ]);

  const movie = detailRes?.movie;
  if (!movie) {
    notFound();
  }

  const relatedMovies = newMoviesRes?.items?.filter((m) => m.slug !== movie.slug) || [];
  const firstEpisodeSlug = movie.episodes?.[0]?.items?.[0]?.slug || 'tap-1';

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.name,
    alternateName: movie.original_name,
    image: movie.poster_url || movie.thumb_url,
    description: movie.description?.replace(/<[^>]*>?/gm, ''),
    director: movie.director ? { '@type': 'Person', name: movie.director } : undefined,
    actor: movie.casts
      ? movie.casts.split(',').map((name) => ({ '@type': 'Person', name: name.trim() }))
      : undefined,
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Backdrop & Details Header */}
      <div className="relative w-full bg-zinc-950 pt-8 pb-12 overflow-hidden">
        {/* Background Image with blur */}
        <div className="absolute inset-0 z-0">
          <img
            src={movie.poster_url || movie.thumb_url}
            alt={movie.name}
            className="w-full h-full object-cover filter blur-3xl opacity-20 scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-44 sm:w-64 md:w-72 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <img
                src={movie.thumb_url || movie.poster_url}
                alt={movie.name}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {movie.quality && (
                  <span className="px-2.5 py-1 text-xs font-black bg-red-600 text-white rounded-md uppercase tracking-wider">
                    {movie.quality}
                  </span>
                )}
              </div>
            </div>

            {/* Movie Information Column */}
            <div className="flex-1 space-y-4 sm:space-y-5 text-center md:text-left w-full">
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {movie.name}
                </h1>
                {movie.original_name && (
                  <p className="text-sm sm:text-lg text-zinc-400 font-medium italic mt-1">
                    {movie.original_name}
                  </p>
                )}
              </div>

              {/* Badges / Stats Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 text-xs text-zinc-300 font-medium">
                {movie.current_episode && (
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold">
                    {movie.current_episode}
                  </span>
                )}
                {movie.time && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{movie.time}</span>
                  </span>
                )}
                {movie.language && (
                  <span className="px-2.5 py-1 bg-zinc-800 rounded-lg border border-zinc-700">
                    {movie.language}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={`/xem-phim/${movie.slug}/${firstEpisodeSlug}`}
                  className="inline-flex w-full sm:w-auto items-center justify-center space-x-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-2xl shadow-red-900/50 hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                  <span>Xem Phim Ngay</span>
                </Link>
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-zinc-800/80 text-xs sm:text-sm text-left">
                <div>
                  <span className="text-zinc-500 font-semibold block mb-0.5">Đạo diễn:</span>
                  <span className="text-zinc-200">{movie.director || 'Đang cập nhật'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-semibold block mb-0.5">Diễn viên:</span>
                  <span className="text-zinc-200 line-clamp-2">{movie.casts || 'Đang cập nhật'}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="pt-2 text-left">
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2">Nội Dung Phim</h3>
                <div
                  className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal space-y-2 prose prose-invert max-w-none line-clamp-6 sm:line-clamp-none"
                  dangerouslySetInnerHTML={{ __html: movie.description || 'Chưa có mô tả nội dung.' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Selector Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Film className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <span>Danh Sách Tập Phim</span>
        </h2>

        {movie.episodes && movie.episodes.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {movie.episodes.map((server, sIdx) => (
              <div key={sIdx} className="glass-panel p-4 sm:p-5 rounded-2xl space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Server: {server.server_name}</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                  {server.items.map((ep) => (
                    <Link
                      key={ep.slug}
                      href={`/xem-phim/${movie.slug}/${ep.slug}`}
                      className="py-2.5 px-2 rounded-xl glass-panel text-center text-xs font-bold text-zinc-300 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-md"
                    >
                      {ep.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-zinc-400 rounded-2xl text-xs sm:text-sm">
            Tập phim đang được cập nhật, vui lòng quay lại sau!
          </div>
        )}

        {/* Related Movies */}
        <div className="pt-8">
          <MovieCarousel title="Có Thể Bạn Thích" movies={relatedMovies} />
        </div>
      </div>
    </div>
  );
}
