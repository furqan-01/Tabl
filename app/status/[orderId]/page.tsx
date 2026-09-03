'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Utensils,
  CreditCard,
  ArrowLeft,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { OrderRecord } from '@/types/restaurant';

interface OrderStatusPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderStatusPage({ params }: OrderStatusPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order status:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 6000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const stages = [
    { key: 'pending', label: 'Received', desc: 'Sent to kitchen display' },
    { key: 'preparing', label: 'Cooking', desc: 'Chef is preparing your order' },
    { key: 'ready', label: 'Ready', desc: 'Plated and ready for server pickup' },
    { key: 'completed', label: 'Served', desc: 'Delivered to your table' },
  ];

  const currentStatus = order?.status || 'pending';
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div id="order-status-page" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6 mb-8">
        <div>
          <Link
            href="/menu"
            aria-label="Back to menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-950 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
          </Link>
          <h1 id="order-status-title" className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-gray-950">
            Live Table Order Status
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Tracking order <span className="font-mono font-bold text-gray-900">#{orderId.slice(0, 8)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStatus}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-luxury mb-8">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-700 mb-6">
          Preparation Progression
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {stages.map((stage, idx) => {
            const isDone = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={stage.key}
                className={`rounded-2xl border p-4 transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-50/70 shadow-sm'
                    : isDone
                    ? 'border-gray-200 bg-gray-50/60'
                    : 'border-gray-100 bg-white opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="font-bold text-sm text-gray-950">{stage.label}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Summary */}
      {order && (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Dining Location</span>
              <h3 className="font-bold text-gray-950 text-base">Table #{order.tableNumber || '4'}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Bill Status</span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-900 mt-0.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                <span>Pay to Waiter</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-700 mb-3">
              Items Ordered
            </h4>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-950 bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-gray-950">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-950">
                    Rs. {(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-950">Total Bill Amount</span>
            <span className="font-mono text-xl font-extrabold text-amber-900">
              Rs. {order.total?.toFixed(0) || '0'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
