import React from 'react';
import { Metadata } from 'next';
import { getMoviesByCountry, COUNTRY_LIST } from '@/lib/api';
import CategoryListClient from '@/components/CategoryListClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const item = COUNTRY_LIST.find((c) => c.slug === slug);
  const titleName = item?.name || 'Quốc Gia';

  return {
    title: `Phim ${titleName} - Trang ${page}`,
    description: `Tuyển tập phim ${titleName} đặc sắc nhất, tuyển chọn HD Vietsub mượt mà trên NgocHiepTV.`,
  };
}

export default async function CountryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const item = COUNTRY_LIST.find((c) => c.slug === slug);
  const titleName = item?.name || slug;

  const res = await getMoviesByCountry(slug, currentPage);

  return (
    <CategoryListClient
      titleName={`Phim ${titleName}`}
      slug={slug}
      type="country"
      currentPage={currentPage}
      initialRes={res}
      baseUrl={`/quoc-gia/${slug}`}
    />
  );
}
