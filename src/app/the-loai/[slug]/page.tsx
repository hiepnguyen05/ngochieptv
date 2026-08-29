import React from 'react';
import { Metadata } from 'next';
import { getMoviesByGenre, GENRE_LIST } from '@/lib/api';
import CategoryListClient from '@/components/CategoryListClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const item = GENRE_LIST.find((g) => g.slug === slug);
  const titleName = item?.name || 'Thể Loại Phim';

  return {
    title: `Phim Thể Loại ${titleName} - Trang ${page}`,
    description: `Tổng hợp danh sách phim thể loại ${titleName} hay nhất, xem phim HD Vietsub độc quyền tại NgocHiepTV.`,
  };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const item = GENRE_LIST.find((g) => g.slug === slug);
  const titleName = item?.name || slug;

  const res = await getMoviesByGenre(slug, currentPage);

  return (
    <CategoryListClient
      titleName={`Thể Loại: ${titleName}`}
      slug={slug}
      type="genre"
      currentPage={currentPage}
      initialRes={res}
      baseUrl={`/the-loai/${slug}`}
    />
  );
}
