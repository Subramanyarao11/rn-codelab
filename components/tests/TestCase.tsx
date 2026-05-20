import type { TestCase as TestCaseType } from '@/lib/types'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

interface TestCaseRowProps {
  test: TestCaseType
}

export function TestCaseRow({ test }: TestCaseRowProps) {
  return (
    <li className="flex items-start gap-2 py-1.5 text-sm">
      <span className="mt-0.5 w-4 shrink-0 text-center">
        {test.status === 'pending' && <span className="text-zinc-600">○</span>}
        {test.status === 'running' && (
          <Loader2 className="inline h-3.5 w-3.5 animate-spin text-amber-400" />
        )}
        {test.status === 'pass' && <span className="text-green-400">✓</span>}
        {test.status === 'fail' && <span className="text-red-400">✗</span>}
      </span>
      <span
        className={cn(
          test.status === 'pass' && 'text-green-300',
          test.status === 'fail' && 'text-red-300',
          test.status === 'pending' && 'text-zinc-400',
          test.status === 'running' && 'text-zinc-300'
        )}
      >
        {test.description}
      </span>
    </li>
  )
}
