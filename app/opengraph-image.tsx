import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_SHORT_DESCRIPTION } from '@/lib/site'

export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 45%, #0f172a 100%)',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.35) 0%, rgba(20,184,166,0.25) 100%)',
              border: '2px solid rgba(245,158,11,0.35)',
              fontSize: 28,
              fontWeight: 800,
              color: '#fbbf24',
            }}
          >
            RN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24' }}>Fix the Bug</div>
            <div style={{ fontSize: 20, color: '#a1a1aa' }}>React Native debugging labs</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#d4d4d8' }}>
            {SITE_SHORT_DESCRIPTION}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {['Monaco editor', 'Live preview', 'Automated tests'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: 'rgba(39,39,42,0.8)',
                border: '1px solid rgba(63,63,70,0.8)',
                fontSize: 20,
                color: '#e4e4e7',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
