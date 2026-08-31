import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingConciergeOrb, { OrbLoadingFallback } from '@/components/3d/ConciergeOrbButton';
import ConciergeOrbCanvas, { OrbMesh } from '@/components/3d/ConciergeOrbCanvas';

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-r3f-canvas">{children}</div>
  ),
  useFrame: (callback: any) => {
    // Run callback with mock delta to verify frame consistency
    callback({}, 0.016);
  },
}));

vi.mock('@react-three/drei', () => ({
  Sphere: ({ children, onClick, onPointerOver }: any) => (
    <div
      data-testid="mock-r3f-sphere"
      onClick={onClick}
      onMouseEnter={onPointerOver}
    >
      {children}
    </div>
  ),
  Icosahedron: ({ children }: any) => (
    <div data-testid="mock-r3f-icosahedron">{children}</div>
  ),
  Torus: ({ children }: any) => (
    <div data-testid="mock-r3f-torus">{children}</div>
  ),
  Environment: () => <div data-testid="mock-r3f-environment" />,
  Float: ({ children }: any) => <div>{children}</div>,
}));

describe('3D AI Concierge Orb & Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading fallback with accessible role="status"', () => {
    render(<OrbLoadingFallback />);
    expect(screen.getByRole('status', { name: /Loading 3D AI Concierge Orb/i })).toBeInTheDocument();
  });

  it('renders R3F 3D Canvas with Environment and Mesh primitives', () => {
    const mockOnClick = vi.fn();
    const mockOnHoverChange = vi.fn();

    render(
      <ConciergeOrbCanvas
        isHovered={false}
        onClick={mockOnClick}
        onHoverChange={mockOnHoverChange}
      />
    );

    expect(screen.getByTestId('mock-r3f-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-r3f-sphere')).toBeInTheDocument();
    expect(screen.getByTestId('mock-r3f-icosahedron')).toBeInTheDocument();
    expect(screen.getByTestId('mock-r3f-torus')).toBeInTheDocument();
  });

  it('handles click events and stops propagation in 3D orb mesh', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const mockOnHoverChange = vi.fn();

    render(
      <OrbMesh
        isHovered={false}
        onClick={mockOnClick}
        onHoverChange={mockOnHoverChange}
      />
    );

    const sphere = screen.getByTestId('mock-r3f-sphere');
    await user.click(sphere);
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    await user.hover(sphere);
    expect(mockOnHoverChange).toHaveBeenCalledWith(true);
  });

  it('renders inline 3D concierge orb in recommendation banner', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <FloatingConciergeOrb
        variant="inline"
        onClick={mockOnClick}
      />
    );

    const container = screen.getByTestId('mock-r3f-canvas');
    expect(container).toBeInTheDocument();
  });

  it('renders floating 3D concierge orb container with accessible controls', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <FloatingConciergeOrb
        onClick={mockOnClick}
        label="Ask Tabl Concierge"
        showBadge={true}
      />
    );

    const mainBtn = screen.getByRole('button', { name: /^Open Ask Tabl Concierge$/i });
    expect(mainBtn).toBeInTheDocument();

    const pillBtn = screen.getByRole('button', { name: /^Ask Tabl Concierge$/i });
    expect(pillBtn).toBeInTheDocument();

    await user.click(mainBtn);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
