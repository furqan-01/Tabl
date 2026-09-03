'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Utensils,
  CheckCircle2,
  CreditCard,
  ChefHat,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import {
  CartItem,
  getStoredCart,
  updateCartQuantity,
  clearCart,
  getStoredTable,
  setStoredTable,
} from '@/lib/cart';
import { OrderRecord } from '@/types/restaurant';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('4');
  const [specialNotes, setSpecialNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCart = () => {
    setCart(getStoredCart());
    setTableNumber(getStoredTable());
  };

  useEffect(() => {
    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener('tabl_cart_updated', handleUpdate);
    return () => window.removeEventListener('tabl_cart_updated', handleUpdate);
  }, []);

  const handleQty = (menuItemId: string, newQty: number) => {
    updateCartQuantity(menuItemId, newQty);
    loadCart();
  };

  const handleRemove = (menuItemId: string) => {
    updateCartQuantity(menuItemId, 0);
    loadCart();
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setPlacingOrder(true);
    setError(null);

    try {
      const payload = {
        tableNumber: tableNumber.trim() || '4',
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes || '',
        })),
        specialInstructions: specialNotes.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrder(data.order);
      clearCart();
      loadCart();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Order Confirmed Success View
  if (placedOrder) {
    return (
      <div id="order-success-view" className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-3xl border border-amber-300/60 bg-white p-8 sm:p-12 shadow-luxury text-center relative overflow-hidden">
          {/* Subtle Ambient Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center mb-6 shadow-glow-amber">
            <CheckCircle2 className="w-10 h-10 text-amber-600" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Order Sent to Kitchen
          </span>

          <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-950 mt-4 tracking-tight">
            Order Confirmed for Table {placedOrder.tableNumber}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your dishes have been transmitted directly to our kitchen line. The culinary team is preparing your feast.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200/80 p-6 text-left space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Ticket ID</span>
                <p className="font-mono text-xs font-bold text-gray-900">#{placedOrder.id.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Table</span>
                <p className="font-mono text-sm font-extrabold text-amber-800">Table {placedOrder.tableNumber}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Items Ordered</span>
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-gray-800 font-medium">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-mono font-bold">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200/80 pt-3 flex justify-between font-bold text-sm text-gray-950">
              <span>Total Bill</span>
              <span className="font-mono text-base font-extrabold">Rs. {(placedOrder.total || 0).toFixed(0)}</span>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Contactless Table Policy:</span> Savor your meal in leisure. Settle your payment directly with your server at Table {placedOrder.tableNumber} (Cash/Card) whenever you are ready.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              aria-label="Return to menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-black px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Menu</span>
            </Link>
            <Link
              href="/admin/kds"
              aria-label="View Kitchen Display Screen"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-xs font-extrabold text-gray-800 hover:bg-gray-50 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span>View Kitchen (KDS)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/menu"
              aria-label="Back to restaurant menu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Menu
            </Link>
          </div>
          <h1 id="cart-title" className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-gray-950 mt-1">
            Table {tableNumber} Dining Cart
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-2xs">
            <Utensils className="w-3.5 h-3.5 text-amber-700" />
            <label htmlFor="cart-table-select" className="text-xs font-bold text-gray-800">
              Table:
            </label>
            <select
              id="cart-table-select"
              aria-label="Select dining table number"
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                setStoredTable(e.target.value);
              }}
              className="bg-transparent text-xs font-extrabold text-gray-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:rounded cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={String(num)}>
                  #{num}
                </option>
              ))}
            </select>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              aria-label="Clear all items from cart"
              onClick={() => {
                clearCart();
                loadCart();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center">
          <ShoppingBag className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-display text-gray-950">Your cart is empty</h2>
          <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
            Browse our curated menu or consult the AI Assistant for recommendations and add dishes to your table order.
          </p>
          <Link
            href="/menu"
            aria-label="Explore Menu & Combos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-black transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Explore Menu &amp; Combos</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-luxury">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-700 border-b border-gray-100 pb-3 mb-4">
                Selected Dishes ({cart.length})
              </h2>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <h3 className="font-bold text-gray-950 text-sm">{item.name}</h3>
                        <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          Rs. {item.price} each
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-amber-900 bg-amber-50 rounded-md px-2 py-0.5 mt-1.5 inline-block border border-amber-200/60">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-extrabold text-gray-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-mono text-sm font-extrabold text-gray-950 min-w-16 text-right">
                        Rs. {(item.price * item.quantity).toFixed(0)}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions Note Input */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-luxury">
              <label htmlFor="special-notes" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                Special Kitchen Instructions / Allergies
              </label>
              <textarea
                id="special-notes"
                rows={2}
                aria-label="Special kitchen instructions or allergy notes"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Extra crisp, sauce on side, table celebration..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none transition-colors bg-gray-50/50"
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-luxury">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-700 border-b border-gray-100 pb-3 mb-4">
                Order Bill Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-gray-950">Rs. {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>GST & Service (5%)</span>
                  <span className="font-mono font-bold text-gray-950">Rs. {tax.toFixed(0)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-950">
                  <span>Total Due</span>
                  <span className="font-mono text-xl font-extrabold text-amber-900">
                    Rs. {total.toFixed(0)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium">
                  {error}
                </div>
              )}

              <button
                type="button"
                id="place-order-btn"
                aria-label={`Confirm Table ${tableNumber} Order`}
                disabled={placingOrder || cart.length === 0}
                onClick={handlePlaceOrder}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3.5 px-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {placingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4 text-slate-950" />
                    <span>Confirm Table {tableNumber} Order</span>
                  </>
                )}
              </button>

              <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-200/80 p-4 text-xs text-gray-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Orders are dispatched directly to the chef station. Settle your bill at table {tableNumber} after dining.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
