'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MovieListItem } from '@/lib/api';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: MovieListItem[];
  viewMoreUrl?: string;
  icon?: React.ReactNode;
}

export default function MovieCarousel({ title, movies, viewMoreUrl, icon }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 relative group/row">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon || <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />}
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>

        {viewMoreUrl && (
          <Link
            href={viewMoreUrl}
            className="text-[11px] sm:text-sm font-semibold text-red-500 hover:text-red-400 flex items-center space-x-0.5 sm:space-x-1 transition-colors"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel hidden sm:flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 hover:scale-110 transition-all shadow-xl"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory"
        >
          {movies.map((movie, index) => (
            <div
              key={movie.slug || index}
              className="flex-none w-[130px] sm:w-[170px] md:w-[190px] snap-start"
            >
              <MovieCard movie={movie} priority={index < 4} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel hidden sm:flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 hover:scale-110 transition-all shadow-xl"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
