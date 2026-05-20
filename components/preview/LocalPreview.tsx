'use client'

import { useEffect, useRef, useState } from 'react'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { View } from 'react-native'
import { cn } from '@/lib/cn'

interface LocalPreviewProps {
  code: string
  refreshKey: number
}

function PreviewShell({ children }: { children: React.ReactNode }) {
  return createElement(
    View,
    {
      style: {
        flex: 1,
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#fff',
      },
    },
    children
  )
}

export function LocalPreview({ code, refreshKey }: LocalPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<Root | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<'loading' | 'running' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      rootRef.current?.unmount()
      rootRef.current = null
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const run = async () => {
      if (!mountRef.current) return
      setStatus('loading')
      setError(null)

      try {
        const { evalUserCode } = await import('@/lib/evalUserCode')
        const Component = evalUserCode(code)

        if (!rootRef.current) {
          rootRef.current = createRoot(mountRef.current)
        }

        rootRef.current.render(
          createElement(PreviewShell, null, createElement(Component))
        )
        setStatus('running')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to render preview'
        setError(message)
        setStatus('error')
        rootRef.current?.unmount()
        rootRef.current = null
        if (mountRef.current) {
          mountRef.current.innerHTML = `<pre style="padding:16px;color:#b91c1c;font:12px/1.4 monospace;white-space:pre-wrap">${message}</pre>`
        }
      }
    }

    debounceRef.current = setTimeout(run, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [code, refreshKey])

  return (
    <div className="relative h-full min-h-0 flex-1 bg-zinc-900">
      <div className="mx-auto h-full w-full max-w-[420px] overflow-hidden border-x border-zinc-800 bg-white shadow-inner">
        <div ref={mountRef} className="h-full w-full overflow-auto" />
      </div>
      <div
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs',
          status === 'running' && 'bg-zinc-800/90 text-teal-400',
          status === 'loading' && 'bg-zinc-800/90 text-zinc-500',
          status === 'error' && 'bg-zinc-800/90 text-red-400'
        )}
      >
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'running' && 'bg-teal-400',
            status === 'loading' && 'animate-pulse bg-zinc-500',
            status === 'error' && 'bg-red-400'
          )}
        />
        {status === 'running' ? 'Running' : status === 'loading' ? 'Updating…' : 'Error'}
      </div>
      {error && status === 'error' && (
        <p className="absolute bottom-2 left-2 right-2 truncate text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
