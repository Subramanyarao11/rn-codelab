'use client'

import { PanelResizeHandle } from 'react-resizable-panels'
import { cn } from '@/lib/cn'

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical'
  className?: string
}

export function ResizeHandle({ direction, className }: ResizeHandleProps) {
  return (
    <PanelResizeHandle
      className={cn(
        'group relative z-10 flex-shrink-0 bg-zinc-800/80 transition-colors',
        'hover:bg-amber-500/40 data-[resize-handle-active]:bg-amber-500/70',
        direction === 'horizontal' && 'w-[3px] cursor-col-resize',
        direction === 'vertical' && 'h-[3px] w-full cursor-row-resize',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute rounded-full bg-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 group-data-[resize-handle-active]:bg-amber-400 group-data-[resize-handle-active]:opacity-100',
          direction === 'horizontal' && 'left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2',
          direction === 'vertical' && 'left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2'
        )}
      />
    </PanelResizeHandle>
  )
}
