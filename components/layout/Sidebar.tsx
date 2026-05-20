'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bug, Check, ChevronLeft, Circle } from 'lucide-react'
import { PROBLEMS, TOTAL_PROBLEMS } from '@/lib/problems'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'
import { fadeIn } from '@/lib/motion'

export function Sidebar() {
  const pathname = usePathname()
  const progress = useStore((s) => s.progress)
  const completedCount = PROBLEMS.filter((p) => progress[p.id]?.completed).length
  const isHome = pathname === '/'

  return (
    <motion.aside
      data-tour="sidebar"
      className="flex h-full w-[220px] shrink-0 flex-col border-r border-zinc-800/90 bg-[#0c0c0e]"
      {...fadeIn}
      transition={{ duration: 0.35 }}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 border-b border-zinc-800/90 px-4 py-4 transition-colors hover:bg-zinc-900/30"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-teal-500/20 ring-1 ring-amber-500/20">
          <Bug className="h-4 w-4 text-amber-400" />
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-bold leading-tight text-zinc-50">RN Debug</span>
          <span className="block text-[10px] font-medium uppercase tracking-wider text-amber-500/80">
            Labs
          </span>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto py-3">
        <div className="mb-4 px-3">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">
            Learn RN
          </p>
          <p className="rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-2 text-[11px] leading-snug text-zinc-600">
            More modules coming soon. Start with Fix the Bug below.
          </p>
        </div>

        <div className="px-3">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">
            Fix the Bug
          </p>
          <nav data-tour="sidebar-challenges" className="space-y-0.5">
            {PROBLEMS.map((problem) => {
              const isActive = pathname === `/problems/${problem.id}`
              const isComplete = progress[problem.id]?.completed

              return (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.id}`}
                  prefetch
                  className={cn(
                    'group relative flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors',
                    isActive
                      ? 'font-medium text-amber-100'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-md bg-amber-500/15 ring-1 ring-amber-500/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold tabular-nums',
                      isActive
                        ? 'bg-amber-500/25 text-amber-400'
                        : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-400'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                    ) : (
                      problem.id
                    )}
                  </span>
                  <span className="relative z-[1] truncate leading-tight">{problem.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-zinc-800/90 p-3">
        {!isHome && (
          <Link
            href="/"
            className="mb-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        )}
        <div className="flex items-center justify-between rounded-md bg-zinc-900/50 px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Circle className="h-2 w-2 fill-green-500/80 text-green-500/80" />
            Progress
          </span>
          <span className="text-xs font-semibold tabular-nums text-zinc-300">
            {completedCount}
            <span className="text-zinc-600"> / {TOTAL_PROBLEMS}</span>
          </span>
        </div>
      </div>
    </motion.aside>
  )
}
