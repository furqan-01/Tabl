import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 104,
          background: 'radial-gradient(circle at top left, #1e293b, #090a0f)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          borderRadius: '36px',
          fontWeight: 900,
          border: '4px solid rgba(245, 158, 11, 0.45)',
        }}
      >
        <span style={{ transform: 'translateY(-4px)', fontFamily: 'sans-serif', fontWeight: 900 }}>T</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
