import { NextResponse } from 'next/server'
import {
  buildSubmissionIssueBody,
  buildSubmissionIssueTitle,
  validateSubmission,
  type ProblemSubmission,
} from '@/lib/submission'

const REPO = process.env.GITHUB_REPO ?? process.env.NEXT_PUBLIC_GITHUB_REPO
const TOKEN = process.env.GITHUB_TOKEN

export async function POST(request: Request) {
  if (!TOKEN || !REPO) {
    return NextResponse.json(
      {
        error:
          'Server-side submissions are not configured. Use the GitHub issue link instead.',
        configured: false,
      },
      { status: 503 }
    )
  }

  let body: ProblemSubmission
  try {
    const raw = await request.text()
    if (raw.length > 120_000) {
      return NextResponse.json({ error: 'Submission payload too large' }, { status: 413 })
    }
    body = JSON.parse(raw) as ProblemSubmission
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validation = validateSubmission(body)
  if (!validation.ok) {
    return NextResponse.json({ error: 'Validation failed', fields: validation.errors }, { status: 400 })
  }

  const [owner, repo] = REPO.split('/')
  if (!owner || !repo) {
    return NextResponse.json({ error: 'Invalid GITHUB_REPO format' }, { status: 500 })
  }

  const title = buildSubmissionIssueTitle(body)
  const issueBody = buildSubmissionIssueBody(body)

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title,
      body: issueBody,
      labels: ['problem-submission'],
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json(
      { error: 'Failed to create GitHub issue', detail: detail.slice(0, 500) },
      { status: 502 }
    )
  }

  const issue = (await res.json()) as { html_url: string; number: number }
  return NextResponse.json({
    configured: true,
    issueUrl: issue.html_url,
    issueNumber: issue.number,
  })
}
