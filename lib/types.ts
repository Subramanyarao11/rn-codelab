export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type TestStatus = 'pending' | 'pass' | 'fail' | 'running'

export type TestType = 'dom_text' | 'dom_exists' | 'interaction' | 'no_crash'

export type EditorThemeId =
  | 'vs-dark'
  | 'vs-light'
  | 'hc-black'
  | 'rn-labs-dark'
  | 'rn-labs-light'
  | 'dracula'
  | 'github-dark'
  | 'one-dark'
  | 'nord'
  | 'night-owl'
  | 'monokai'
  | 'cobalt'
  | 'solarized-dark'
  | 'solarized-light'
  | 'ayu-dark'
  | 'tomorrow-night'

export interface EditorSettings {
  theme: EditorThemeId
  fontSize: number
  minimap: boolean
  wordWrap: boolean
}

export interface TestCase {
  id: string
  description: string
  type: TestType
  selector?: string
  selectors?: string[]
  expectedText?: string
  action?: 'press' | 'type'
  actionTarget?: string
  actionValue?: string
  /** Seed AsyncStorage before render (key → value) */
  storageSeed?: Record<string, string>
  status: TestStatus
}

export interface ProblemDefinition {
  id: number
  slug: string
  title: string
  subtitle: string
  difficulty: Difficulty
  tags: string[]
  description: string
  symptoms: string[]
  yourTask: string[]
  hint: string
  /** Optional steps for reproducing the bug in preview / on device */
  howToTest?: string[]
  brokenCode: string
  solutionCode: string
  testCases: Omit<TestCase, 'status'>[]
}

export interface ProblemProgress {
  completed: boolean
  solutionViewed: boolean
  userCode: string | null
}

export interface AppStore {
  progress: Record<number, ProblemProgress>
  editor: EditorSettings
  markComplete: (id: number) => void
  markSolutionViewed: (id: number) => void
  saveCode: (id: number, code: string) => void
  resetProblem: (id: number) => void
  clearSavedCode: (id: number) => void
  setEditorSettings: (patch: Partial<EditorSettings>) => void
}
