'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Difficulty } from '@/lib/types'
import { GITHUB_REPO, githubIssueNewUrl } from '@/lib/github'
import {
  EMPTY_SUBMISSION,
  buildSubmissionIssueBody,
  buildSubmissionIssueTitle,
  validateSubmission,
  type ProblemSubmission,
} from '@/lib/submission'
import { SUBMISSION_LIMITS } from '@/lib/codeSandbox'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/cn'

function Field({
  label,
  hint,
  error,
  alignHintRow = false,
  children,
}: {
  label: string
  hint?: string
  error?: string
  /** Keeps a hint line so inputs align in side-by-side grids */
  alignHintRow?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-app-fg-secondary">{label}</span>
      {(alignHintRow || hint) && (
        <span className="mb-1.5 block min-h-4 text-[11px] leading-4 text-app-fg-subtle">
          {hint ?? '\u00A0'}
        </span>
      )}
      {children}
      {error && <span className="mt-1 block text-[11px] text-red-400">{error}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-app-input-border bg-app-input px-3 py-2 text-sm text-app-fg placeholder:text-app-fg-subtle focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30'

const textareaClass = cn(inputClass, 'min-h-[88px] resize-y font-mono text-[13px] leading-relaxed')

export function SubmitProblemForm() {
  const [form, setForm] = useState<ProblemSubmission>(EMPTY_SUBMISSION)
  const [errors, setErrors] = useState<Partial<Record<keyof ProblemSubmission, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'fallback'>('idle')
  const [issueUrl, setIssueUrl] = useState<string | null>(null)

  const patch = (key: keyof ProblemSubmission, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const openGithubIssueFallback = (data: ProblemSubmission) => {
    analytics.submissionSent('github_fallback', data.difficulty)
    const title = buildSubmissionIssueTitle(data)
    const body = buildSubmissionIssueBody(data)
    const url = githubIssueNewUrl({ title, body, labels: ['problem-submission'] })
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('fallback')
    setIssueUrl(url)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validation = validateSubmission(form)
    if (!validation.ok) {
      setErrors(validation.errors)
      return
    }

    setStatus('loading')
    setIssueUrl(null)

    try {
      const res = await fetch('/api/submit-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = (await res.json()) as {
        issueUrl?: string
        configured?: boolean
        error?: string
        fields?: Partial<Record<keyof ProblemSubmission, string>>
      }

      if (res.ok && data.issueUrl) {
        analytics.submissionSent('api', form.difficulty)
        setStatus('success')
        setIssueUrl(data.issueUrl)
        return
      }

      if (res.status === 400 && 'fields' in data && data.fields) {
        setErrors(data.fields as Partial<Record<keyof ProblemSubmission, string>>)
        setStatus('idle')
        return
      }

      if (res.status === 413) {
        setErrors({ brokenCode: 'Submission is too large. Shorten code blocks and try again.' })
        setStatus('idle')
        return
      }

      // API not configured — fall back to opening GitHub issue (already validated client-side)
      if (res.status === 503) {
        openGithubIssueFallback(form)
        setStatus('fallback')
        return
      }

      setErrors({ title: data.error ?? 'Submission failed. Please try again.' })
      setStatus('idle')
    } catch {
      openGithubIssueFallback(form)
      setStatus('fallback')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => patch('website', e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="rounded-lg border border-app-input-border bg-app-surface-muted px-4 py-3 text-xs leading-relaxed text-app-fg-muted">
        <p className="mb-1 font-medium text-app-fg-secondary">Submission guidelines</p>
        <ul className="list-inside list-disc space-y-0.5 text-app-fg-subtle">
          <li>React Native challenge code only — must export an <code className="text-app-fg-muted">App</code> component</li>
          <li>No network, DOM, eval, dynamic imports, or storage access</li>
          <li>Max {SUBMISSION_LIMITS.MAX_CODE_CHARS.toLocaleString()} characters per code block</li>
          <li>Plain text only in descriptions (no HTML tags)</li>
        </ul>
      </div>

      {Object.keys(errors).length > 0 && status === 'idle' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/25 dark:text-red-300">
          Fix the highlighted fields before submitting.
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-app-border bg-app-surface-elevated p-5">
        <h2 className="text-sm font-semibold text-app-fg-secondary">About you</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name *" alignHintRow error={errors.contributorName}>
            <input
              className={inputClass}
              value={form.contributorName}
              onChange={(e) => patch('contributorName', e.target.value)}
              placeholder="Jane Developer"
            />
          </Field>
          <Field
            label="GitHub username"
            hint="Shown on the challenge if accepted"
            alignHintRow
            error={errors.contributorGithub}
          >
            <input
              className={inputClass}
              value={form.contributorGithub}
              onChange={(e) => patch('contributorGithub', e.target.value)}
              placeholder="janedev"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-app-border bg-app-surface-elevated p-5">
        <h2 className="text-sm font-semibold text-app-fg-secondary">Challenge</h2>
        <Field label="Title *" error={errors.title}>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => patch('title', e.target.value)}
            placeholder="The Ghost TextInput"
          />
        </Field>
        <Field label="Subtitle *" error={errors.subtitle}>
          <input
            className={inputClass}
            value={form.subtitle}
            onChange={(e) => patch('subtitle', e.target.value)}
            placeholder="Typed text is invisible on a white background."
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Difficulty *" alignHintRow error={errors.difficulty}>
            <select
              className={inputClass}
              value={form.difficulty}
              onChange={(e) => patch('difficulty', e.target.value as Difficulty)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Tags" hint="Comma-separated" alignHintRow error={errors.tags}>
            <input
              className={inputClass}
              value={form.tags}
              onChange={(e) => patch('tags', e.target.value)}
              placeholder="TextInput, styling"
            />
          </Field>
        </div>
        <Field label="Bug report *" error={errors.description}>
          <textarea
            className={textareaClass}
            value={form.description}
            onChange={(e) => patch('description', e.target.value)}
            placeholder="What is broken from the user's perspective?"
          />
        </Field>
        <Field label="Symptoms *" hint="One per line" error={errors.symptoms}>
          <textarea
            className={textareaClass}
            value={form.symptoms}
            onChange={(e) => patch('symptoms', e.target.value)}
            placeholder="Text looks blank while typing&#10;Placeholder is visible"
          />
        </Field>
        <Field label="Learner tasks *" hint="One per line" error={errors.yourTask}>
          <textarea
            className={textareaClass}
            value={form.yourTask}
            onChange={(e) => patch('yourTask', e.target.value)}
            placeholder="Fix input text color&#10;Text must remain readable on white"
          />
        </Field>
        <Field label="Hint *" error={errors.hint}>
          <textarea
            className={cn(textareaClass, 'min-h-[64px]')}
            value={form.hint}
            onChange={(e) => patch('hint', e.target.value)}
            placeholder="A nudge without giving away the full fix"
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-xl border border-app-border bg-app-surface-elevated p-5">
        <h2 className="text-sm font-semibold text-app-fg-secondary">Code</h2>
        <p className="text-[11px] leading-relaxed text-app-fg-subtle">
          Use only React Native APIs available in the lab preview (View, Text, hooks, etc.). Imports
          from <code className="text-app-fg-muted">react</code> and{' '}
          <code className="text-app-fg-muted">react-native</code> are stripped automatically.
        </p>
        <Field label="Broken starter code *" error={errors.brokenCode}>
          <textarea
            className={cn(textareaClass, 'min-h-[200px]')}
            value={form.brokenCode}
            onChange={(e) => patch('brokenCode', e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="Solution code *" error={errors.solutionCode}>
          <textarea
            className={cn(textareaClass, 'min-h-[200px]')}
            value={form.solutionCode}
            onChange={(e) => patch('solutionCode', e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field
          label="Test notes *"
          hint="Describe what automated tests should check — maintainers convert these to testCases"
          error={errors.testNotes}
        >
          <textarea
            className={textareaClass}
            value={form.testNotes}
            onChange={(e) => patch('testNotes', e.target.value)}
            placeholder="e.g. testID email-input exists; typing updates displayed value; submit button pressable"
          />
        </Field>
      </section>

      {status === 'success' && issueUrl && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-300">
          Submission received!{' '}
          <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Track issue #{issueUrl.split('/').pop()}
          </a>
          . We will review and reply on GitHub.
        </div>
      )}

      {status === 'fallback' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
          Opened a pre-filled GitHub issue in a new tab on{' '}
          <span className="font-medium">{GITHUB_REPO}</span>. Submit it there to enter the review
          queue.
          {issueUrl && (
            <>
              {' '}
              <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Re-open link
              </a>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Submit for review'}
        </Button>
        <Link
          href="/contribute"
          className="text-xs text-app-fg-subtle transition-colors hover:text-app-fg-secondary"
        >
          ← Back
        </Link>
      </div>
    </form>
  )
}
