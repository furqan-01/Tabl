import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  ChefHat,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Layers,
  ArrowUpRight,
  HeartHandshake,
} from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tabl | Smart Menu Kiosk & AI Concierge',
  description: 'Luxury contactless table ordering, live dietary AI concierge, and real-time kitchen orchestration.',
  openGraph: {
    title: 'Tabl | Smart Menu Kiosk & AI Concierge',
    description: 'Luxury contactless table ordering, live dietary AI concierge, and real-time kitchen orchestration.',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08090e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#111218] antialiased selection:bg-amber-200 selection:text-amber-950 font-sans">
        {/* Top Micro-Bar */}
        <div className="bg-[#0D0F17] text-white/80 px-4 py-2 text-[11px] font-medium tracking-wider uppercase border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Kitchen Sync
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline text-white/70">Contactless Table Kiosk & AI Concierge</span>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <span className="hidden md:flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" /> Mon–Sun: 11:00 AM – 11:00 PM
              </span>
              <span className="hidden md:inline text-white/30">•</span>
              <Link
                href="/admin"
                className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-white/80 font-semibold"
              >
                Staff Access <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Luxury Header */}
        <header id="main-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Brand Logo */}
              <div className="flex items-center gap-8">
                <Link
                  id="nav-brand"
                  href="/"
                  className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E2230] to-[#0A0C12] text-amber-300 flex items-center justify-center font-display font-extrabold text-xl shadow-md border border-amber-400/20 group-hover:border-amber-400/60 group-hover:scale-105 transition-all">
                    T
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-2xl tracking-wider text-gray-950 group-hover:text-amber-900 transition-colors leading-none">
                      TABL
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-700 uppercase mt-1">
                      Modern Bistro & AI
                    </span>
                  </div>
                </Link>

                {/* Primary Navigation Links */}
                <nav id="main-nav" aria-label="Main Navigation" className="hidden md:flex items-center space-x-1">
                  <Link
                    id="nav-link-menu"
                    href="/menu"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Menu Catalog
                  </Link>
                  <Link
                    id="nav-link-cart"
                    href="/cart"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Table Cart
                  </Link>
                  <Link
                    id="nav-link-kds"
                    href="/admin/kds"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 inline-flex items-center gap-1.5"
                  >
                    <ChefHat className="w-4 h-4 text-orange-600" />
                    Kitchen (KDS)
                  </Link>
                  <Link
                    id="nav-link-admin"
                    href="/admin"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Staff Portal
                  </Link>
                </nav>
              </div>

              {/* Right Header Actions */}
              <div className="flex items-center gap-3">
                <Link
                  id="header-order-cta"
                  href="/menu"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Launch Menu</span>
                </Link>

                <Link
                  id="header-cart-btn"
                  href="/cart"
                  aria-label="View Cart"
                  className="relative p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-200/60"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="sr-only">Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Luxury Footer */}
        <footer id="main-footer" className="bg-[#0A0C13] text-white/70 border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Brand & Mission */}
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-display font-extrabold flex items-center justify-center text-lg shadow-md">
                    T
                  </div>
                  <span className="font-display font-bold text-xl tracking-wider text-white">TABL</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Next-generation contactless dining, real-time AI gastronomy concierge, and instant kitchen synchronization.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300/90 pt-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Verified Safe Table Ordering</span>
                </div>
              </div>

              {/* Quick Navigation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                  Guest Navigation
                </h4>
                <ul className="space-y-2.5 text-xs font-medium">
                  <li>
                    <Link href="/menu" className="hover:text-amber-300 transition-colors">
                      Live Bistro Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-amber-300 transition-colors">
                      Table Cart & Checkout
                    </Link>
                  </li>
                  <li>
                    <Link href="/health" className="hover:text-amber-300 transition-colors">
                      System & Database Health
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Staff & Kitchen Portals */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                  Staff Operations
                </h4>
                <ul className="space-y-2.5 text-xs font-medium">
                  <li>
                    <Link href="/admin/kds" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-orange-400" /> Kitchen Display System (KDS)
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/manage" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> 86 Inventory Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-amber-300 transition-colors">
                      Staff Hub Login
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Location & Table Policy */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                  Bistro Hospitality
                </h4>
                <p className="text-xs text-white/60 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>12 Gourmet Boulevard, Downtown Culinary District</span>
                </p>
                <p className="text-xs text-white/60 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+1 (555) 234-8225</span>
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] text-white/50">
                  Contactless table dining policy: Pay your server directly at table with Cash or Card.
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
              <p>© {new Date().getFullYear()} Tabl Modern Bistro. All culinary rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/health" className="hover:text-white/70 transition-colors">Health Diagnostics</Link>
                <Link href="/menu" className="hover:text-white/70 transition-colors">Digital Kiosk</Link>
                <Link href="/admin" className="hover:text-white/70 transition-colors">Staff Portal</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
