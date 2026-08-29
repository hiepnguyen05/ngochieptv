import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ngochieptv.com'),
  title: {
    default: 'NgocHiepTV - Web Xem Phim HD Vietsub Online Miễn Phí',
    template: '%s | NgocHiepTV',
  },
  description:
    'Xem phim mới cập nhật, phim bộ, phim lẻ, phim chiếu rông Vietsub chất lượng cao HD miễn phí mượt mà nhất trên NgocHiepTV.',
  keywords: ['xem phim', 'phim mới', 'phim vietsub', 'phim bộ', 'phim lẻ', 'phim chiếu rạp', 'NgocHiepTV'],
  authors: [{ name: 'NgocHiepTV' }],
  creator: 'NgocHiepTV',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ngochieptv.com',
    siteName: 'NgocHiepTV',
    title: 'NgocHiepTV - Web Xem Phim HD Vietsub Online Miễn Phí',
    description: 'Xem phim vietsub mượt mà chất lượng cao trên NgocHiepTV.',
    images: [
      {
        url: 'https://phim.nguonc.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NgocHiepTV Film Streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NgocHiepTV - Web Xem Phim Online',
    description: 'Xem phim vietsub mượt mà chất lượng cao trên NgocHiepTV.',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark h-full antialiased">
      <body className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-100 selection:bg-red-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
