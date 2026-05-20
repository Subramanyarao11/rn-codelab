'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type Platform = 'web' | 'ios' | 'android'

interface PreviewToolbarProps {
  platform: Platform
  onPlatformChange: (p: Platform) => void
  onRun: () => void
}

const PLATFORMS: Platform[] = ['web', 'ios', 'android']

export function PreviewToolbar({ platform, onPlatformChange, onRun }: PreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Preview</span>
      <div className="flex items-center gap-2">
        <div className="flex rounded-md border border-zinc-800">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPlatformChange(p)}
              className={cn(
                'px-2.5 py-1 text-xs capitalize transition-colors',
                platform === p
                  ? 'bg-zinc-800 text-teal-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <Button size="sm" variant="primary" onClick={onRun}>
          Run
        </Button>
      </div>
    </div>
  )
}
