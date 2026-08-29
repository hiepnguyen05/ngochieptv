import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';

  if (!q.trim()) {
    return NextResponse.json({ items: [] });
  }

  try {
    const url = `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(q.trim())}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://phim.nguonc.com/',
        'Origin': 'https://phim.nguonc.com',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Search Proxy fetch Error ${res.status}: ${url}`);
      return NextResponse.json({ items: [] });
    }

    const data = await res.json();
    return NextResponse.json(data || { items: [] });
  } catch (error) {
    console.error('Search Proxy Exception:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
