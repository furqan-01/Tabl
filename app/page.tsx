import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Utensils,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  QrCode,
  Clock,
  Layers,
  Flame,
  CheckCircle2,
  DollarSign,
  Heart,
  Smartphone,
  Check,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div id="home-page" className="flex flex-1 flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0C13] via-[#10131E] to-[#0A0C13] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Micro-Pill Tag */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-glow-amber animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Next-Gen Table Dining & AI Concierge
            </span>
          </div>

          {/* Luxury Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.1]">
            Effortless Dining &amp; Haute Gastronomy, <br />
            <span className="gold-gradient-text">Orchestrated by AI.</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed font-normal">
            Experience contactless dining at its finest. Browse live kitchen inventory, receive instant dietary &amp; wine pairing advice from our AI Concierge, and send orders straight to our chef with zero app downloads.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="home-explore-menu-btn"
              href="/menu"
              aria-label="Launch Table Menu & AI Concierge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-slate-950 shadow-[0_10px_25px_-5px_rgba(212,169,69,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(212,169,69,0.6)] hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <Utensils className="w-4 h-4 text-slate-950" />
              <span>Launch Table Menu &amp; AI Concierge</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              id="home-kds-btn"
              href="/admin/kds"
              aria-label="Kitchen Display (KDS)"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md px-7 py-4 text-sm font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Kitchen Display (KDS)</span>
            </Link>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400">0.8s</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">AI Recommendation Latency</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Live 86 Stock Accuracy</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400">0 Downloads</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Instant Web Kiosk</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400">Pay at Table</div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Cash / Card / Contactless</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Intelligent Dining Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-950">
            Engineered for Gastronomy & Speed
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            A harmonized hospitality ecosystem connecting diners, the kitchen, and front-of-house staff seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Concierge */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-amber-700" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Gastronomy AI
              </span>
              <h3 className="text-xl font-bold text-gray-950 mt-4">
                AI Concierge &amp; Dietary Guide
              </h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                Trained on our complete recipe catalog, ingredient allergen profiles, and spice levels. Suggests customized combos matching budget, vegan/keto diets, and pairings in milliseconds.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/menu"
                className="text-xs font-bold text-gray-950 hover:text-amber-700 inline-flex items-center gap-1.5 transition-colors"
              >
                Converse with Concierge <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Real-Time Kitchen Display System (KDS) */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChefHat className="w-7 h-7 text-orange-700" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-800 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                Kitchen Orchestration
              </span>
              <h3 className="text-xl font-bold text-gray-950 mt-4">
                Real-Time Kitchen KDS
              </h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                Dine-in orders transmit directly to the culinary display screen with color-coded preparation timers and ticket stages from prep to server pickup.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/admin/kds"
                className="text-xs font-bold text-gray-950 hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors"
              >
                Launch KDS Screen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Instant 86 Inventory Manager */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-indigo-800" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Catalog & Stock
              </span>
              <h3 className="text-xl font-bold text-gray-950 mt-4">
                Instant 86 & Menu Control
              </h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                When an ingredient runs out, staff can toggle dishes offline with one click. The AI Concierge instantly adjusts suggestions so no guest orders an unavailable dish.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/admin/manage"
                className="text-xs font-bold text-gray-950 hover:text-indigo-800 inline-flex items-center gap-1.5 transition-colors"
              >
                Manage Inventory 86 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Dining Journey */}
      <section className="bg-gradient-to-b from-gray-100/60 to-white py-20 px-4 sm:px-6 lg:px-8 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700 bg-gray-200 px-3 py-1 rounded-full">
              Seamless Table Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-950">
              How Dining at Tabl Works
            </h2>
            <p className="text-sm text-gray-600">
              Zero apps to download. Fully contactless, effortless, and fast.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-display font-extrabold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-gray-950 mb-1">Select Table</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Take a seat at your table and open the live digital kiosk on your mobile or kiosk terminal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-display font-extrabold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-gray-950 mb-1">Ask AI Concierge</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tap the 3D Orb for custom flavor profiles, allergen guarantees, or budget meal combos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-display font-extrabold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-gray-950 mb-1">Send to Kitchen</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Submit your cart. The ticket instantly logs to the Kitchen Display System for cooking.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-display font-extrabold text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-gray-950 mb-1">Savor & Pay Waiter</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enjoy your meal in leisure. Settle your bill directly with your waiter with cash or card.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
