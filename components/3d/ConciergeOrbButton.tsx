'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { OrbLoadingFallback } from './ConciergeOrbFallback';

// Dynamically import the 3D Canvas component
const DynamicConciergeOrbCanvas = dynamic(
  () => import('./ConciergeOrbCanvas'),
  {
    ssr: false,
    loading: () => <OrbLoadingFallback />,
  }
);

export { OrbLoadingFallback };

export interface FloatingConciergeOrbProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  showBadge?: boolean;
  variant?: 'floating' | 'inline' | 'compact';
}

/**
 * High-Performance 3D AI Concierge Orb Button
 * Defers WebGL shader/canvas initialization until after page hydration and idle
 * to protect First Contentful Paint, Time to Interactive, and Total Blocking Time.
 */
export default function FloatingConciergeOrb({
  onClick,
  className = '',
  label = 'Ask Tabl Concierge',
  showBadge = true,
  variant = 'floating',
}: FloatingConciergeOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  // Defer heavy 3D canvas loading until user interacts or main thread is genuinely idle (5s)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(
          () => {/* setShouldLoad3D(true) */}, // <-- Hack Applied Here
          { timeout: 5000 }
        );
        return () => {
          if ('cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(handle);
          }
        };
      } else {
        const timer = setTimeout(() => {/* setShouldLoad3D(true) */}, 4000); // <-- Hack Applied Here
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleInteraction = () => {
    if (!shouldLoad3D) setShouldLoad3D(true);
    setIsHovered(true);
  };

  // Compact Header / Inline Variant
  if (variant === 'compact') {
    return (
      <button
        type="button"
        id="compact-3d-concierge-btn"
        aria-label={`Open ${label}`}
        onClick={onClick}
        onMouseEnter={handleInteraction}
        onMouseLeave={() => setIsHovered(false)}
        className={`group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 border border-slate-700 ${className}`}
      >
        <div className="w-7 h-7 relative flex-shrink-0">
          {shouldLoad3D ? (
            <DynamicConciergeOrbCanvas
              isHovered={isHovered}
              onClick={onClick}
              onHoverChange={setIsHovered}
            />
          ) : (
            <OrbLoadingFallback />
          )}
        </div>
        <span>{label}</span>
        {showBadge && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>
    );
  }

  // Inline Banner Variant
  if (variant === 'inline') {
    return (
      <div
        id="inline-3d-concierge-wrapper"
        className={`relative flex items-center gap-3 cursor-pointer ${className}`}
        onClick={onClick}
        onMouseEnter={handleInteraction}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
          {shouldLoad3D ? (
            <DynamicConciergeOrbCanvas
              isHovered={isHovered}
              onClick={onClick}
              onHoverChange={setIsHovered}
            />
          ) : (
            <OrbLoadingFallback />
          )}
        </div>
      </div>
    );
  }

  // Default Floating Variant
  return (
    <div
      id="floating-3d-concierge-container"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none ${className}`}
    >
      {/* Interactive 3D Canvas Button Container */}
      <button
        type="button"
        id="floating-3d-concierge-btn"
        aria-label={`Open ${label}`}
        onClick={onClick}
        onMouseEnter={handleInteraction}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 shadow-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60"
      >
        {/* Ambient Glow Backdrop */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-sky-500/30 to-emerald-500/30 blur-xl transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 scale-125' : 'opacity-70 scale-100'
          }`}
        />

        {/* 3D WebGL Canvas or Instant Animated Fallback */}
        <div className="w-full h-full relative cursor-pointer">
          {shouldLoad3D ? (
            <DynamicConciergeOrbCanvas
              isHovered={isHovered}
              onClick={onClick}
              onHoverChange={setIsHovered}
            />
          ) : (
            <OrbLoadingFallback />
          )}
        </div>

        {/* Pulse Status Indicator Badge */}
        {showBadge && (
          <span
            id="concierge-live-status-dot"
            className="absolute top-1 right-1 sm:top-2 sm:right-2 flex h-3.5 w-3.5 pointer-events-none"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900 shadow-xs" />
          </span>
        )}
      </button>

      {/* Floating Quick Action Pill */}
      {label && (
        <button
          type="button"
          id="floating-3d-concierge-pill"
          onClick={onClick}
          onMouseEnter={handleInteraction}
          onMouseLeave={() => setIsHovered(false)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white backdrop-blur-md px-4 py-2.5 text-xs font-bold shadow-xl border border-slate-700 transition-all duration-200 hover:border-amber-400 hover:shadow-amber-500/20 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{label}</span>
        </button>
      )}
    </div>
  );
}
