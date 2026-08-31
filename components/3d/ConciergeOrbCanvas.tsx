'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, Torus, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { OrbLoadingFallback } from './ConciergeOrbFallback';

interface OrbMeshProps {
  isHovered: boolean;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

/**
 * 3D Futuristic AI Concierge Orb Mesh
 * Employs Sphere and Icosahedron primitives with metallic MeshStandardMaterial,
 * frame-independent rotation (via delta parameter), and optimized raycasting with stopPropagation.
 */
export function OrbMesh({ isHovered, onClick, onHoverChange }: OrbMeshProps) {
  const orbGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerLatticeRef = useRef<THREE.Mesh>(null);

  // Animate rotation continuously using delta to ensure consistent speed across 60Hz/120Hz/144Hz monitors
  useFrame((_state, delta) => {
    // Dynamic rotation multiplier (faster on hover)
    const speed = isHovered ? 2.2 : 1.0;

    if (coreRef.current && coreRef.current.rotation) {
      coreRef.current.rotation.y += delta * 0.6 * speed;
      coreRef.current.rotation.x += delta * 0.3 * speed;
    }

    if (ringRef.current && ringRef.current.rotation) {
      ringRef.current.rotation.x += delta * 0.8 * speed;
      ringRef.current.rotation.z -= delta * 0.5 * speed;
    }

    if (outerLatticeRef.current && outerLatticeRef.current.rotation) {
      outerLatticeRef.current.rotation.y -= delta * 0.4 * speed;
      outerLatticeRef.current.rotation.z += delta * 0.2 * speed;
    }

    // Smooth hover scale interpolation
    if (orbGroupRef.current && orbGroupRef.current.scale && typeof orbGroupRef.current.scale.lerp === 'function') {
      const targetScale = isHovered ? 1.15 : 1.0;
      orbGroupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 8
      );
    }
  });

  const handleClick = (e: THREE.Event | any) => {
    // Optimized Interactivity: stop raycaster propagation so only the first hit registers
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (onClick) {
      onClick();
    }
  };

  const handlePointerOver = (e: THREE.Event | any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (onHoverChange) {
      onHoverChange(true);
    }
  };

  const handlePointerOut = (e: THREE.Event | any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (onHoverChange) {
      onHoverChange(false);
    }
  };

  return (
    <group ref={orbGroupRef}>
      {/* Floating oscillation wrapper */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.6}>
        {/* Core Sleek Metallic Orb (Sphere primitive from drei) */}
        <Sphere
          ref={coreRef}
          args={[0.85, 64, 64]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.92}
            roughness={0.12}
            envMapIntensity={1.8}
          />
        </Sphere>

        {/* Futuristic Orbital Ring (Torus primitive) */}
        <Torus
          ref={ringRef}
          args={[1.15, 0.025, 16, 64]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.85}
            roughness={0.2}
            emissive="#d97706"
            emissiveIntensity={isHovered ? 0.8 : 0.3}
          />
        </Torus>

        {/* Outer Geometric Wireframe Lattice (Icosahedron primitive from drei) */}
        <Icosahedron
          ref={outerLatticeRef}
          args={[1.05, 1]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial
            color="#38bdf8"
            wireframe
            metalness={0.8}
            roughness={0.2}
            emissive="#0284c7"
            emissiveIntensity={isHovered ? 0.6 : 0.2}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

export interface ConciergeOrbCanvasProps {
  isHovered: boolean;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

/**
 * 3D R3F Canvas wrapper for the AI Concierge Orb
 * Wrapped in React Suspense with an HTML loading fallback
 */
export default function ConciergeOrbCanvas({
  isHovered,
  onClick,
  onHoverChange,
}: ConciergeOrbCanvasProps) {
  return (
    <Suspense fallback={<OrbLoadingFallback />}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}
      >
        {/* Multi-point studio lighting - zero network dependencies for instantaneous rendering */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, -3, 2]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[3, -2, 4]} intensity={1.2} color="#f59e0b" />

        {/* 3D Orb Mesh */}
        <OrbMesh
          isHovered={isHovered}
          onClick={onClick}
          onHoverChange={onHoverChange}
        />
      </Canvas>
    </Suspense>
  );
}
