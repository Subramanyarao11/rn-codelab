'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProblemDefinition } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button, toolbarLinkClass } from '@/components/ui/Button'

interface TopBarProps {
  problem: ProblemDefinition
  showHint: boolean
  onToggleHint: () => void
  onReset: () => void
  onShowSolution: () => void
  showingSolution: boolean
}

export function TopBar({
  problem,
  showHint,
  onToggleHint,
  onReset,
  onShowSolution,
  showingSolution,
}: TopBarProps) {
  const prevId = problem.id > 1 ? problem.id - 1 : null
  const nextId = problem.id < 10 ? problem.id + 1 : null

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-800/90 bg-zinc-900/30 px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <Badge variant="ftb">FTB #{problem.id}</Badge>
        <h1 className="truncate text-sm font-semibold text-zinc-100">{problem.title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
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
    </header>
  )
}
