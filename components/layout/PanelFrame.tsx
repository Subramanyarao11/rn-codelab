import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { fadeIn } from '@/lib/motion'

interface PanelFrameProps {
  label: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
  tourId?: string
}

export function PanelFrame({ label, children, actions, className, tourId }: PanelFrameProps) {
  return (
    <div
      data-tour={tourId}
      className={cn('flex h-full min-h-0 flex-col bg-app-bg', className)}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-app-border bg-app-surface-elevated px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg-subtle">
          {label}
        </span>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <motion.div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        {...fadeIn}
        transition={{ duration: 0.22, delay: 0.05 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
