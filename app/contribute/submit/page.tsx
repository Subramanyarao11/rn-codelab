import type { Metadata } from 'next'
import Link from 'next/link'
import { SubmitProblemForm } from '@/components/contribute/SubmitProblemForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export const metadata: Metadata = {
  title: 'Submit a challenge',
  description:
    'Propose a new React Native debugging challenge for RN Debug Labs. Fill out the form and maintainers will review your submission on GitHub.',
  alternates: {
    canonical: '/contribute/submit',
  },
  openGraph: {
    title: 'Submit a challenge',
    description: 'Propose a new React Native debugging challenge for review.',
    url: '/contribute/submit',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SubmitProblemPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-app-bg">
      <header className="border-b border-app-border bg-app-header">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/contribute"
            className="text-xs text-app-fg-subtle hover:text-app-fg-secondary"
          >
            ← Contribute
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-app-fg">Submit a challenge</h1>
        <p className="mb-8 text-sm text-app-fg-subtle">
          All fields marked * are required. We review every submission on GitHub before publishing.
        </p>
        <SubmitProblemForm />
      </main>
    </div>
  )
}
