'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lightbulb, ChevronLeft, ChevronRight, Server, Film, Maximize } from 'lucide-react';
import { MovieDetail, EpisodeServer, EpisodeItem } from '@/lib/api';

interface WatchPlayerProps {
  movie: MovieDetail;
  currentEpisodeSlug: string;
}

export default function WatchPlayer({ movie, currentEpisodeSlug }: WatchPlayerProps) {
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [isLightOff, setIsLightOff] = useState(false);
  const router = useRouter();

  const currentServer: EpisodeServer | undefined = movie.episodes?.[selectedServerIdx] || movie.episodes?.[0];
  const items: EpisodeItem[] = currentServer?.items || [];

  // Find current episode item
  let currentEpIndex = items.findIndex((ep) => ep.slug === currentEpisodeSlug);
  if (currentEpIndex === -1 && items.length > 0) {
    currentEpIndex = 0;
  }

  const currentEp = items[currentEpIndex];
  const prevEp = currentEpIndex > 0 ? items[currentEpIndex - 1] : null;
  const nextEp = currentEpIndex < items.length - 1 ? items[currentEpIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Light dimming overlay */}
      {isLightOff && (
        <div
          onClick={() => setIsLightOff(false)}
          className="fixed inset-0 bg-black/95 z-40 transition-opacity cursor-pointer flex items-start justify-center pt-4"
        >
          <span className="text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
            Bấm vào bất kỳ đâu để bật lại đèn 💡
          </span>
        </div>
      )}

      {/* Video Player Container */}
      <div className={`relative w-full rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl transition-all ${isLightOff ? 'z-50 ring-4 ring-red-600/50' : ''}`}>
        <div className="relative aspect-video w-full bg-black">
          {currentEp?.embed ? (
            <iframe
              src={currentEp.embed}
              title={`${movie.name} - ${currentEp.name}`}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 p-6 text-center">
              <Film className="w-12 h-12 text-zinc-600" />
              <p className="text-sm">Không tìm thấy nguồn phát cho tập phim này.</p>
            </div>
          )}
        </div>

        {/* Player Action Controls Bar */}
        <div className="p-3 sm:p-4 bg-zinc-900/90 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Episode Info */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="font-bold text-white text-sm sm:text-base line-clamp-1">{movie.name}</span>
            {currentEp && (
              <span className="px-2.5 py-1 bg-red-600/90 text-white font-black rounded-lg text-xs shrink-0">
                Tập {currentEp.name}
              </span>
            )}
          </div>

          {/* Controls: Prev/Next & Light */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsLightOff(!isLightOff)}
              className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isLightOff
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isLightOff ? 'Bật Đèn' : 'Tắt Đèn'}</span>
            </button>

            {prevEp && (
              <Link
                href={`/xem-phim/${movie.slug}/${prevEp.slug}`}
                className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Trước</span>
              </Link>
            )}

            {nextEp && (
              <Link
                href={`/xem-phim/${movie.slug}/${nextEp.slug}`}
                className="inline-flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                <span>Sau</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Server & Episode Selector */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4 sm:space-y-5">
        {/* Server Switcher */}
        {movie.episodes && movie.episodes.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-semibold mr-2">
              <Server className="w-4 h-4 text-red-500" />
              <span>Server:</span>
            </div>
            {movie.episodes.map((server, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setSelectedServerIdx(sIdx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedServerIdx === sIdx
                    ? 'bg-red-600 text-white shadow-lg border border-red-500'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {server.server_name}
              </button>
            ))}
          </div>
        )}

        {/* Episode Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>Chọn Tập Phim ({items.length} tập)</span>
            <span>Server: {currentServer?.server_name || 'Vietsub'}</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2 max-h-72 overflow-y-auto pr-1">
            {items.map((ep) => {
              const isCurrent = ep.slug === currentEpisodeSlug;
              return (
                <Link
                  key={ep.slug}
                  href={`/xem-phim/${movie.slug}/${ep.slug}`}
                  className={`py-2.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-red-600 text-white border border-red-400 shadow-lg scale-105'
                      : 'glass-panel text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {ep.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
