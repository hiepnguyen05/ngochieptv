import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMoviesByCountry, COUNTRY_LIST } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { Globe } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const countryObj = COUNTRY_LIST.find((c) => c.slug === slug);
  const titleName = countryObj?.name || 'Phim Quốc Gia';

  return {
    title: `Phim ${titleName} - Trang ${page}`,
    description: `Xem các bộ phim sản xuất tại ${titleName} vietsub chất lượng cao HD mới nhất trên NgocHiepTV.`,
  };
}

export default async function CountryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const countryObj = COUNTRY_LIST.find((c) => c.slug === slug);
  const titleName = countryObj?.name || slug;

  const res = await getMoviesByCountry(slug, currentPage);
  if (!res) notFound();

  const movies = res.items || [];
  const paginate = res.paginate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Phim: {titleName}</h1>
          <p className="text-xs text-zinc-400">
            {paginate ? `Tổng số ${paginate.total_items} bộ phim từ ${titleName}` : 'Danh sách phim chất lượng cao'}
          </p>
        </div>
      </div>

      {/* Grid List */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie, idx) => (
            <MovieCard key={movie.slug || idx} movie={movie} priority={idx < 5} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl">
          Chưa có bộ phim nào thuộc quốc gia này.
        </div>
      )}

      {/* Pagination */}
      {paginate && <Pagination paginate={paginate} baseUrl={`/quoc-gia/${slug}`} />}
    </div>
  );
}
