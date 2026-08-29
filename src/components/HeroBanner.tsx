'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { MovieListItem } from '@/lib/api';

interface HeroBannerProps {
  movies: MovieListItem[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = movies.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!featured || featured.length === 0) return null;

  const currentMovie = featured[currentIndex];
  const backdropUrl = currentMovie.poster_url || currentMovie.thumb_url;

  return (
    <div className="relative w-full h-[55vh] min-h-[360px] sm:h-[65vh] max-h-[720px] overflow-hidden bg-zinc-950">
      {/* Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdropUrl}
          alt={currentMovie.name}
          className="w-full h-full object-cover object-top filter brightness-90 scale-105 animate-in fade-in duration-700"
        />
        {/* Gradient overlays for cinematic Netflix look */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-16">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Badge Tag */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-600/90 text-white shadow-lg shadow-red-900/40">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>PHIM MỚI NỔI BẬT</span>
            </span>
            {currentMovie.quality && (
              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-zinc-800/90 text-amber-400 border border-amber-500/30">
                {currentMovie.quality}
              </span>
            )}
            {currentMovie.year && (
              <span className="text-[11px] sm:text-xs text-zinc-300 font-semibold">{currentMovie.year}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight sm:leading-none line-clamp-2">
            {currentMovie.name}
          </h1>

          {currentMovie.original_name && (
            <p className="text-xs sm:text-base text-zinc-300 font-medium italic line-clamp-1">
              {currentMovie.original_name}
            </p>
          )}

          {/* Description snippet */}
          <p className="text-[11px] sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {currentMovie.description ||
              `Thưởng thức trọn bộ phim ${currentMovie.name} chất lượng cao HD Vietsub độc quyền tại NgocHiepTV.`}
          </p>

          {/* Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pt-1 sm:pt-2">
            <Link
              href={`/phim/${currentMovie.slug}`}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-900/40 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>Xem Phim</span>
            </Link>

            <Link
              href={`/phim/${currentMovie.slug}`}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/90 text-white font-semibold text-xs sm:text-sm border border-white/10 backdrop-blur-md transition-all"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
              <span>Chi Tiết</span>
            </Link>
          </div>

          {/* Mobile Dots */}
          <div className="flex sm:hidden items-center justify-start space-x-1.5 pt-2">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-red-600' : 'w-1.5 bg-white/30'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Dots */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center space-x-2">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
