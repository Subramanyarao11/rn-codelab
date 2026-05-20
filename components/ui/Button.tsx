import { cn } from '@/lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded font-medium transition-colors disabled:opacity-50',
        size === 'sm' && 'h-7 gap-1 px-2.5 text-xs leading-none',
        size === 'md' && 'h-9 gap-1.5 px-3 text-sm leading-none',
        variant === 'default' && 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
        variant === 'primary' && 'bg-amber-500 text-white hover:bg-amber-400',
        variant === 'ghost' && 'bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/** Shared styles for Link-as-button in toolbars (avoids nested button height bugs) */
export function toolbarLinkClass(variant: 'default' | 'primary' | 'ghost' = 'default') {
  return cn(
    'inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded px-2.5 text-xs font-medium leading-none transition-colors',
    variant === 'default' && 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
    variant === 'primary' && 'bg-amber-500 text-white hover:bg-amber-400',
    variant === 'ghost' && 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200'
  )
}
