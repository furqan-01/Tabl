import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tabl | Smart Menu Kiosk',
  description: 'Smart Menu Kiosk contactless ordering application',
  openGraph: {
    title: 'Tabl | Smart Menu Kiosk',
    description: 'Smart Menu Kiosk contactless ordering application',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <header id="main-header" className="border-b border-gray-200 bg-white px-6 py-4 shadow-xs sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                id="nav-brand"
                href="/"
                className="text-xl font-black tracking-tight text-gray-950 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
              >
                Tabl
              </Link>
              <nav id="main-nav" aria-label="Main Navigation" className="flex items-center space-x-6">
                <Link
                  id="nav-link-menu"
                  href="/menu"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-1"
                >
                  Menu
                </Link>
                <Link
                  id="nav-link-cart"
                  href="/cart"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-1"
                >
                  Cart
                </Link>
                <Link
                  id="nav-link-admin"
                  href="/admin"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-1"
                >
                  Admin
                </Link>
                <Link
                  id="nav-link-health"
                  href="/health"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-1"
                >
                  Health
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

