import { track } from '@vercel/analytics'

type AnalyticsValue = string | number | boolean | null | undefined
type AnalyticsProps = Record<string, AnalyticsValue>

/** Fire-and-forget custom event — never throws. */
export function trackEvent(name: string, props?: AnalyticsProps) {
  try {
    track(name, props)
  } catch {
    // Analytics must not affect UX
  }
}

export const analytics = {
  challengeComplete(problemId: number) {
    trackEvent('challenge_complete', { problem_id: problemId })
  },

  testsChecked(problemId: number, passed: boolean, passCount: number, total: number) {
    trackEvent('tests_checked', {
      problem_id: problemId,
      passed,
      pass_count: passCount,
      total,
    })
  },

  solutionVerified(problemId: number) {
    trackEvent('solution_verified', { problem_id: problemId })
  },

  solutionViewed(problemId: number) {
    trackEvent('solution_viewed', { problem_id: problemId })
  },

  codeReset(problemId: number) {
    trackEvent('code_reset', { problem_id: problemId })
  },

  previewRun(problemId: number) {
    trackEvent('preview_run', { problem_id: problemId })
  },

  snackOpened(problemId: number, platform: string) {
    trackEvent('snack_opened', { problem_id: problemId, platform })
  },

  hintToggled(problemId: number, visible: boolean) {
    trackEvent('hint_toggled', { problem_id: problemId, visible })
  },

  tourCompleted(steps: number) {
    trackEvent('tour_completed', { steps })
  },

  tourSkipped(step: number, totalSteps: number) {
    trackEvent('tour_skipped', { step, total_steps: totalSteps })
  },

  tourReopened() {
    trackEvent('tour_reopened')
  },

  submissionSent(method: 'api' | 'github_fallback', difficulty: string) {
    trackEvent('submission_sent', { method, difficulty })
  },

  themeChanged(theme: 'light' | 'dark') {
    trackEvent('theme_changed', { theme })
  },
}
