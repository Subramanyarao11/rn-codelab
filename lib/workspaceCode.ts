import type { ProblemDefinition, ProblemProgress } from './types'

/** Saved solution text must never become the default editor draft. */
export function isPersistedSolution(
  saved: string | null | undefined,
  problem: ProblemDefinition
): boolean {
  if (!saved) return false
  return saved === problem.solutionCode
}

export function resolveWorkspaceCode(
  problem: ProblemDefinition,
  progress?: ProblemProgress | null
): string {
  const saved = progress?.userCode
  if (!saved || isPersistedSolution(saved, problem)) {
    return problem.brokenCode
  }
  return saved
}
