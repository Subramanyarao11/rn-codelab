import type { Difficulty } from '@/lib/types'

export interface ProblemSubmission {
  contributorName: string
  contributorGithub: string
  title: string
  subtitle: string
  difficulty: Difficulty
  tags: string
  description: string
  symptoms: string
  yourTask: string
  hint: string
  brokenCode: string
  solutionCode: string
  testNotes: string
  /** Honeypot — must stay empty */
  website?: string
}

export interface SubmissionValidationResult {
  ok: boolean
  errors: Partial<Record<keyof ProblemSubmission, string>>
}

export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export function tagsToList(text: string): string[] {
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

export function validateSubmission(input: ProblemSubmission): SubmissionValidationResult {
  const errors: SubmissionValidationResult['errors'] = {}

  if (!input.contributorName.trim()) errors.contributorName = 'Name is required'
  if (!input.title.trim()) errors.title = 'Title is required'
  if (!input.subtitle.trim()) errors.subtitle = 'Subtitle is required'
  if (!input.description.trim()) errors.description = 'Bug report is required'
  if (!input.symptoms.trim()) errors.symptoms = 'Add at least one symptom (one per line)'
  if (!input.yourTask.trim()) errors.yourTask = 'Add at least one task (one per line)'
  if (!input.hint.trim()) errors.hint = 'Hint is required'
  if (!input.brokenCode.trim()) errors.brokenCode = 'Broken starter code is required'
  if (!input.solutionCode.trim()) errors.solutionCode = 'Solution code is required'
  if (!input.testNotes.trim()) errors.testNotes = 'Describe what tests should verify'

  if (input.brokenCode.trim() === input.solutionCode.trim()) {
    errors.solutionCode = 'Solution must differ from broken code'
  }

  if (input.website?.trim()) {
    errors.website = 'Invalid submission'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}

export function buildSubmissionIssueBody(input: ProblemSubmission): string {
  const slug = slugifyTitle(input.title)
  const tags = tagsToList(input.tags)
  const symptoms = linesToList(input.symptoms)
  const tasks = linesToList(input.yourTask)
  const gh = input.contributorGithub.trim().replace(/^@/, '')

  return [
    '## Problem submission',
    '',
    '_Submitted via RN Debug Labs — maintainers: review, test in workspace, then accept via PR or add to `lib/community-problems/`._',
    '',
    '### Contributor',
    `- **Name:** ${input.contributorName.trim()}`,
    gh ? `- **GitHub:** @${gh}` : '- **GitHub:** _(not provided)_',
    '',
    '### Challenge metadata',
    `- **Title:** ${input.title.trim()}`,
    `- **Subtitle:** ${input.subtitle.trim()}`,
    `- **Suggested slug:** \`${slug}\``,
    `- **Difficulty:** ${input.difficulty}`,
    `- **Tags:** ${tags.length ? tags.join(', ') : '_(none)_'}`,
    '',
    '### Bug report',
    input.description.trim(),
    '',
    '### Symptoms',
    ...symptoms.map((s) => `- ${s}`),
    '',
    '### Learner tasks',
    ...tasks.map((t) => `- ${t}`),
    '',
    '### Hint',
    input.hint.trim(),
    '',
    '### Test notes (maintainer converts to testCases)',
    input.testNotes.trim(),
    '',
    '### Broken code',
    '```tsx',
    input.brokenCode.trim(),
    '```',
    '',
    '### Solution code',
    '```tsx',
    input.solutionCode.trim(),
    '```',
    '',
    '---',
    '**Maintainer checklist**',
    '- [ ] Reproduces in preview',
    '- [ ] Tests pass on solution only',
    '- [ ] Broken starter fails tests',
    '- [ ] Copy fits RN Debug Labs tone',
    '- [ ] Add `contributor` credit if accepted',
  ].join('\n')
}

export function buildSubmissionIssueTitle(input: ProblemSubmission): string {
  return `[Problem] ${input.title.trim()}`
}

export const EMPTY_SUBMISSION: ProblemSubmission = {
  contributorName: '',
  contributorGithub: '',
  title: '',
  subtitle: '',
  difficulty: 'intermediate',
  tags: '',
  description: '',
  symptoms: '',
  yourTask: '',
  hint: '',
  brokenCode: '',
  solutionCode: '',
  testNotes: '',
  website: '',
}
