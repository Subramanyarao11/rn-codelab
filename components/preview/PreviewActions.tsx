'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { PreviewPlatformOS } from '@/lib/previewPlatform'
import { cn } from '@/lib/cn'

interface PreviewActionsProps {
  onRun: () => void
  onOpenSnack: () => void
  showPlatformPicker?: boolean
  platform?: PreviewPlatformOS
  onPlatformChange?: (platform: PreviewPlatformOS) => void
}

const PLATFORMS: PreviewPlatformOS[] = ['ios', 'android', 'web']

export function PreviewActions({
  onRun,
  onOpenSnack,
  showPlatformPicker = false,
  platform = 'web',
  onPlatformChange,
}: PreviewActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showPlatformPicker && onPlatformChange && (
        <div
          className="flex rounded border border-zinc-700 bg-zinc-900"
          title="Simulate Platform.OS for preview"
        >
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPlatformChange(p)}
              className={cn(
                'px-2 py-0.5 text-[10px] capitalize transition-colors',
                platform === p
                  ? 'bg-zinc-700 text-teal-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onOpenSnack}
        className={cn(
          'inline-flex h-7 items-center gap-1 rounded px-2 text-[10px] font-medium text-zinc-500',
          'transition-colors hover:bg-zinc-800 hover:text-zinc-300'
        )}
        title="Open in Expo Snack (test on real iOS/Android)"
      >
        <ExternalLink className="h-3 w-3" />
        Snack
      </button>
      <Button size="sm" variant="primary" onClick={onRun}>
        Run
      </Button>
    </div>
  )
}
