'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bug, ChevronRight, GitPullRequest, Send } from 'lucide-react'
import { GITHUB_REPO, GITHUB_REPO_URL } from '@/lib/github'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { fadeInUp } from '@/lib/motion'

export function ContributeContent() {
  return (
    <div className="min-h-screen overflow-y-auto bg-app-bg">
      <header className="border-b border-app-border bg-app-header">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-teal-500/20 ring-1 ring-amber-500/20">
              <Bug className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </div>
            <span className="text-sm font-bold text-app-fg">RN Debug Labs</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-app-fg-subtle transition-colors hover:text-app-fg-secondary"
            >
              ← Back to challenges
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <motion.div {...fadeInUp}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-500">
            Open source
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-app-fg">
            Contribute a challenge
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-app-fg-muted">
            RN Debug Labs is open for community challenges. Share a real React Native bug you have
            seen in the wild — we review every submission and credit accepted authors on the
            challenge page.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <motion.div
            className="rounded-xl border border-app-border bg-app-card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Send className="h-4 w-4" />
            </div>
            <h2 className="mb-1 font-semibold text-app-fg">Submit for review</h2>
            <p className="mb-4 text-sm leading-relaxed text-app-fg-subtle">
              No git required. Fill out the form — we open a GitHub issue for maintainers to
              review, accept, or request changes.
            </p>
            <Link
              href="/contribute/submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-400"
            >
              Submit a problem
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            className="rounded-xl border border-app-border bg-app-card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <GitPullRequest className="h-4 w-4" />
            </div>
            <h2 className="mb-1 font-semibold text-app-fg">Pull request</h2>
            <p className="mb-4 text-sm leading-relaxed text-app-fg-subtle">
              Comfortable with git? Add a challenge directly under{' '}
              <code className="text-app-fg-muted">lib/community-problems/</code> and open a PR on{' '}
              <span className="text-app-fg-muted">{GITHUB_REPO}</span>.
            </p>
            <a
              href={`${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-app-input-border px-3 text-xs font-medium text-app-fg-secondary hover:border-app-fg-subtle hover:bg-app-hover"
            >
              Read CONTRIBUTING.md
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        <section className="rounded-xl border border-app-border-subtle bg-app-surface-elevated p-5">
          <h2 className="mb-3 text-sm font-semibold text-app-fg-secondary">
            What happens after you submit?
          </h2>
          <ol className="space-y-2 text-sm text-app-fg-muted">
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-600 dark:text-amber-500/80">1.</span>
              <span>Maintainers reproduce the bug in the lab preview and draft automated tests.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-600 dark:text-amber-500/80">2.</span>
              <span>We comment on the issue — accepted, needs changes, or declined (with reason).</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-600 dark:text-amber-500/80">3.</span>
              <span>
                Accepted challenges ship with your name (and optional GitHub link) on the problem
                panel as <strong className="font-medium text-app-fg-secondary">Community challenge</strong>.
              </span>
            </li>
          </ol>
        </section>
      </main>
    </div>
  )
}
