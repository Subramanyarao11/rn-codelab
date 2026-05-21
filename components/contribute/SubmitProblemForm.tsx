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
import { Button } from '@/components/ui/Button'
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
      <span className="mb-1 block text-xs font-medium text-zinc-300">{label}</span>
      {(alignHintRow || hint) && (
        <span className="mb-1.5 block min-h-4 text-[11px] leading-4 text-zinc-600">
          {hint ?? '\u00A0'}
        </span>
      )}
      {children}
      {error && <span className="mt-1 block text-[11px] text-red-400">{error}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30'

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
      }

      if (res.ok && data.issueUrl) {
        setStatus('success')
        setIssueUrl(data.issueUrl)
        return
      }

      openGithubIssueFallback(form)
      setStatus('fallback')
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

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-200">About you</h2>
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

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-200">Challenge</h2>
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
          <Field label="Difficulty *" alignHintRow>
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
          <Field label="Tags" hint="Comma-separated" alignHintRow>
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

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-200">Code</h2>
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
        <div className="rounded-lg border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-300">
          Submission received!{' '}
          <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Track issue #{issueUrl.split('/').pop()}
          </a>
          . We will review and reply on GitHub.
        </div>
      )}

      {status === 'fallback' && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
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
          className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← Back
        </Link>
      </div>
    </form>
  )
}
