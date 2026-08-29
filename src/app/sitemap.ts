import { MetadataRoute } from 'next';
import { CATEGORY_LIST, GENRE_LIST, COUNTRY_LIST, getNewMovies } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ngochieptv.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/tim-kiem`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/danh-sach/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Genre routes
  const genreRoutes: MetadataRoute.Sitemap = GENRE_LIST.map((genre) => ({
    url: `${baseUrl}/the-loai/${genre.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Country routes
  const countryRoutes: MetadataRoute.Sitemap = COUNTRY_LIST.map((c) => ({
    url: `${baseUrl}/quoc-gia/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic movie routes from API
  const newMoviesRes = await getNewMovies(1);
  const movieRoutes: MetadataRoute.Sitemap = (newMoviesRes?.items || []).map((m) => ({
    url: `${baseUrl}/phim/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...genreRoutes, ...countryRoutes, ...movieRoutes];
}
