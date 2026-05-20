import type { ProblemDefinition, ProblemProgress } from './types'

/** Saved solution text must never become the default editor draft. */
export function isPersistedSolution(
  saved: string | null | undefined,
  problem: ProblemDefinition
): boolean {
  if (!saved) return false
  return saved === problem.solutionCode
}

/** React 19 crashes when useEffect callback is async (returns a Promise, not cleanup). */
export function hasCrashyAsyncEffect(saved: string | null | undefined): boolean {
  if (!saved) return false
  return /useEffect\s*\(\s*async\b/.test(saved)
}

export function shouldDiscardSavedCode(
  saved: string | null | undefined,
  problem: ProblemDefinition
): boolean {
  if (!saved) return false
  return isPersistedSolution(saved, problem) || hasCrashyAsyncEffect(saved)
}

export function resolveWorkspaceCode(
  problem: ProblemDefinition,
  progress?: ProblemProgress | null
): string {
  const saved = progress?.userCode
  if (!saved || shouldDiscardSavedCode(saved, problem)) {
    return problem.brokenCode
  }
  return saved
}
