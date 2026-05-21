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
        'inline-flex items-center justify-center rounded font-medium transition-[colors,transform] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100',
        size === 'sm' && 'h-7 gap-1 px-2.5 text-xs leading-none',
        size === 'md' && 'h-9 gap-1.5 px-3 text-sm leading-none',
        variant === 'default' &&
          'bg-app-control text-app-fg-secondary hover:bg-app-control-hover',
        variant === 'primary' && 'bg-amber-500 text-white hover:bg-amber-400',
        variant === 'ghost' &&
          'bg-transparent text-app-fg-muted hover:bg-app-hover hover:text-app-fg-secondary',
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
    'inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded px-2.5 text-xs font-medium leading-none transition-[colors,transform] duration-150 active:scale-[0.97]',
    variant === 'default' &&
      'bg-app-control text-app-fg-secondary hover:bg-app-control-hover',
    variant === 'primary' && 'bg-amber-500 text-white hover:bg-amber-400',
    variant === 'ghost' &&
      'text-app-fg-subtle hover:bg-app-hover hover:text-app-fg-secondary'
  )
}
