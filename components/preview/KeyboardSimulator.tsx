'use client'

import { cn } from '@/lib/cn'

interface KeyboardSimulatorProps {
  visible: boolean
}

/** Visual stand-in for an iOS software keyboard in the web preview. */
export function KeyboardSimulator({ visible }: KeyboardSimulatorProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col',
        'border-t border-zinc-500/80 bg-zinc-700/95 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]'
      )}
      style={{ height: '46%' }}
      aria-hidden
    >
      <div className="flex h-9 shrink-0 items-center justify-center border-b border-zinc-600/80 bg-zinc-800/90">
        <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          Simulated iOS keyboard
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-7 rounded bg-zinc-600/90" />
          ))}
        </div>
        <div className="mt-auto h-10 rounded-md bg-zinc-600/70" />
      </div>
    </div>
  )
}
