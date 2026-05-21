import type { Difficulty } from '@/lib/types'
import {
  SUBMISSION_LIMITS,
  validateChallengeCode,
  validateContributorName,
  validateGithubUsername,
  validatePlainText,
  validateTags,
} from '@/lib/codeSandbox'

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

const VALID_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced']

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

  if (input.website?.trim()) {
    errors.website = 'Invalid submission'
    return { ok: false, errors }
  }

  const nameErr = validateContributorName(input.contributorName)
  if (nameErr) errors.contributorName = nameErr

  const ghErr = validateGithubUsername(input.contributorGithub)
  if (ghErr) errors.contributorGithub = ghErr

  const titleErr = validatePlainText(input.title, 'Title', SUBMISSION_LIMITS.MAX_TITLE_CHARS)
  if (titleErr) errors.title = titleErr

  const subtitleErr = validatePlainText(
    input.subtitle,
    'Subtitle',
    SUBMISSION_LIMITS.MAX_SUBTITLE_CHARS
  )
  if (subtitleErr) errors.subtitle = subtitleErr

  if (!VALID_DIFFICULTIES.includes(input.difficulty)) {
    errors.difficulty = 'Select a valid difficulty'
  }

  const tagsErr = validateTags(input.tags)
  if (tagsErr) errors.tags = tagsErr

  const descErr = validatePlainText(
    input.description,
    'Bug report',
    SUBMISSION_LIMITS.MAX_TEXT_CHARS,
    { allowNewlines: true }
  )
  if (descErr) errors.description = descErr

  const symptomsErr = validatePlainText(
    input.symptoms,
    'Symptoms',
    SUBMISSION_LIMITS.MAX_TEXT_CHARS,
    { allowNewlines: true }
  )
  if (symptomsErr) errors.symptoms = symptomsErr
  else if (linesToList(input.symptoms).length === 0) {
    errors.symptoms = 'Add at least one symptom (one per line)'
  }

  const taskErr = validatePlainText(input.yourTask, 'Tasks', SUBMISSION_LIMITS.MAX_TEXT_CHARS, {
    allowNewlines: true,
  })
  if (taskErr) errors.yourTask = taskErr
  else if (linesToList(input.yourTask).length === 0) {
    errors.yourTask = 'Add at least one task (one per line)'
  }

  const hintErr = validatePlainText(input.hint, 'Hint', SUBMISSION_LIMITS.MAX_TEXT_CHARS, {
    allowNewlines: true,
  })
  if (hintErr) errors.hint = hintErr

  const testErr = validatePlainText(input.testNotes, 'Test notes', SUBMISSION_LIMITS.MAX_TEXT_CHARS, {
    allowNewlines: true,
  })
  if (testErr) errors.testNotes = testErr

  const brokenErr = validateChallengeCode(input.brokenCode, 'Broken code')
  if (brokenErr) errors.brokenCode = brokenErr

  const solutionErr = validateChallengeCode(input.solutionCode, 'Solution code')
  if (solutionErr) errors.solutionCode = solutionErr

  if (
    !errors.brokenCode &&
    !errors.solutionCode &&
    input.brokenCode.trim() === input.solutionCode.trim()
  ) {
    errors.solutionCode = 'Solution must differ from broken code'
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
    '_Submitted via RN Debug Labs — maintainers: review in an isolated preview, then accept via PR or add to `lib/community-problems/`._',
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
    '- [ ] Automated security scan passed at submission time',
    '- [ ] Reproduces in preview',
    '- [ ] Tests pass on solution only',
    '- [ ] Broken starter fails tests',
    '- [ ] Add `contributor` credit if accepted',
  ].join('\n')
}

export function buildSubmissionIssueTitle(input: ProblemSubmission): string {
  const title = input.title.trim().slice(0, SUBMISSION_LIMITS.MAX_TITLE_CHARS)
  return `[Problem] ${title}`
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
