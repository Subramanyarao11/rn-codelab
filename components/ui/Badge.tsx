import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'ftb' | 'success'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        variant === 'ftb' && 'bg-amber-500 text-white',
        variant === 'success' && 'bg-green-500/20 text-green-400',
        variant === 'default' && 'bg-app-control text-app-fg-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
