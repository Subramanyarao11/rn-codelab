'use client'

import { useEffect, useRef, useState } from 'react'
import { buildSnackUrl, sendCodeToSnack } from '@/lib/snack'
import { cn } from '@/lib/cn'

interface SnackPreviewProps {
  code: string
  platform: 'web' | 'ios' | 'android'
  runKey: number
}

export function SnackPreview({ code, platform, runKey }: SnackPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const snackUrl = buildSnackUrl(code, platform)
  const lastPushedCode = useRef<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setReady(false)
    lastPushedCode.current = null
  }, [runKey, platform])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== 'https://snack.expo.dev') return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.type === 'SNACK_LOADED' || data?.type === 'CODE_CHANGED') {
          setLoading(false)
          setReady(true)
        }
      } catch {
        // ignore non-JSON messages
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Push latest code after iframe is ready (backup when URL reload is slow or stale)
  useEffect(() => {
    if (!ready || !iframeRef.current) return
    if (lastPushedCode.current === code) return
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        sendCodeToSnack(iframeRef.current, code)
        lastPushedCode.current = code
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [code, ready, runKey])

  const handleLoad = () => {
    setTimeout(() => {
      setLoading(false)
      setReady(true)
      if (iframeRef.current) {
        sendCodeToSnack(iframeRef.current, code)
        lastPushedCode.current = code
      }
    }, 2500)
  }

  return (
    <div className="relative h-full min-h-0 flex-1 bg-zinc-900">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-700" />
          <span className="ml-3 text-sm text-zinc-500">Loading Snack preview…</span>
        </div>
      )}
      <iframe
        key={`${runKey}-${platform}`}
        ref={iframeRef}
        src={snackUrl}
        onLoad={handleLoad}
        className="h-full w-full border-0"
        allow="geolocation; camera; microphone"
        title="Expo Snack Preview"
      />
      <div
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs',
          ready ? 'bg-zinc-800/90 text-teal-400' : 'bg-zinc-800/90 text-zinc-500'
        )}
      >
        <span
          className={cn('h-2 w-2 rounded-full', ready ? 'bg-teal-400' : 'bg-zinc-500 animate-pulse')}
        />
        {ready ? 'Running' : 'Loading'}
      </div>
    </div>
  )
}
