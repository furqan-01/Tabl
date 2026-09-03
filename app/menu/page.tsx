'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Search,
  Flame,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  MessageSquare,
  Tag,
  Clock,
  Info,
  Layers,
  ChevronRight,
  Utensils,
  Check,
  Database,
  RefreshCw,
  SlidersHorizontal,
  FlameKindling,
  Wheat,
  Leaf,
  ShieldAlert,
} from 'lucide-react';
import { MenuItem, DealOrPromotion, RestaurantInfo } from '@/types/restaurant';
import FloatingConciergeOrb from '@/components/3d/ConciergeOrbButton';
import { addToCart, getStoredCart, getStoredTable, setStoredTable } from '@/lib/cart';

// Dynamically import ChatContainer with a lightweight skeleton to keep initial JS bundle minimal
const ChatContainer = dynamic(
  () => import('@/components/chat/ChatContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-800">Connecting to Tabl AI Concierge...</p>
      </div>
    ),
  }
);

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<DealOrPromotion[]>([]);
  const [info, setInfo] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'vegan' | 'gf'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & UI State
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [tableNumber, setTableNumberState] = useState('4');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Refresh cart state
  const syncCartState = useCallback(() => {
    const cart = getStoredCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartCount(count);
    setCartSubtotal(subtotal);
  }, []);

  useEffect(() => {
    // Initial fetch from /api/menu
    async function loadMenu() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/menu');
        const data = await res.json();
        const menuList = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.data)
          ? data.data
          : [];
        setItems(menuList);
        if (data.deals && Array.isArray(data.deals)) setDeals(data.deals);
        if (data.info) setInfo(data.info);
      } catch (err: any) {
        console.error('Failed to load menu:', err);
        setError(err.message || 'Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
    setTableNumberState(getStoredTable());
    syncCartState();

    window.addEventListener('tabl_cart_updated', syncCartState);
    return () => window.removeEventListener('tabl_cart_updated', syncCartState);
  }, [syncCartState]);

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTableNumberState(val);
    setStoredTable(val);
  };

  const getItemQuantity = (id: string) => itemQuantities[id] || 1;

  const handleQuantityChange = (id: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    const qty = getItemQuantity(item.id);
    addToCart(item, qty);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  const handleSyncDatabase = async () => {
    try {
      setIsSyncingDb(true);
      setSyncSuccessMsg(null);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncSuccessMsg('Database synced & seeded successfully!');
        // Refresh menu
        const menuRes = await fetch('/api/menu');
        const menuData = await menuRes.json();
        if (menuData.items) setItems(menuData.items);
        if (menuData.deals) setDeals(menuData.deals);
        if (menuData.info) setInfo(menuData.info);
      } else {
        alert(data.message || 'Failed to seed database.');
      }
    } catch (err: any) {
      alert(err.message || 'Error syncing database.');
    } finally {
      setIsSyncingDb(false);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }
  };

  // Extract Categories
  const availableCategories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Mains')))];

  // Filter Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())));

    let matchesDietary = true;
    if (dietaryFilter === 'veg') matchesDietary = item.isVegetarian || item.isVegan;
    if (dietaryFilter === 'vegan') matchesDietary = item.isVegan;
    if (dietaryFilter === 'gf') matchesDietary = item.isGlutenFree;

    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <div id="menu-page-root" className="min-h-screen bg-[#FAF9F5] pb-36">
      {/* Top Banner & Ambiance Header */}
      <div className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 id="menu-title" className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-gray-950">
                  {info?.name || 'Tabl Modern Bistro'}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Kitchen Live
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Contactless dining. Savor your meal and settle payment with your waiter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Sync to Firestore button */}
            <button
              type="button"
              id="sync-firestore-btn"
              aria-label="Sync menu to Firestore database"
              onClick={handleSyncDatabase}
              disabled={isSyncingDb}
              title="Populate your connected Firebase Firestore database with all default menu dishes and deals"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {isSyncingDb ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
              ) : (
                <Database className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span>{isSyncingDb ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            {/* Table Number Selector */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-2xs">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              <label htmlFor="menu-table-select" className="text-xs font-bold text-gray-800">
                Table:
              </label>
              <select
                id="menu-table-select"
                aria-label="Select dining table number"
                value={tableNumber}
                onChange={handleTableChange}
                className="bg-transparent text-xs font-extrabold text-gray-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:rounded cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={String(num)}>
                    #{num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg} Refreshing menu view.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content Layout */}
        <div className="w-full">
          {/* Active Deals & Combo Offers */}
          {deals.length > 0 && (
            <section id="menu-deals-section" className="mb-8" aria-label="Active deals and combo promotions">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-950">
                  Chef&apos;s Featured Combos & Deals
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    id={`deal-card-${deal.id}`}
                    className="relative flex flex-col justify-between rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 p-5 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                          Special Promotion
                        </span>
                        {deal.discountedPrice && (
                          <span className="font-mono text-xs font-extrabold text-gray-950 bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg shadow-2xs">
                            Rs. {deal.discountedPrice}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-950 mt-3 group-hover:text-amber-900 transition-colors">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {deal.description}
                      </p>
                    </div>
                    {deal.conditions && (
                      <p className="text-[11px] text-amber-950 mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3 h-3 text-amber-700 shrink-0" /> {deal.conditions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Search & Filter Controls */}
          <div className="bg-white/95 rounded-2xl p-4 border border-gray-200/80 shadow-xs mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <label htmlFor="menu-search-input" className="sr-only">
                  Search dishes, ingredients, or allergens
                </label>
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="menu-search-input"
                  aria-label="Search dishes, ingredients, or allergens"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, ingredients, or allergens..."
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search query"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs font-semibold text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Dietary Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Dietary filters">
                {[
                  { key: 'all', label: 'All Dishes' },
                  { key: 'veg', label: '🌱 Veg' },
                  { key: 'vegan', label: '🌿 Vegan' },
                  { key: 'gf', label: '🌾 Gluten Free' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    aria-label={`Filter by ${filter.label}`}
                    onClick={() => setDietaryFilter(filter.key as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      dietaryFilter === filter.key
                        ? 'bg-gray-950 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 border-t border-gray-100" role="tablist" aria-label="Menu categories">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  aria-label={`Category: ${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200 hover:text-gray-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* AI Assistant Quick Prompt Strip with 3D Orb Feature */}
          <div
            id="menu-ai-banner"
            className="mb-8 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-white to-sky-50/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <FloatingConciergeOrb
                variant="inline"
                onClick={() => setIsChatOpen(true)}
                showBadge={false}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase shadow-2xs">
                    3D AI Concierge
                  </span>
                  <p className="text-sm font-bold text-gray-950">Need curated dietary advice or meal combos?</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Ask Tabl Assistant for budget-tailored combos, allergen checks, and chef pairings.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="banner-open-ai-btn"
              aria-label="Open AI menu assistant"
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-black px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Converse with AI</span>
            </button>
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs animate-pulse">
                  <div className="h-5 w-2/3 bg-gray-200 rounded mb-3" />
                  <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-4/5 bg-gray-100 rounded mb-4" />
                  <div className="h-9 w-28 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-950">No culinary items match your filter</h3>
              <p className="text-xs text-gray-600 mt-1">
                Try resetting your search query or selecting a different dietary filter.
              </p>
              <button
                type="button"
                aria-label="Reset all search and category filters"
                onClick={() => {
                  setSelectedCategory('All');
                  setDietaryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-5 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              id="menu-items-grid"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => {
                const qty = getItemQuantity(item.id);
                const isJustAdded = justAddedId === item.id;

                return (
                  <div
                    key={item.id}
                    id={`menu-card-${item.id}`}
                    className={`flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-luxury hover:shadow-luxury-hover transition-all group ${
                      item.isAvailable
                        ? 'border-gray-200/80 hover:border-amber-400/60'
                        : 'border-rose-100 bg-gray-50/60 opacity-75'
                    }`}
                  >
                    {/* Top Meta & Badges */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-md">
                          {item.category}
                        </span>

                        {/* Availability Badge */}
                        {item.isAvailable ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 ring-1 ring-rose-600/20">
                            <XCircle className="w-3 h-3 text-rose-700" /> 86&apos;d Out
                          </span>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-950 leading-snug group-hover:text-amber-950 transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-mono text-base font-extrabold text-gray-950 whitespace-nowrap bg-amber-50/60 border border-amber-200/80 px-2.5 py-0.5 rounded-lg">
                          Rs. {typeof item.price === 'number' ? item.price.toFixed(0) : item.price}
                        </span>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      )}

                      {/* Dietary Tags & Spice */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {item.isVegetarian && (
                          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="text-[11px] font-bold bg-green-50 text-green-800 border border-green-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            🌿 Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Wheat className="w-3 h-3" /> Gluten-Free
                          </span>
                        )}
                        {item.spiceLevel ? (
                          <span className="text-[11px] font-bold bg-red-50 text-red-800 border border-red-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-600 fill-current" />
                            Spice {item.spiceLevel}
                          </span>
                        ) : null}
                      </div>

                      {/* Ingredients & Allergens preview */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100 mb-4">
                          <span className="font-semibold text-gray-700">Allergens:</span> {item.allergens.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      {item.isAvailable ? (
                        <>
                          {/* Quantity Selector */}
                          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-extrabold text-gray-950">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Add Button */}
                          <button
                            type="button"
                            id={`add-to-cart-${item.id}`}
                            aria-label={isJustAdded ? "Added" : "Add to Cart"}
                            onClick={() => handleAddToCart(item)}
                            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white scale-102'
                                : 'bg-gray-950 text-white hover:bg-black hover:scale-102 active:scale-98'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-4 h-4" /> Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 text-amber-400" /> Add to Cart
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="w-full text-center py-2.5 text-xs font-bold text-rose-800 bg-rose-50 rounded-xl border border-rose-200">
                          Currently Sold Out
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modern Slide-over Right Drawer for AI Concierge */}
      {isChatOpen && (
        <div id="concierge-drawer-wrapper" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Scrim */}
          <div
            id="concierge-drawer-backdrop"
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <aside
            id="concierge-drawer-panel"
            className="fixed top-0 right-0 bottom-0 z-10 h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-full sm:w-[480px] md:w-[500px] bg-white shadow-2xl flex flex-col border-l border-gray-200 overflow-hidden animate-in slide-in-from-right duration-300"
          >
            <ChatContainer
              onClose={() => setIsChatOpen(false)}
              onAddToCartItemName={(name) => {
                const match = items.find((i) => i.name.toLowerCase().includes(name.toLowerCase()));
                if (match) handleAddToCart(match);
              }}
            />
          </aside>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div
          id="floating-cart-bar"
          className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 px-4 py-3.5 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Table {tableNumber}:
                  </span>
                  <span className="text-xs font-extrabold text-gray-950 bg-gray-100 px-2 py-0.5 rounded-full">
                    {cartCount} {cartCount === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
                <div className="font-mono text-base font-extrabold text-gray-950">
                  Rs. {cartSubtotal.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                id="view-cart-btn"
                href="/cart"
                aria-label="Review Cart and Place Order"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-black hover:scale-102 active:scale-98 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <span>Review Cart & Order</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
