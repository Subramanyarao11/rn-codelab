import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.35) 0%, rgba(20,184,166,0.25) 100%)',
            border: '1px solid rgba(245,158,11,0.35)',
            color: '#fbbf24',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          RN
        </div>
      </div>
    ),
    { ...size }
  )
}
