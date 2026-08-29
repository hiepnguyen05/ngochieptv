import React from 'react';
import { Metadata } from 'next';
import { searchMovies } from '@/lib/api';
import SearchClient from '@/components/SearchClient';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = '' } = await searchParams;
  const title = q ? `Tìm Kiếm Phim: "${q}"` : 'Tìm Kiếm Phim Online';

  return {
    title,
    description: `Tìm kiếm bộ phim ${q} nhanh chóng, kết quả chuẩn xác vietsub HD mượt mà trên NgocHiepTV.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const query = q.trim();

  const res = query ? await searchMovies(query, currentPage).catch(() => null) : null;

  return (
    <SearchClient query={query} currentPage={currentPage} initialRes={res} />
  );
}
