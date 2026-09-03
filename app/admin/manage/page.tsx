'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChefHat,
  Plus,
  Globe,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  ArrowLeft,
  DollarSign,
  Tag,
  Flame,
  Check,
  ToggleLeft,
  ToggleRight,
  Utensils,
  Leaf,
  Wheat,
} from 'lucide-react';
import { MenuItem } from '@/types/restaurant';

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // New Dish Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Mains');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishSpice, setNewDishSpice] = useState(0);
  const [newDishVeg, setNewDishVeg] = useState(false);
  const [newDishVegan, setNewDishVegan] = useState(false);
  const [newDishGlutenFree, setNewDishGlutenFree] = useState(false);
  const [addingDish, setAddingDish] = useState(false);

  // Web Scraping Modal State
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeFeedback, setScrapeFeedback] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err: any) {
      console.error('Error fetching menu:', err);
      setError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const getAuthHeader = () => {
    try {
      const raw = localStorage.getItem('tabl_staff_auth');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.token) {
          return { Authorization: `Bearer ${user.token}` };
        }
      }
    } catch {}
    return {};
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updatedStatus = !item.isAvailable;
    setTogglingId(item.id);

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isAvailable: updatedStatus } : i))
    );

    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ isAvailable: updatedStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update dish availability');
      }
    } catch (err) {
      console.error('Toggle availability error:', err);
      fetchMenu();
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    setAddingDish(true);
    try {
      const payload = {
        name: newDishName.trim(),
        category: newDishCategory,
        price: parseFloat(newDishPrice),
        description: newDishDesc.trim(),
        spiceLevel: newDishSpice,
        isVegetarian: newDishVeg || newDishVegan,
        isVegan: newDishVegan,
        isGlutenFree: newDishGlutenFree,
        isAvailable: true,
      };

      const res = await fetch('/api/menu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add dish');
      }

      setShowAddModal(false);
      setNewDishName('');
      setNewDishPrice('');
      setNewDishDesc('');
      setNewDishSpice(0);
      setNewDishVeg(false);
      setNewDishVegan(false);
      setNewDishGlutenFree(false);
      fetchMenu();
    } catch (err: any) {
      alert(err.message || 'Error adding dish');
    } finally {
      setAddingDish(false);
    }
  };

  const handleScrapeMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    setScraping(true);
    setScrapeFeedback(null);

    try {
      const res = await fetch('/api/menu/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Scraping failed');
      }

      setScrapeFeedback(`Scraped ${data.count || 0} items successfully!`);
      fetchMenu();
    } catch (err: any) {
      setScrapeFeedback(`Error: ${err.message}`);
    } finally {
      setScraping(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Mains')))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="manage-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Staff Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6 mb-8">
        <div className="flex items-center space-x-3">
          <Link
            id="back-to-admin-btn"
            href="/admin"
            aria-label="Back to staff hub"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-950 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Staff Hub
          </Link>
          <span className="text-gray-300 font-bold">/</span>
          <h1 id="manage-title" className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-gray-950">
            Inventory & 86 Dish Control
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            id="nav-to-kds"
            href="/admin/kds"
            aria-label="Navigate to Kitchen Display Screen"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ChefHat className="w-4 h-4 text-orange-600" />
            <span>Kitchen Display (KDS)</span>
          </Link>
          <button
            type="button"
            id="open-add-dish-btn"
            aria-label="Open dialog to add new dish"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-950 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Dish</span>
          </button>
          <button
            type="button"
            id="open-scrape-modal-btn"
            aria-label="Open dialog to sync menu from URL"
            onClick={() => setShowScrapeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Globe className="w-4 h-4 text-sky-600" />
            <span>Sync URL</span>
          </button>
        </div>
      </div>

      {/* Overview & Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            id="inventory-search-input"
            aria-label="Search menu items by name or ingredients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by name or description..."
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-white shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Filter menu items by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              aria-label={`Filter inventory by ${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                selectedCategory === cat
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table Container */}
      <div
        id="inventory-table-container"
        className="rounded-3xl border border-gray-200/80 bg-white shadow-luxury overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700" aria-label="Restaurant inventory items">
            <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] uppercase font-bold text-gray-600 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Item & Description</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4">Dietary</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Quick 86 Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-xs text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
                    Loading catalog items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-xs text-gray-500">
                    No matching items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    id={`inventory-row-${item.id}`}
                    className={`hover:bg-gray-50/75 transition-colors ${
                      !item.isAvailable ? 'bg-rose-50/20 opacity-80' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-950">{item.name}</div>
                      {item.description && (
                        <p className="text-xs text-gray-600 line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                        {item.category || 'Mains'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-950">
                      Rs. {typeof item.price === 'number' ? item.price.toFixed(0) : item.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isVegetarian && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded">
                            Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="text-[10px] font-bold bg-green-50 text-green-800 border border-green-300 px-1.5 py-0.5 rounded">
                            Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded">
                            GF
                          </span>
                        )}
                        {item.spiceLevel ? (
                          <span className="text-[10px] font-bold bg-red-50 text-red-800 border border-red-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-red-600 fill-current" />
                            {item.spiceLevel}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-800 ring-1 ring-rose-600/20">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          86&apos;d Out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        id={`toggle-86-${item.id}`}
                        aria-label={`Toggle availability for ${item.name}`}
                        disabled={togglingId === item.id}
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          item.isAvailable
                            ? 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {item.isAvailable ? '86 Dish' : 'Restore Stock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <h3 id="modal-title" className="text-lg font-display font-extrabold text-gray-950">Add Dish to Menu</h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold focus:outline-none rounded p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-4">
              <div>
                <label htmlFor="dish-name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Dish Name</label>
                <input
                  id="dish-name"
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Saffron Risotto with Wild Mushrooms"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dish-category" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
                  <select
                    id="dish-category"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Specials">Specials</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dish-price" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    id="dish-price"
                    type="number"
                    required
                    min="1"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="450"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dish-description" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Description & Ingredients</label>
                <textarea
                  id="dish-description"
                  rows={3}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Fresh ingredients, prep style, and flavor notes..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishVeg}
                    onChange={(e) => setNewDishVeg(e.target.checked)}
                    className="rounded text-gray-950 mr-2 focus:ring-2 focus:ring-amber-500"
                  />
                  Vegetarian
                </label>
                <label className="inline-flex items-center text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishVegan}
                    onChange={(e) => setNewDishVegan(e.target.checked)}
                    className="rounded text-gray-950 mr-2 focus:ring-2 focus:ring-amber-500"
                  />
                  Vegan
                </label>
                <label className="inline-flex items-center text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishGlutenFree}
                    onChange={(e) => setNewDishGlutenFree(e.target.checked)}
                    className="rounded text-gray-950 mr-2 focus:ring-2 focus:ring-amber-500"
                  />
                  Gluten Free
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDish}
                  className="rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {addingDish ? 'Saving...' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scrape External Menu URL Modal */}
      {showScrapeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="scrape-modal-title">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 id="scrape-modal-title" className="text-lg font-display font-extrabold text-gray-950">Scrape & Sync Menu from Web</h3>
              <button
                type="button"
                aria-label="Close sync modal"
                onClick={() => setShowScrapeModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold focus:outline-none rounded p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Provide a restaurant webpage URL. The scraper will extract items and prices, storing them into the live database.
            </p>

            <form onSubmit={handleScrapeMenu} className="space-y-4">
              <div>
                <label htmlFor="scrape-target-url" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Target Menu URL</label>
                <input
                  id="scrape-target-url"
                  type="url"
                  required
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://example-restaurant.com/menu"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                />
              </div>

              {scrapeFeedback && (
                <div className="p-3.5 rounded-xl bg-gray-100 text-xs font-mono text-gray-900 border border-gray-200">
                  {scrapeFeedback}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowScrapeModal(false)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scraping}
                  className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {scraping ? 'Scraping...' : 'Start Extraction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
