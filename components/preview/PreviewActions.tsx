'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

interface PreviewActionsProps {
  onRun: () => void
  onOpenSnack: () => void
}

export function PreviewActions({ onRun, onOpenSnack }: PreviewActionsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onOpenSnack}
        className={cn(
          'inline-flex h-7 items-center gap-1 rounded px-2 text-[10px] font-medium text-zinc-500',
          'transition-colors hover:bg-zinc-800 hover:text-zinc-300'
        )}
        title="Open this code in Expo Snack (new tab)"
      >
        <ExternalLink className="h-3 w-3" />
        Expo Snack
      </button>
      <Button size="sm" variant="primary" onClick={onRun}>
        Run
      </Button>
    </>
  )
}
