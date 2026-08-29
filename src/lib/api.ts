export const API_BASE = 'https://phim.nguonc.com/api';
export const TARGET_ITEMS_PER_PAGE = 25;

export interface Pagination {
  current_page: number;
  total_page: number;
  total_items: number;
  items_per_page: number;
}

export interface MovieListItem {
  id?: string;
  name: string;
  slug: string;
  original_name?: string;
  thumb_url: string;
  poster_url: string;
  created?: string;
  modified?: string;
  description?: string;
  total_episodes?: number;
  current_episode?: string;
  time?: string;
  quality?: string;
  language?: string;
  year?: number;
}

export interface CategoryGroup {
  group: { name: string };
  list: { name: string }[];
}

export interface EpisodeItem {
  name: string;
  slug: string;
  embed: string;
}

export interface EpisodeServer {
  server_name: string;
  items: EpisodeItem[];
}

export interface MovieDetail {
  id: string;
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created?: string;
  modified?: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director: string;
  casts: string;
  category?: Record<string, CategoryGroup>;
  episodes: EpisodeServer[];
}

export interface MovieListResponse {
  status: string;
  paginate?: Pagination;
  items: MovieListItem[];
}

export interface MovieDetailResponse {
  status: string;
  movie?: MovieDetail;
}

// Fetch helper với revalidation
async function fetchAPI<T>(endpoint: string, revalidateSeconds = 1800): Promise<T | null> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: revalidateSeconds },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NgocHiepTv/1.0',
      },
    });

    if (!res.ok) {
      console.error(`API Fetch Error ${res.status}: ${url}`);
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    console.error(`API Exception for ${url}:`, error);
    return null;
  }
}

/**
 * Hàm gom trang thông minh: Chuyển đổi 10 phim/trang gốc của NguồnC API thành 25 phim/trang cho NgocHiepTV
 */
async function fetchAggregatedList(
  fetchSinglePageFn: (apiPage: number) => Promise<MovieListResponse | null>,
  userPage = 1,
  targetPerPage = TARGET_ITEMS_PER_PAGE
): Promise<MovieListResponse | null> {
  const startIdx = (userPage - 1) * targetPerPage;
  const endIdx = startIdx + targetPerPage;

  const startApi = Math.floor(startIdx / 10) + 1;
  const endApi = Math.floor((endIdx - 1) / 10) + 1;

  const pagePromises = [];
  for (let p = startApi; p <= endApi; p++) {
    pagePromises.push(fetchSinglePageFn(p));
  }

  const responses = await Promise.all(pagePromises);
  const combinedItems: MovieListItem[] = [];
  let totalItems = 0;

  for (const res of responses) {
    if (res?.items) {
      combinedItems.push(...res.items);
    }
    if (totalItems === 0 && res?.paginate?.total_items) {
      totalItems = res.paginate.total_items;
    }
  }

  const offsetStart = startIdx - (startApi - 1) * 10;
  const slicedItems = combinedItems.slice(offsetStart, offsetStart + targetPerPage);

  const totalPages = Math.ceil((totalItems || slicedItems.length) / targetPerPage);

  return {
    status: 'success',
    paginate: {
      current_page: userPage,
      total_page: totalPages,
      total_items: totalItems || slicedItems.length,
      items_per_page: targetPerPage,
    },
    items: slicedItems,
  };
}

// 1. Phim mới cập nhật (Gom 25 phim/trang)
export async function getNewMovies(userPage = 1): Promise<MovieListResponse | null> {
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/phim-moi-cap-nhat?page=${p}`, 600), userPage);
}

// 2. Danh sách theo danh mục (phim-bo, phim-le, dang-chieu, sap-chieu)
export async function getMoviesByCategory(slug: string, userPage = 1): Promise<MovieListResponse | null> {
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/danh-sach/${slug}?page=${p}`, 1800), userPage);
}

// 3. Chi tiết phim & danh sách tập
export async function getMovieDetail(slug: string): Promise<MovieDetailResponse | null> {
  return fetchAPI<MovieDetailResponse>(`/film/${slug}`, 3600);
}

// 4. Lọc phim theo thể loại
export async function getMoviesByGenre(slug: string, userPage = 1): Promise<MovieListResponse | null> {
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/the-loai/${slug}?page=${p}`, 1800), userPage);
}

// 5. Lọc phim theo quốc gia
export async function getMoviesByCountry(slug: string, userPage = 1): Promise<MovieListResponse | null> {
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/quoc-gia/${slug}?page=${p}`, 1800), userPage);
}

// 6. Lọc phim theo năm phát hành
export async function getMoviesByYear(year: string | number, userPage = 1): Promise<MovieListResponse | null> {
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/nam-phat-hanh/${year}?page=${p}`, 1800), userPage);
}

// 7. Tìm kiếm phim theo từ khóa
export async function searchMovies(keyword: string, userPage = 1): Promise<MovieListResponse | null> {
  const encoded = encodeURIComponent(keyword.trim());
  if (!encoded) return { status: 'success', items: [] };
  return fetchAggregatedList((p) => fetchAPI<MovieListResponse>(`/films/search?keyword=${encoded}&page=${p}`, 300), userPage);
}

// Danh mục định sẵn để tạo menu & routing
export const CATEGORY_LIST = [
  { name: 'Phim Đang Chiếu', slug: 'dang-chieu' },
  { name: 'Phim Bộ', slug: 'phim-bo' },
  { name: 'Phim Lẻ', slug: 'phim-le' },
  { name: 'Phim Sắp Chiếu', slug: 'sap-chieu' },
];

export const GENRE_LIST = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Tâm Lý', slug: 'tam-ly' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Võ Thuật', slug: 'vo-thuat' },
  { name: 'Hoạt Hình', slug: 'hoat-hinh' },
  { name: 'Học Đường', slug: 'hoc-duong' },
  { name: 'Thần Thoại', slug: 'than-thoai' },
];

export const COUNTRY_LIST = [
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Việt Nam', slug: 'viet-nam' },
  { name: 'Thái Lan', slug: 'thai-lan' },
];
