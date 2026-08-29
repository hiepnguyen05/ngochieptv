import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '@/lib/api';

interface PaginationProps {
  paginate: PaginationType;
  baseUrl: string;
}

export default function Pagination({ paginate, baseUrl }: PaginationProps) {
  const { current_page, total_page } = paginate;

  if (!total_page || total_page <= 1) return null;

  const createPageUrl = (page: number) => {
    if (baseUrl.includes('?')) {
      // url already has params (like search)
      const urlObj = new URL(baseUrl, 'https://ngochieptv.com');
      urlObj.searchParams.set('page', page.toString());
      return `${urlObj.pathname}${urlObj.search}`;
    }
    return `${baseUrl}?page=${page}`;
  };

  // Generate page numbers window
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, current_page - 2);
  let endPage = Math.min(total_page, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Prev Button */}
      {current_page > 1 ? (
        <Link
          href={createPageUrl(current_page - 1)}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-zinc-300 hover:text-white hover:border-red-600/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-sm font-semibold text-zinc-300 hover:text-white"
          >
            1
          </Link>
          {startPage > 2 && <span className="text-zinc-600 px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
            page === current_page
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500'
              : 'glass-panel text-zinc-300 hover:text-white hover:border-white/20'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < total_page && (
        <>
          {endPage < total_page - 1 && <span className="text-zinc-600 px-1">...</span>}
          <Link
            href={createPageUrl(total_page)}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-sm font-semibold text-zinc-300 hover:text-white"
          >
            {total_page}
          </Link>
        </>
      )}

      {/* Next Button */}
      {current_page < total_page ? (
        <Link
          href={createPageUrl(current_page + 1)}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-zinc-300 hover:text-white hover:border-red-600/50 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
