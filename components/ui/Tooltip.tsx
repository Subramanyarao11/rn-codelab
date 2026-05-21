interface TooltipProps {
  children: React.ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-app-control px-2 py-1 text-xs text-app-fg-secondary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        {content}
      </span>
    </span>
  )
}
