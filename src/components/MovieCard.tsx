import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Film } from 'lucide-react';
import { MovieListItem } from '@/lib/api';

interface MovieCardProps {
  movie: MovieListItem;
  priority?: boolean;
}

function formatLanguageBadge(lang?: string): string {
  if (!lang) return '';
  const l = lang.toLowerCase();
  if (
    (l.includes('sub') || l.includes('vietsub')) &&
    (l.includes('thuyết minh') || l.includes('thuyet minh') || l.includes('lồng tiếng') || l.includes('long tieng'))
  ) {
    return 'Sub + TM';
  }
  if (l.includes('thuyết minh') || l.includes('thuyet minh')) {
    return 'Thuyết Minh';
  }
  if (l.includes('lồng tiếng') || l.includes('long tieng')) {
    return 'Lồng Tiếng';
  }
  if (l.includes('vietsub')) {
    return 'Vietsub';
  }
  return lang;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  // Image fallbacks
  const imageUrl = movie.thumb_url || movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image';
  const displayLanguage = formatLanguageBadge(movie.language);

  return (
    <Link href={`/phim/${movie.slug}`} className="group block relative">
      <div className="movie-card relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 aspect-[2/3] w-full">
        {/* Poster Image */}
        <img
          src={imageUrl}
          alt={movie.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges: Quality on Top-Left, Episode on Top-Right */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          {movie.quality ? (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase bg-red-600/95 text-white rounded-md shadow-md shrink-0">
              {movie.quality}
            </span>
          ) : <span />}

          {movie.current_episode && (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-amber-500/95 text-zinc-950 rounded-md shadow-md shrink-0 whitespace-nowrap">
              {movie.current_episode}
            </span>
          )}
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-900/50 scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-1" />
          </div>
        </div>

        {/* Bottom Metadata Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 z-10 flex flex-col justify-end space-y-1">
          {/* Language Badge on Bottom */}
          {movie.language && (
            <div>
              <span className="inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-black/80 text-zinc-200 border border-white/10 rounded-md backdrop-blur-md max-w-full truncate">
                {movie.language}
              </span>
            </div>
          )}

          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {movie.name}
          </h3>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="line-clamp-1 italic text-[10px] sm:text-[11px] text-zinc-400">
              {movie.original_name || movie.name}
            </span>
            {movie.year && <span className="font-medium text-zinc-300 text-[10px] sm:text-xs ml-1 shrink-0">{movie.year}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
