'use client'

import { useEffect, useRef, useState } from 'react'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { View } from 'react-native'
import type { PreviewPlatformOS } from '@/lib/previewPlatform'
import { cn } from '@/lib/cn'
import { PreviewErrorBoundary } from './PreviewErrorBoundary'
import { KeyboardSimulator } from './KeyboardSimulator'

interface LocalPreviewProps {
  code: string
  refreshKey: number
  platformOS?: PreviewPlatformOS
  simulateKeyboard?: boolean
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

function deferUnmount(root: Root | null) {
  if (!root) return
  queueMicrotask(() => {
    try {
      root.unmount()
    } catch {
      // Root may already be unmounted during navigation/HMR
    }
  })
}

function codeUsesKeyboardAvoidingBehavior(source: string): boolean {
  return /behavior\s*=/.test(source)
}

export function LocalPreview({
  code,
  refreshKey,
  platformOS = 'web',
  simulateKeyboard = false,
}: LocalPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<Root | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runIdRef = useRef(0)
  const [status, setStatus] = useState<'loading' | 'running' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [keyboardFocused, setKeyboardFocused] = useState(false)

  const keyboardFixApplied = codeUsesKeyboardAvoidingBehavior(code)
  const showIosKeyboard =
    simulateKeyboard && !keyboardFixApplied && keyboardFocused

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      const root = rootRef.current
      rootRef.current = null
      deferUnmount(root)
    }
  }, [])

  useEffect(() => {
    setKeyboardFocused(false)
  }, [code, refreshKey, simulateKeyboard])

  useEffect(() => {
    if (!simulateKeyboard || !frameRef.current) return

    const frame = frameRef.current

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        setKeyboardFocused(true)
      }
    }

    const onFocusOut = () => {
      window.setTimeout(() => {
        if (!frame.contains(document.activeElement)) {
          setKeyboardFocused(false)
        }
      }, 80)
    }

    frame.addEventListener('focusin', onFocusIn)
    frame.addEventListener('focusout', onFocusOut)
    return () => {
      frame.removeEventListener('focusin', onFocusIn)
      frame.removeEventListener('focusout', onFocusOut)
    }
  }, [simulateKeyboard, refreshKey])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const runId = ++runIdRef.current

    const run = async () => {
      if (!mountRef.current || runId !== runIdRef.current) return
      setStatus('loading')
      setError(null)

      try {
        const { evalUserCode } = await import('@/lib/evalUserCode')
        const Component = evalUserCode(code, { platformOS })

        if (runId !== runIdRef.current || !mountRef.current) return

        if (!rootRef.current) {
          rootRef.current = createRoot(mountRef.current)
        }

        const previewTree = createElement(
          PreviewShell,
          null,
          createElement(Component)
        )
        rootRef.current.render(
          createElement(PreviewErrorBoundary, { key: String(runId), children: previewTree })
        )

        if (runId === runIdRef.current) {
          setStatus('running')
        }
      } catch (err) {
        if (runId !== runIdRef.current) return
        const message = err instanceof Error ? err.message : 'Failed to render preview'
        setError(message)
        setStatus('error')
        const root = rootRef.current
        rootRef.current = null
        deferUnmount(root)
        if (mountRef.current) {
          mountRef.current.innerHTML = `<pre style="padding:16px;color:#b91c1c;font:12px/1.4 monospace;white-space:pre-wrap">${message}</pre>`
        }
      }
    }

    debounceRef.current = setTimeout(run, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [code, refreshKey, platformOS])

  return (
    <div className="relative h-full min-h-0 w-full bg-zinc-900">
      <div
        ref={frameRef}
        className="relative mx-auto h-full w-full max-w-[420px] overflow-hidden border-x border-zinc-800 bg-white shadow-inner"
      >
        <div ref={mountRef} className="h-full w-full overflow-hidden overscroll-none" />
        <KeyboardSimulator visible={showIosKeyboard} />
        {simulateKeyboard && keyboardFixApplied && status === 'running' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
            <span className="rounded-full bg-teal-600/90 px-2 py-0.5 text-[10px] text-white">
              KeyboardAvoidingView active
            </span>
          </div>
        )}
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
