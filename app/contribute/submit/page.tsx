import Link from 'next/link'
import { SubmitProblemForm } from '@/components/contribute/SubmitProblemForm'

export default function SubmitProblemPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-950">
      <header className="border-b border-zinc-800/90 bg-[#0c0c0e]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/contribute" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← Contribute
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-zinc-50">Submit a challenge</h1>
        <p className="mb-8 text-sm text-zinc-500">
          All fields marked * are required. We review every submission on GitHub before publishing.
        </p>
        <SubmitProblemForm />
      </main>
    </div>
  )
}
