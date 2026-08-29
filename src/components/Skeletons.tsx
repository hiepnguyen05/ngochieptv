import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-white/5 aspect-[2/3] w-full animate-pulse p-3 flex flex-col justify-end">
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <MovieCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[60vh] bg-zinc-900 animate-pulse flex items-end p-8">
      <div className="space-y-4 max-w-xl">
        <div className="h-6 bg-zinc-800 rounded w-32" />
        <div className="h-10 bg-zinc-800 rounded w-3/4" />
        <div className="h-16 bg-zinc-800/70 rounded w-full" />
      </div>
    </div>
  );
}
