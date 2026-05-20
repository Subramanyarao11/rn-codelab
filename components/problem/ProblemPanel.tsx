'use client'

import type { ProblemDefinition } from '@/lib/types'
import { TagBadge } from './TagBadge'
import { HintBox } from './HintBox'

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

      <h2 className="mb-3 text-base font-bold text-amber-400">
        Fix the Bug: {problem.title}
      </h2>

      <div className="mb-4 rounded-md border border-red-500/25 bg-red-950/30 px-3 py-2.5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-400/90">
          Bug report
        </p>
        <p className="text-sm leading-relaxed text-zinc-300">{problem.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Symptoms
        </h3>
        <ul className="space-y-1 text-sm text-zinc-400">
          {problem.symptoms.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-zinc-600">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {problem.howToTest && problem.howToTest.length > 0 && (
        <div className="mb-4 rounded-md border border-teal-500/25 bg-teal-950/25 px-3 py-2.5">
          <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400/90">
            How to see this bug
          </h3>
          <ul className="space-y-1 text-sm text-zinc-300">
            {problem.howToTest.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="shrink-0 text-teal-500/70">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Your task
        </h3>
        <ul className="space-y-1 text-sm text-zinc-300">
          {problem.yourTask.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-amber-500/60">→</span>
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
