'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Layers,
  Utensils,
  BellRing,
  CreditCard,
  Check,
  Play,
  Sparkles,
} from 'lucide-react';
import { OrderRecord } from '@/types/restaurant';

export default function KitchenDisplaySystemPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const getAuthHeader = useCallback(() => {
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
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          ...getAuthHeader(),
        },
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchOrders();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchOrders]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  ) => {
    setUpdatingId(orderId);
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  const displayedOrders = orders.filter((o) => {
    if (filterStatus === 'active') return o.status !== 'completed' && o.status !== 'cancelled';
    if (filterStatus === 'pending') return o.status === 'pending';
    if (filterStatus === 'preparing') return o.status === 'preparing';
    if (filterStatus === 'ready') return o.status === 'ready';
    if (filterStatus === 'completed') return o.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New Order
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-900 border border-orange-300">
            <ChefHat className="w-3 h-3 text-orange-600" />
            Cooking
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Ready
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
            Served
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div id="kds-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Staff Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6 mb-8">
        <div className="flex items-center space-x-3">
          <Link
            id="kds-back-to-hub"
            href="/admin"
            aria-label="Back to staff hub"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-950 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Staff Hub
          </Link>
          <span className="text-gray-300 font-bold">/</span>
          <h1 id="kds-title" className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-gray-950">
            Kitchen Display System (KDS)
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            aria-label={autoRefresh ? 'Pause live polling' : 'Resume live polling'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold border transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              autoRefresh
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`} />
            <span>{autoRefresh ? 'Live Polling Active' : 'Polling Paused'}</span>
          </button>

          <button
            type="button"
            aria-label="Refresh kitchen orders manually"
            onClick={() => fetchOrders()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            id="kds-link-manage"
            href="/admin/manage"
            aria-label="Navigate to inventory 86 management"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-950 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Inventory 86</span>
          </Link>
        </div>
      </div>

      {/* Active Filter Tabs & Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Filter orders by stage">
          {[
            { key: 'active', label: 'Active Queue', count: activeOrders.length },
            { key: 'pending', label: 'New / Pending', count: orders.filter((o) => o.status === 'pending').length },
            { key: 'preparing', label: 'Cooking', count: orders.filter((o) => o.status === 'preparing').length },
            { key: 'ready', label: 'Ready to Serve', count: orders.filter((o) => o.status === 'ready').length },
            { key: 'completed', label: 'Served', count: orders.filter((o) => o.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={filterStatus === tab.key}
              aria-label={`Filter by ${tab.label}, ${tab.count} orders`}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                filterStatus === tab.key
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  filterStatus === tab.key
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-600 font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Kitchen tickets sync in real-time</span>
        </div>
      </div>

      {/* Ticket Grid */}
      {displayedOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center">
          <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-950 font-display">No tickets in this stage</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1 leading-relaxed">
            Incoming table orders placed from customer tablets or QR codes will appear here instantaneously.
          </p>
        </div>
      ) : (
        <div id="kds-ticket-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedOrders.map((order) => {
            const isUpdating = updatingId === order.id;
            return (
              <div
                key={order.id}
                id={`kds-ticket-${order.id}`}
                className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white shadow-luxury overflow-hidden transition-all hover:shadow-luxury-hover"
              >
                <div>
                  {/* Ticket Header */}
                  <div className="border-b border-gray-100 bg-gray-50/90 px-5 py-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <h3 className="font-bold text-gray-950 text-base flex items-center gap-1.5 mt-0.5">
                        <Utensils className="w-4 h-4 text-amber-700" />
                        Table {order.tableNumber || 'Takeout'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-mono block mb-1">
                        {formatTime(order.createdAt)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-5 bg-white">
                    <ul className="space-y-3">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start space-x-2.5">
                            <span className="font-bold font-mono text-gray-950 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs">
                              {item.quantity}x
                            </span>
                            <div>
                              <span className="text-sm font-bold text-gray-950">
                                {item.name}
                              </span>
                              {item.notes && (
                                <p className="text-xs text-amber-900 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-200/60 font-medium">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-gray-600">
                            Rs. {(item.price * item.quantity).toFixed(0)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Customer Order Notes */}
                    {order.specialInstructions && (
                      <div className="mt-4 rounded-xl bg-amber-50/90 border border-amber-200/80 p-3 text-xs text-amber-950">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900 block mb-0.5">
                          Special Instructions:
                        </span>
                        {order.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {/* Bill Summary & Payment Status */}
                  <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                      <span>Table Settle:</span>
                      <span className="font-bold text-gray-950">
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pay Waiter'}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-gray-950 text-sm">
                      Rs. {order.total?.toFixed(0) || '0'}
                    </div>
                  </div>

                  {/* Stage Action Controls */}
                  <div className="border-t border-gray-100 p-4 bg-white flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        aria-label={`Start preparing order for Table ${order.tableNumber}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-orange-700 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>{isUpdating ? 'Updating...' : 'Start Cooking'}</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        type="button"
                        aria-label={`Mark order ready to serve for Table ${order.tableNumber}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-emerald-700 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isUpdating ? 'Updating...' : 'Ready to Serve'}</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        type="button"
                        aria-label={`Complete and close ticket for Table ${order.tableNumber}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="flex-1 rounded-xl bg-gray-950 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-black transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isUpdating ? 'Updating...' : 'Fulfill & Close'}</span>
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="w-full text-center py-2 text-xs text-emerald-800 font-bold bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Order Fulfilled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
