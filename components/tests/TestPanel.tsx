'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { TestCase as TestCaseType } from '@/lib/types'
import type { ProblemDefinition } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { ConfettiBurst } from '@/components/motion/ConfettiBurst'
import { TestCaseRow } from './TestCase'
import { runTests } from './useTestRunner'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'
import { fadeInUp, scaleIn } from '@/lib/motion'

interface TestPanelProps {
  problem: ProblemDefinition
  code: string
  showingSolution?: boolean
}

export function TestPanel({ problem, code, showingSolution = false }: TestPanelProps) {
  const markComplete = useStore((s) => s.markComplete)
  const [tests, setTests] = useState<TestCaseType[]>(() =>
    problem.testCases.map((tc) => ({ ...tc, status: 'pending' as const }))
  )
  const [running, setRunning] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setTests(problem.testCases.map((tc) => ({ ...tc, status: 'pending' as const })))
    setAllPassed(false)
    setError(null)
    setConfetti(false)
  }, [problem.id])

  const handleCheck = async () => {
    setRunning(true)
    setAllPassed(false)
    setError(null)
    setConfetti(false)
    setTests((prev) => prev.map((t) => ({ ...t, status: 'running' as const })))

    try {
      const { results, error: runError } = await runTests(code, problem.testCases)
      setTests(results)

      if (runError) {
        setError(runError)
        return
      }

      const passed = results.every((r) => r.status === 'pass')
      if (passed) {
        setAllPassed(true)
        if (!showingSolution) {
          markComplete(problem.id)
          setConfetti(true)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Test run failed'
      setError(message)
      setTests(problem.testCases.map((tc) => ({ ...tc, status: 'fail' as const })))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ConfettiBurst active={confetti} onDone={() => setConfetti(false)} />
      <div className="flex shrink-0 justify-end border-b border-zinc-800/50 px-3 py-1.5">
        <Button size="sm" variant="primary" onClick={handleCheck} disabled={running}>
          {running ? 'Checking…' : 'Check'}
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {showingSolution && (
          <p className="mb-2 text-xs text-zinc-500">
            Verifying tests against solution code (progress not saved until you fix it yourself).
          </p>
        )}
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.p
              key="error"
              className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
              {...fadeInUp}
            >
              {error}
            </motion.p>
          )}
          {allPassed && (
            <motion.p
              key="success"
              className={cn(
                'mb-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-400'
              )}
              {...scaleIn}
            >
              {showingSolution
                ? 'All tests passed with the solution — now try fixing the bug yourself!'
                : 'All tests passed! Challenge complete.'}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.ul layout>
          {tests.map((test) => (
            <TestCaseRow key={test.id} test={test} />
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
