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
    <div className="flex items-center justify-between border-b border-app-border bg-app-bg px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-app-fg-subtle">
        Preview
      </span>
      <div className="flex items-center gap-2">
        <div className="flex rounded-md border border-app-border">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPlatformChange(p)}
              className={cn(
                'px-2.5 py-1 text-xs capitalize transition-colors',
                platform === p
                  ? 'bg-app-control text-teal-600 dark:text-teal-400'
                  : 'text-app-fg-subtle hover:text-app-fg-secondary'
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
