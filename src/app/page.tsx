import React from 'react';
import { getNewMovies, getMoviesByCategory } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

export const revalidate = 300;

export default async function HomePage() {
  const [newMoviesRes, seriesRes, singleMoviesRes, airingRes] = await Promise.all([
    getNewMovies(1).catch(() => null),
    getMoviesByCategory('phim-bo', 1).catch(() => null),
    getMoviesByCategory('phim-le', 1).catch(() => null),
    getMoviesByCategory('dang-chieu', 1).catch(() => null),
  ]);

  return (
    <HomeClient
      initialNewMovies={newMoviesRes?.items || []}
      initialSeriesMovies={seriesRes?.items || []}
      initialSingleMovies={singleMoviesRes?.items || []}
      initialAiringMovies={airingRes?.items || []}
    />
  );
}
