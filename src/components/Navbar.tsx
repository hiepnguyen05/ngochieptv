'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Loader2, Play } from 'lucide-react';
import { CATEGORY_LIST, GENRE_LIST, COUNTRY_LIST, searchMovies, MovieListItem, API_BASE } from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [genreOpen, setGenreOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Bỏ "Phim Sắp Chiếu" khỏi Navbar
  const navCategories = CATEGORY_LIST.filter((cat) => cat.slug !== 'sap-chieu');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xử lý Click Outside để đóng kết quả gợi ý
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Realtime Search Autocomplete khi gõ
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    const timer = setTimeout(async () => {
      try {
        let resData = null;
        try {
          const directRes = await fetch(`${API_BASE}/films/search?keyword=${encodeURIComponent(trimmed)}&page=1`);
          if (directRes.ok) {
            resData = await directRes.json();
          }
        } catch {
          // Fallback to server proxy
        }

        if (!resData || !resData.items || resData.items.length === 0) {
          const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
          if (response.ok) {
            resData = await response.json();
          }
        }

        setSearchResults(resData?.items || []);
      } catch (err) {
        console.error('Realtime Search Error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md py-3 border-b border-white/5 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="NgocHiepTV Logo"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center Section: Desktop Navigation Links (Căn giữa Navbar) */}
        <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 text-sm font-semibold flex-1">
          <Link
            href="/"
            className={`whitespace-nowrap transition-colors hover:text-red-500 ${
              pathname === '/' ? 'text-red-500 font-bold' : 'text-zinc-200'
            }`}
          >
            Trang Chủ
          </Link>

          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-sach/${cat.slug}`}
              className={`whitespace-nowrap transition-colors hover:text-red-500 ${
                pathname === `/danh-sach/${cat.slug}` ? 'text-red-500 font-bold' : 'text-zinc-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}

          {/* Thể Loại Dropdown */}
          <div className="relative" onMouseLeave={() => setGenreOpen(false)}>
            <button
              onClick={() => setGenreOpen(!genreOpen)}
              onMouseEnter={() => setGenreOpen(true)}
              className="flex items-center space-x-1 whitespace-nowrap text-zinc-200 hover:text-red-500 py-1 transition-colors"
            >
              <span>Thể Loại</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {genreOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#12141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-2 gap-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                {GENRE_LIST.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`/the-loai/${genre.slug}`}
                    onClick={() => setGenreOpen(false)}
                    className="text-xs text-zinc-300 hover:text-red-400 hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quốc Gia Dropdown */}
          <div className="relative" onMouseLeave={() => setCountryOpen(false)}>
            <button
              onClick={() => setCountryOpen(!countryOpen)}
              onMouseEnter={() => setCountryOpen(true)}
              className="flex items-center space-x-1 whitespace-nowrap text-zinc-200 hover:text-red-500 py-1 transition-colors"
            >
              <span>Quốc Gia</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {countryOpen && (
              <div className="absolute top-full left-0 w-48 bg-[#12141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2">
                {COUNTRY_LIST.map((country) => (
                  <Link
                    key={country.slug}
                    href={`/quoc-gia/${country.slug}`}
                    onClick={() => setCountryOpen(false)}
                    className="text-xs text-zinc-300 hover:text-red-400 hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Realtime Search & Mobile Toggle */}
        <div className="flex items-center space-x-4 shrink-0">
          <div ref={searchRef} className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Nhập tên phim..."
                value={searchQuery}
                onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900/90 border border-zinc-700/80 text-sm text-white placeholder-zinc-400 rounded-full pl-10 pr-4 py-2 w-48 focus:w-64 lg:focus:w-72 transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-inner"
              />
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              )}
            </form>

            {/* Live Autocomplete Dropdown Popup */}
            {showResults && (
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-[#12141a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-zinc-400 flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    <span>Đang tìm kiếm phim...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
                      Gợi Ý Kết Quả
                    </div>
                    {searchResults.slice(0, 6).map((movie) => (
                      <Link
                        key={movie.slug}
                        href={`/phim/${movie.slug}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <img
                          src={movie.thumb_url || movie.poster_url}
                          alt={movie.name}
                          className="w-10 h-14 object-cover rounded-lg flex-shrink-0 bg-zinc-800 border border-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-red-400 line-clamp-1">
                            {movie.name}
                          </h4>
                          <p className="text-[11px] text-zinc-400 italic line-clamp-1 mt-0.5">
                            {movie.original_name || movie.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-1">
                            {movie.quality && (
                              <span className="px-1.5 py-0.5 bg-red-600/90 text-white font-bold rounded">
                                {movie.quality}
                              </span>
                            )}
                            {movie.year && <span>{movie.year}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => setShowResults(false)}
                      className="block text-center text-xs font-bold text-red-500 hover:text-red-400 p-2.5 border-t border-zinc-800/80 mt-1"
                    >
                      Xem tất cả kết quả cho &quot;{searchQuery}&quot; →
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-400">Không tìm thấy phim nào phù hợp.</div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Link Icon */}
          <Link
            href="/tim-kiem"
            className="sm:hidden p-2 text-zinc-300 hover:text-white rounded-full bg-zinc-900 border border-zinc-800"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12141a]/95 backdrop-blur-xl border-t border-zinc-800/80 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Nhập tên phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-400 rounded-xl pl-10 pr-4 py-2.5"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-200 hover:bg-red-600/20 hover:text-red-400 transition-colors font-medium text-sm"
            >
              Trang Chủ
            </Link>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 pt-2">Danh Mục</div>
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-sach/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 pt-2">Thể Loại Hot</div>
            <div className="grid grid-cols-2 gap-1 px-3">
              {GENRE_LIST.map((genre) => (
                <Link
                  key={genre.slug}
                  href={`/the-loai/${genre.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-xs text-zinc-300 hover:text-red-400"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 pt-2">Quốc Gia</div>
            <div className="grid grid-cols-2 gap-1 px-3">
              {COUNTRY_LIST.map((country) => (
                <Link
                  key={country.slug}
                  href={`/quoc-gia/${country.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-xs text-zinc-300 hover:text-red-400"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
