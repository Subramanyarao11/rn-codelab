'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import type { ProblemDefinition } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button, toolbarLinkClass } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { fadeInDown } from '@/lib/motion'

interface TopBarProps {
  problem: ProblemDefinition
  showHint: boolean
  onToggleHint: () => void
  onReset: () => void
  onShowSolution: () => void
  showingSolution: boolean
  onShowTour?: () => void
}

export function TopBar({
  problem,
  showHint,
  onToggleHint,
  onReset,
  onShowSolution,
  showingSolution,
  onShowTour,
}: TopBarProps) {
  const prevId = problem.id > 1 ? problem.id - 1 : null
  const nextId = problem.id < 10 ? problem.id + 1 : null

  return (
    <motion.header
      data-tour="toolbar"
      className="flex shrink-0 items-center justify-between gap-4 border-b border-app-border bg-app-surface-elevated px-4 py-2"
      {...fadeInDown}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Badge variant="ftb">FTB #{problem.id}</Badge>
        <h1 className="truncate text-sm font-semibold text-app-fg">{problem.title}</h1>
      </div>

      <div data-tour="toolbar-actions" className="flex shrink-0 items-center gap-1.5">
        <ThemeToggle />
        {onShowTour && (
          <Button size="sm" variant="ghost" onClick={onShowTour} title="Workspace tour">
            <HelpCircle className="h-3.5 w-3.5" />
            Tour
          </Button>
        )}
        <Button size="sm" variant="default" onClick={onReset}>
          Reset Code
        </Button>
        <Button size="sm" variant="default" onClick={onToggleHint}>
          {showHint ? 'Hide Hints' : 'Show Hints'}
        </Button>
        <Button size="sm" variant="default" onClick={onShowSolution}>
          {showingSolution ? 'Hide Solution' : 'Show Solution'}
        </Button>
        {prevId && (
          <Link href={`/problems/${prevId}`} className={toolbarLinkClass('ghost')}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </Link>
        )}
        {nextId && (
          <Link href={`/problems/${nextId}`} className={toolbarLinkClass('primary')}>
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.header>
  )
}
