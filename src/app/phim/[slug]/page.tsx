import React from 'react';
import { Metadata } from 'next';
import { getMovieDetail, getNewMovies } from '@/lib/api';
import MovieDetailClient from '@/components/MovieDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getMovieDetail(slug).catch(() => null);
  const movie = res?.movie;

  const title = movie
    ? `Phim ${movie.name} (${movie.original_name || ''}) HD Vietsub`
    : `Xem Phim HD Vietsub Online - NgocHiepTV`;

  const description = movie?.description
    ? movie.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
    : `Xem phim full HD Vietsub vietsub chất lượng cao mượt mà trên NgocHiepTV.`;

  return {
    title,
    description,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const [detailRes, newMoviesRes] = await Promise.all([
    getMovieDetail(slug).catch(() => null),
    getNewMovies(1).catch(() => null),
  ]);

  const movie = detailRes?.movie || null;
  const relatedMovies = newMoviesRes?.items?.filter((m) => m.slug !== slug) || [];

  return (
    <MovieDetailClient
      slug={slug}
      initialMovie={movie}
      initialRelatedMovies={relatedMovies}
    />
  );
}
