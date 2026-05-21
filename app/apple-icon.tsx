import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(20,184,166,0.2) 100%)',
            border: '2px solid rgba(245,158,11,0.35)',
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 800, color: '#fbbf24', letterSpacing: -1 }}>
            RN
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: 700,
              color: '#14b8a6',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Debug
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
