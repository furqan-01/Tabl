import React from 'react';

/**
 * Fallback HTML Loading Spinner (Non-blocking CSS representation)
 */
export function OrbLoadingFallback() {
  return (
    <div
      id="orb-loading-fallback"
      role="status"
      aria-label="Loading 3D AI Concierge Orb"
      className="w-full h-full flex items-center justify-center relative"
    >
      <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      <div className="absolute w-5 h-5 rounded-full bg-slate-900 animate-pulse border border-slate-700" />
    </div>
  );
}

export default OrbLoadingFallback;
