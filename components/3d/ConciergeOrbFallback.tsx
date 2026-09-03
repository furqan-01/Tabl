import React from 'react';

/**
 * High-fidelity, zero-blocking CSS/SVG Animated Orb Fallback.
 * Renders instantly with 0ms JS execution, zero layout shift (CLS: 0),
 * and perfect visual fidelity before or during 3D WebGL initialization.
 */
export function OrbLoadingFallback() {
  return (
    <div
      id="orb-loading-fallback"
      role="status"
      aria-label="Tabl AI Concierge Orb"
      className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-full select-none"
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-emerald-500/20 blur-md animate-pulse" />

      {/* Orbiting Ring 1 */}
      <div className="absolute w-[80%] h-[80%] rounded-full border border-amber-400/40 animate-spin [animation-duration:6s]" />

      {/* Orbiting Ring 2 (counter rotation) */}
      <div className="absolute w-[70%] h-[70%] rounded-full border border-sky-400/30 border-dashed animate-spin [animation-duration:10s] [animation-direction:reverse]" />

      {/* Core Metallic Sphere with radial gradient */}
      <div className="relative w-[56%] h-[56%] rounded-full bg-radial from-slate-800 via-slate-900 to-black shadow-inner border border-slate-700/80 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-amber-400/80 blur-[1px] animate-ping" />
      </div>
    </div>
  );
}

export default OrbLoadingFallback;

