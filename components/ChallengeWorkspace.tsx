'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProblemDefinition } from '@/lib/types'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { WorkspacePanels } from '@/components/layout/WorkspacePanels'
import { ProblemPanel } from '@/components/problem/ProblemPanel'
import { LocalPreview } from '@/components/preview/LocalPreview'
import { PreviewActions } from '@/components/preview/PreviewActions'
import { buildSnackUrl } from '@/lib/snack'
import { TestPanel } from '@/components/tests/TestPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { WorkspaceTour } from '@/components/onboarding/WorkspaceTour'
import { useStoreHydrated } from '@/hooks/useStoreHydrated'
import { useStore } from '@/lib/store'
import { shouldSimulateIosKeyboard, type PreviewPlatformOS } from '@/lib/previewPlatform'
import {
  hasCrashyAsyncEffect,
  isPersistedSolution,
  resolveWorkspaceCode,
  shouldDiscardSavedCode,
} from '@/lib/workspaceCode'

const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-app-editor-loading text-app-fg-subtle">
      Loading editor…
    </div>
  ),
})

interface ChallengeWorkspaceProps {
  problem: ProblemDefinition
}

export function ChallengeWorkspace({ problem }: ChallengeWorkspaceProps) {
  const storeHydrated = useStoreHydrated()
  const progress = useStore((s) => s.progress[problem.id])
  const saveCode = useStore((s) => s.saveCode)
  const resetProblem = useStore((s) => s.resetProblem)
  const clearSavedCode = useStore((s) => s.clearSavedCode)
  const markSolutionViewed = useStore((s) => s.markSolutionViewed)
  const onboardingComplete = useStore((s) => s.ui.onboardingComplete)
  const completeOnboarding = useStore((s) => s.completeOnboarding)

  const [code, setCode] = useState(() => resolveWorkspaceCode(problem, progress))
  const [tourOpen, setTourOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showingSolution, setShowingSolution] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatformOS>(() =>
    problem.id === 7 ? 'ios' : 'web'
  )
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showingSolutionRef = useRef(false)
  const skipPersistRef = useRef(false)
  const codeBeforeSolutionRef = useRef<string | null>(null)

  const setWorkspaceCode = useCallback((next: string, options?: { persist?: boolean }) => {
    if (options?.persist === false) {
      skipPersistRef.current = true
    }
    setCode(next)
  }, [])

  // Drop invalid drafts: saved solution, or React-19-crashy useEffect(async ...)
  useEffect(() => {
    if (!storeHydrated) return
    if (shouldDiscardSavedCode(progress?.userCode, problem)) {
      clearSavedCode(problem.id)
      if (hasCrashyAsyncEffect(progress?.userCode)) {
        setWorkspaceCode(problem.brokenCode, { persist: false })
      }
    }
  }, [storeHydrated, problem.id, problem.solutionCode, problem.brokenCode, progress?.userCode, clearSavedCode, problem, setWorkspaceCode])

  // Load draft only when switching problems or after localStorage rehydrates — not on every autosave
  useEffect(() => {
    if (!storeHydrated) return
    const saved = useStore.getState().progress[problem.id]
    setWorkspaceCode(resolveWorkspaceCode(problem, saved), { persist: false })
    showingSolutionRef.current = false
    setShowingSolution(false)
    setShowHint(false)
    setRunKey(0)
    setPreviewPlatform(problem.id === 7 ? 'ios' : 'web')
    codeBeforeSolutionRef.current = null
  }, [storeHydrated, problem.id, problem.brokenCode, problem.solutionCode, problem, setWorkspaceCode])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [problem.id])

  useEffect(() => {
    if (!storeHydrated || onboardingComplete) return
    const timer = window.setTimeout(() => setTourOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [storeHydrated, onboardingComplete])

  const handleTourFinish = () => {
    completeOnboarding()
    setTourOpen(false)
  }

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value)
      if (skipPersistRef.current) {
        skipPersistRef.current = false
        return
      }
      if (showingSolutionRef.current) return
      if (value === problem.solutionCode) return
      if (hasCrashyAsyncEffect(value)) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveCode(problem.id, value)
      }, 500)
    },
    [problem.id, problem.solutionCode, saveCode]
  )

  const handleReset = () => {
    resetProblem(problem.id)
    showingSolutionRef.current = false
    setShowingSolution(false)
    setWorkspaceCode(problem.brokenCode, { persist: false })
    setRunKey((k) => k + 1)
  }

  const handleShowSolution = () => {
    if (showingSolution) {
      showingSolutionRef.current = false
      setShowingSolution(false)
      const draft = codeBeforeSolutionRef.current
      codeBeforeSolutionRef.current = null
      const restored =
        draft != null && !isPersistedSolution(draft, problem)
          ? draft
          : resolveWorkspaceCode(problem, progress)
      setWorkspaceCode(restored, { persist: false })
    } else {
      markSolutionViewed(problem.id)
      codeBeforeSolutionRef.current = code
      showingSolutionRef.current = true
      setShowingSolution(true)
      setWorkspaceCode(problem.solutionCode, { persist: false })
    }
    setRunKey((k) => k + 1)
  }

  const handleRun = () => {
    setRunKey((k) => k + 1)
  }

  const handleOpenSnack = () => {
    const snackPlatform = problem.id === 7 ? previewPlatform : 'web'
    window.open(buildSnackUrl(code, snackPlatform), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-0 flex overflow-hidden bg-app-bg">
      <Sidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar
          problem={problem}
          showHint={showHint}
          onToggleHint={() => setShowHint((h) => !h)}
          onReset={handleReset}
          onShowSolution={handleShowSolution}
          showingSolution={showingSolution}
          onShowTour={() => setTourOpen(true)}
        />

        <AnimatePresence>
          {showingSolution && (
            <motion.div
              key="solution-banner"
              className="shrink-0 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              Solution loaded in editor and preview — click Check to verify all tests pass, then
              hide and fix it yourself
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-0 flex-1">
          <WorkspacePanels
            problemPanel={<ProblemPanel problem={problem} showHint={showHint} />}
            editorActions={<EditorToolbar />}
            editorPanel={
              <CodeEditor value={code} onChange={handleCodeChange} readOnly={false} />
            }
            previewPanel={
              <LocalPreview
                code={code}
                refreshKey={runKey}
                platformOS={problem.id === 7 ? previewPlatform : 'web'}
                simulateKeyboard={shouldSimulateIosKeyboard(problem.id, previewPlatform)}
              />
            }
            previewActions={
              <PreviewActions
                onRun={handleRun}
                onOpenSnack={handleOpenSnack}
                showPlatformPicker={problem.id === 7}
                platform={previewPlatform}
                onPlatformChange={setPreviewPlatform}
              />
            }
            testPanel={
              <TestPanel
                key={problem.id}
                problem={problem}
                code={code}
                showingSolution={showingSolution}
              />
            }
          />
        </div>
      </div>

      <WorkspaceTour
        open={tourOpen}
        onComplete={handleTourFinish}
        onSkip={handleTourFinish}
      />
    </div>
  )
}
