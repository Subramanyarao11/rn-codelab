import { Bug, Laptop } from 'lucide-react'

export function MobileBlocker() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-teal-500/15 ring-1 ring-amber-500/30">
        <Bug className="h-8 w-8 text-amber-400" strokeWidth={1.75} />
      </div>

      <h1 className="mb-8 text-2xl font-bold tracking-tight">
        <span className="text-amber-500">RN Debug</span>
        <span className="text-white"> Labs</span>
      </h1>

      <Laptop className="mb-8 h-20 w-20 text-zinc-500" strokeWidth={1.25} />

      <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
        This interactive coding lab is best experienced on a desktop or laptop. Please switch to a
        larger screen to get started.
      </p>
    </div>
  )
}
