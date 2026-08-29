import React from 'react';
import { Metadata } from 'next';
import { getMovieDetail, getNewMovies } from '@/lib/api';
import WatchClient from '@/components/WatchClient';

interface Props {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, episode } = await params;
  const res = await getMovieDetail(slug).catch(() => null);
  const movie = res?.movie;

  const title = movie
    ? `Xem Phim ${movie.name} ${episode.replace('tap-', 'Tập ')} HD Vietsub`
    : `Xem Phim HD Vietsub Online - NgocHiepTV`;

  const description = movie
    ? `Xem phim ${movie.name} ${episode.replace('tap-', 'Tập ')} chất lượng cao HD Vietsub miễn phí trực tuyến trên NgocHiepTV.`
    : `Xem phim HD Vietsub mượt mà trên NgocHiepTV.`;

  return {
    title,
    description,
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug, episode } = await params;
  const [detailRes, newMoviesRes] = await Promise.all([
    getMovieDetail(slug).catch(() => null),
    getNewMovies(1).catch(() => null),
  ]);

  const movie = detailRes?.movie || null;
  const relatedMovies = newMoviesRes?.items?.filter((m) => m.slug !== slug) || [];

  return (
    <WatchClient
      slug={slug}
      episode={episode}
      initialMovie={movie}
      initialRelatedMovies={relatedMovies}
    />
  );
}
