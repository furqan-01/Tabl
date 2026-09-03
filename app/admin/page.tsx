'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ChefHat,
  UtensilsCrossed,
  Layers,
  ArrowRight,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Key,
  Utensils,
  Database,
  ExternalLink,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Check saved session
    try {
      const savedAuth = localStorage.getItem('tabl_staff_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setCurrentUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload =
        authMode === 'password'
          ? { email: email.trim(), password }
          : { pin: pin.trim() };

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Please verify credentials.');
      }

      // Save user session
      localStorage.setItem('tabl_staff_auth', JSON.stringify(data.user));
      setCurrentUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@tabl.local');
    setPassword('admin123');
    setError(null);
  };

  const handleFillDemoPin = () => {
    setPin('1234');
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('tabl_staff_auth');
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setPin('');
    setError(null);
  };

  // If user is authenticated, display Staff Dashboard Hub
  if (currentUser) {
    return (
      <div id="admin-dashboard-hub" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6 mb-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authenticated Staff
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                {currentUser.role}
              </span>
            </div>
            <h1 id="admin-hub-title" className="text-2xl sm:text-3xl font-display font-black tracking-tight text-gray-950 mt-2">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Active staff session: <span className="font-semibold text-gray-900">{currentUser.email}</span>
            </p>
          </div>

          <button
            type="button"
            id="staff-logout-btn"
            aria-label="Sign Out"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <LogOut className="w-4 h-4 text-gray-600" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Portal Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: KDS */}
          <Link
            id="hub-link-kds"
            href="/admin/kds"
            aria-label="Open Kitchen Display System to monitor live orders"
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-7 shadow-luxury hover:shadow-luxury-hover hover:border-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ChefHat className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  Real-Time Queue
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-gray-950 group-hover:text-amber-950 transition-colors">
                Kitchen Display System (KDS)
              </h2>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Live color-coded ticket line. Advance table tickets through Pending, Cooking, Ready to Serve, and Fulfilled stages.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-950 group-hover:text-amber-700">
              <span>Launch Chef Display Screen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: 86 Inventory & Dish Control */}
          <Link
            id="hub-link-manage"
            href="/admin/manage"
            aria-label="Open Inventory & 86 Management to toggle stock status"
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-7 shadow-luxury hover:shadow-luxury-hover hover:border-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Instant Stock Control
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-gray-950 group-hover:text-amber-950 transition-colors">
                Inventory & 86 Dish Manager
              </h2>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Instantly mark sold-out dishes offline. Sync with the live customer kiosk and AI Concierge in real-time.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-950 group-hover:text-amber-700">
              <span>Open Catalog & 86 Manager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Guest Dining Preview Banner */}
        <div className="rounded-3xl border border-amber-300/60 bg-gradient-to-r from-amber-50/90 via-white to-sky-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-950">Guest Table Kiosk Experience</h3>
              <p className="text-xs text-gray-600">Simulate customer orders, AI Concierge questions, and cart submission.</p>
            </div>
          </div>
          <Link
            id="hub-link-kiosk"
            href="/menu"
            aria-label="Launch guest dining menu and AI concierge view"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-black px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span>Launch Customer Menu</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>
    );
  }

  // Otherwise, render interactive Login Form
  return (
    <div id="admin-login-page" className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-[#FAF9F5]">
      <div id="admin-login-card" className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-9 shadow-luxury">
        {/* Header Badge & Title */}
        <div className="mb-7 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A0C13] text-amber-400 mb-4 shadow-glow-amber">
            <Lock className="w-6 h-6" />
          </div>
          <h1 id="admin-login-title" className="text-2xl font-display font-extrabold tracking-tight text-gray-950">
            Tabl Staff Portal
          </h1>
          <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
            Sign in to manage live inventory, 86 statuses, and the Kitchen Display System.
          </p>
        </div>

        {/* Authentication Mode Switcher */}
        <div className="flex rounded-xl bg-gray-100 p-1.5 mb-6" aria-label="Authentication mode selection">
          <button
            type="button"
            id="auth-mode-email-btn"
            onClick={() => {
              setAuthMode('password');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              authMode === 'password'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            Email &amp; Password
          </button>
          <button
            type="button"
            id="auth-mode-pin-btn"
            aria-label="Quick POS PIN"
            onClick={() => {
              setAuthMode('pin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              authMode === 'pin'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            Quick POS PIN
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {authMode === 'password' ? (
            <>
              <div>
                <label htmlFor="staff-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    id="staff-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tabl.local"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="staff-password" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    id="staff-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="staff-pin" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Staff 4-Digit Access PIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  id="staff-pin"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center tracking-widest font-mono text-xl rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950 focus:outline-none bg-gray-50/50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 text-center">Default terminal PIN is <span className="font-mono font-bold text-gray-800">1234</span></p>
            </div>
          )}

          <button
            type="submit"
            id="staff-login-button"
            aria-label="Sign In to Admin Dashboard"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-gray-950 hover:bg-black px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Sign In to Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Helper */}
        <div className="mt-7 pt-5 border-t border-gray-100 text-center">
          <button
            type="button"
            id="fill-demo-credentials-btn"
            aria-label="Auto-fill demo staff credentials"
            onClick={authMode === 'password' ? handleFillDemo : handleFillDemoPin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{authMode === 'password' ? 'Auto-Fill Demo Credentials (admin@tabl.local / admin123)' : 'Auto-Fill Demo PIN (1234)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
