import React from 'react';
import { Metadata } from 'next';
import { getMoviesByCategory, CATEGORY_LIST } from '@/lib/api';
import CategoryListClient from '@/components/CategoryListClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const catObj = CATEGORY_LIST.find((c) => c.slug === slug);
  const titleName = catObj?.name || 'Danh Sách Phim';

  return {
    title: `Danh Sách ${titleName} - Trang ${page}`,
    description: `Khám phá danh sách ${titleName} cập nhật mới nhất, vietsub chất lượng cao HD mượt mà trên NgocHiepTV.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const catObj = CATEGORY_LIST.find((c) => c.slug === slug);
  const titleName = catObj?.name || slug;

  const res = await getMoviesByCategory(slug, currentPage);

  return (
    <CategoryListClient
      titleName={titleName}
      slug={slug}
      type="category"
      currentPage={currentPage}
      initialRes={res}
      baseUrl={`/danh-sach/${slug}`}
    />
  );
}
