import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ items: [] });
  }

  try {
    const data = await searchMovies(q.trim(), 1);
    return NextResponse.json(data || { items: [] });
  } catch (error) {
    console.error('Search Proxy API Error:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
