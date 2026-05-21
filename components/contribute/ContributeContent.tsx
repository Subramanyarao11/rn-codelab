'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bug, ChevronRight, GitPullRequest, Send } from 'lucide-react'
import { GITHUB_REPO, GITHUB_REPO_URL } from '@/lib/github'
import { fadeInUp } from '@/lib/motion'

export function ContributeContent() {
  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-950">
      <header className="border-b border-zinc-800/90 bg-[#0c0c0e]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-teal-500/20 ring-1 ring-amber-500/20">
              <Bug className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-zinc-50">RN Debug Labs</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to challenges
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <motion.div {...fadeInUp}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
            Open source
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-50">
            Contribute a challenge
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            RN Debug Labs is open for community challenges. Share a real React Native bug you have
            seen in the wild — we review every submission and credit accepted authors on the
            challenge page.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <motion.div
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Send className="h-4 w-4" />
            </div>
            <h2 className="mb-1 font-semibold text-zinc-100">Submit for review</h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-500">
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
              <GitPullRequest className="h-4 w-4" />
            </div>
            <h2 className="mb-1 font-semibold text-zinc-100">Pull request</h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-500">
              Comfortable with git? Add a challenge directly under{' '}
              <code className="text-zinc-400">lib/community-problems/</code> and open a PR on{' '}
              <span className="text-zinc-400">{GITHUB_REPO}</span>.
            </p>
            <a
              href={`${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-xs font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60"
            >
              Read CONTRIBUTING.md
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5">
          <h2 className="mb-3 text-sm font-semibold text-zinc-200">What happens after you submit?</h2>
          <ol className="space-y-2 text-sm text-zinc-400">
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-500/80">1.</span>
              <span>Maintainers reproduce the bug in the lab preview and draft automated tests.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-500/80">2.</span>
              <span>We comment on the issue — accepted, needs changes, or declined (with reason).</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-bold text-amber-500/80">3.</span>
              <span>
                Accepted challenges ship with your name (and optional GitHub link) on the problem
                panel as <strong className="font-medium text-zinc-300">Community challenge</strong>.
              </span>
            </li>
          </ol>
        </section>
      </main>
    </div>
  )
}
