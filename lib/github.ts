/** Public GitHub repo used for PRs and submission issues. Override via env in production. */
export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'Subramanyarao11/rn-codelab'

export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`

export function githubIssueNewUrl(params: { title: string; body: string; labels?: string[] }) {
  const base = `${GITHUB_REPO_URL}/issues/new`
  const search = new URLSearchParams()
  search.set('title', params.title)
  search.set('body', params.body)
  if (params.labels?.length) {
    search.set('labels', params.labels.join(','))
  }
  return `${base}?${search.toString()}`
}

export function githubProfileUrl(handle: string) {
  const clean = handle.replace(/^@/, '').trim()
  return `https://github.com/${clean}`
}
