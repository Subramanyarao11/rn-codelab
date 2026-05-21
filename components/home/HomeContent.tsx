'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bug, Check, ChevronRight, Github, GitPullRequest, Sparkles } from 'lucide-react'
import { GITHUB_REPO_URL } from '@/lib/github'
import { PROBLEMS, TOTAL_PROBLEMS } from '@/lib/problems'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion'

export function HomeContent() {
  const progress = useStore((s) => s.progress)
  const completedCount = PROBLEMS.filter((p) => progress[p.id]?.completed).length
  const firstOpen = PROBLEMS.find((p) => !progress[p.id]?.completed) ?? PROBLEMS[0]
  const progressPct = (completedCount / TOTAL_PROBLEMS) * 100

  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-950">
      <motion.header
        className="border-b border-zinc-800/90 bg-[#0c0c0e]/80"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
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
          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="View source on GitHub"
              aria-label="View source on GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-colors hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-200"
            >
              <Github className="h-4 w-4" />
            </a>
            <Link
              href="/contribute"
              className="hidden h-8 items-center rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 text-xs font-medium text-teal-300 transition-colors hover:border-teal-500/50 hover:bg-teal-500/15 sm:inline-flex"
            >
              Contribute
            </Link>
            <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
              <span className="text-xs text-zinc-500">Progress</span>
              <span className="text-sm font-bold tabular-nums text-amber-400">
                {completedCount}
                <span className="font-normal text-zinc-600"> / {TOTAL_PROBLEMS}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <motion.div className="mb-10" {...fadeInUp}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
            Fix the Bug
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-50">
            Broken React Native code.
            <br />
            <span className="text-zinc-500">Find it. Fix it. Pass the tests.</span>
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Hands-on debugging labs — edit real RN code in the browser, preview live, and validate
            your fix with automated tests. Inspired by{' '}
            <a
              href="https://react.chaicode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-300 hover:decoration-zinc-500"
            >
              Chai reactLabs
            </a>
            .
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={`/problems/${firstOpen.id}`}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
            >
              {completedCount === 0 ? 'Start first challenge' : 'Continue learning'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <div className="mb-2 flex justify-between text-xs text-zinc-500">
            <span>Challenges completed</span>
            <span>
              {completedCount} of {TOTAL_PROBLEMS}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        <motion.section
          className="relative mb-10 overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-950/40 via-zinc-900/80 to-zinc-900/60 p-6 sm:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2 text-teal-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                  Open source
                </span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-zinc-50">
                Got a real RN bug worth teaching?
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Submit a challenge — no git required. We review every proposal and credit accepted
                authors on the challenge page.
              </p>
            </div>
            <div className="w-full rounded-xl border border-teal-500/15 bg-zinc-950/50 p-4 sm:w-auto sm:min-w-[240px]">
              <Link
                href="/contribute/submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-teal-400"
              >
                Submit a challenge
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
              <div className="my-3 border-t border-zinc-800/80" />
              <Link
                href="/contribute"
                className="flex w-full items-center justify-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-teal-300"
              >
                <GitPullRequest className="h-3.5 w-3.5 shrink-0" />
                Or open a pull request
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 sm:items-stretch"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {PROBLEMS.map((problem) => {
            const isComplete = progress[problem.id]?.completed

            return (
              <motion.div key={problem.id} variants={staggerItem} className="min-w-0">
                <Link
                  href={`/problems/${problem.id}`}
                  className={cn(
                    'group relative flex h-full min-h-[168px] flex-col rounded-xl border bg-zinc-900/60 p-5 transition-colors',
                    isComplete
                      ? 'border-green-500/20 hover:border-green-500/40'
                      : 'border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-900'
                  )}
                >
                  <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
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

                  <h2 className="mb-1 shrink-0 font-semibold text-zinc-50 group-hover:text-amber-100">
                    {problem.title}
                  </h2>
                  <p className="mb-4 min-h-[2.5rem] flex-1 text-sm leading-snug text-zinc-500">
                    {problem.subtitle}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5">
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
              </motion.div>
            )
          })}
        </motion.div>
      </main>
    </div>
  )
}
