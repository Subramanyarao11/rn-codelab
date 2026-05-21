'use client'

import type { ProblemDefinition } from '@/lib/types'
import { TagBadge } from './TagBadge'
import { HintBox } from './HintBox'
import { ContributorCredit } from './ContributorCredit'

interface ProblemPanelProps {
  problem: ProblemDefinition
  showHint: boolean
}

export function ProblemPanel({ problem, showHint }: ProblemPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h2 className="mb-3 text-base font-bold text-amber-600 dark:text-amber-400">
        Fix the Bug: {problem.title}
      </h2>

      {problem.contributor && (
        <ContributorCredit contributor={problem.contributor} origin={problem.origin} />
      )}

      <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-500/25 dark:bg-red-950/30">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400/90">
          Bug report
        </p>
        <p className="text-sm leading-relaxed text-app-fg-secondary">{problem.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-app-fg-subtle">
          Symptoms
        </h3>
        <ul className="space-y-1 text-sm text-app-fg-muted">
          {problem.symptoms.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-app-fg-subtle">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {problem.howToTest && problem.howToTest.length > 0 && (
        <div className="mb-4 rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 dark:border-teal-500/25 dark:bg-teal-950/25">
          <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400/90">
            How to see this bug
          </h3>
          <ul className="space-y-1 text-sm text-app-fg-secondary">
            {problem.howToTest.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="shrink-0 text-teal-600 dark:text-teal-500/70">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-app-fg-subtle">
          Your task
        </h3>
        <ul className="space-y-1 text-sm text-app-fg-secondary">
          {problem.yourTask.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-500/60">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {showHint && (
        <div className="mt-3">
          <HintBox hint={problem.hint} />
        </div>
      )}
    </div>
  )
}
