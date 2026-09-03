import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 19,
          background: 'linear-gradient(135deg, #090a0f 0%, #171923 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          borderRadius: '7px',
          fontWeight: 900,
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
        }}
      >
        <span style={{ transform: 'translateY(-1px)', fontFamily: 'sans-serif', fontWeight: 900 }}>T</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
