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
      className={cn('flex h-full min-h-0 flex-col bg-zinc-950', className)}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/90 bg-zinc-900/40 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
