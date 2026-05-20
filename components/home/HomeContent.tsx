'use client'

import Link from 'next/link'
import { Bug, Check, ChevronRight } from 'lucide-react'
import { PROBLEMS, TOTAL_PROBLEMS } from '@/lib/problems'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

export function HomeContent() {
  const progress = useStore((s) => s.progress)
  const completedCount = PROBLEMS.filter((p) => progress[p.id]?.completed).length
  const firstOpen = PROBLEMS.find((p) => !progress[p.id]?.completed) ?? PROBLEMS[0]

  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/90 bg-[#0c0c0e]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/30 to-teal-500/20 ring-1 ring-amber-500/25">
              <Bug className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <span className="text-lg font-bold text-zinc-50">RN Debug Labs</span>
              <p className="text-xs text-zinc-500">React Native bug-fixing challenges</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
            <span className="text-xs text-zinc-500">Progress</span>
            <span className="text-sm font-bold tabular-nums text-amber-400">
              {completedCount}
              <span className="font-normal text-zinc-600"> / {TOTAL_PROBLEMS}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
            Fix the Bug
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-50">
            Broken React Native code.
            <br />
            <span className="text-zinc-500">Find it. Fix it. Pass the tests.</span>
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Hands-on debugging labs inspired by interactive React courses. Edit real RN code in the
            browser, preview with Expo Snack, and validate your fix with automated tests.
          </p>
          <Link
            href={`/problems/${firstOpen.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
          >
            {completedCount === 0 ? 'Start first challenge' : 'Continue learning'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-zinc-500">
            <span>Challenges completed</span>
            <span>
              {completedCount} of {TOTAL_PROBLEMS}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(completedCount / TOTAL_PROBLEMS) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenge grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((problem) => {
            const isComplete = progress[problem.id]?.completed

            return (
              <Link
                key={problem.id}
                href={`/problems/${problem.id}`}
                className={cn(
                  'group relative rounded-xl border bg-zinc-900/60 p-5 transition-all',
                  isComplete
                    ? 'border-green-500/20 hover:border-green-500/40'
                    : 'border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-900'
                )}
              >
                <div className="mb-3 flex items-start justify-between">
                  {isComplete ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
                      <Check className="h-3.5 w-3.5 text-green-400" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold tabular-nums text-zinc-500 group-hover:bg-amber-500/15 group-hover:text-amber-400">
                      {problem.id}
                    </span>
                  )}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      isComplete
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-zinc-800 text-zinc-500'
                    )}
                  >
                    {isComplete ? 'Fixed' : `FTB #${problem.id}`}
                  </span>
                </div>

                <h2 className="mb-1 font-semibold text-zinc-50 group-hover:text-amber-100">
                  {problem.title}
                </h2>
                <p className="mb-4 text-sm leading-snug text-zinc-500">{problem.subtitle}</p>

                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
