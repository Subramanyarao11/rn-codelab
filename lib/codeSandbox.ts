import { transform } from '@babel/standalone'

const MAX_CODE_CHARS = 24_000
const MAX_TEXT_CHARS = 2_000
const MAX_TITLE_CHARS = 120
const MAX_SUBTITLE_CHARS = 160
const MAX_NAME_CHARS = 80
const MAX_TAG_COUNT = 8
const MAX_TAG_CHARS = 32

type BlockRule = { pattern: RegExp; reason: string }

/** Patterns unsafe in code that runs via `new Function` in the preview sandbox. */
const BLOCKED_CODE_PATTERNS: BlockRule[] = [
  { pattern: /\beval\s*\(/i, reason: 'eval() is not allowed' },
  { pattern: /\bnew\s+Function\s*\(/i, reason: 'Dynamic Function() is not allowed' },
  { pattern: /\bFunction\s*\(\s*['"`]/i, reason: 'Function constructor is not allowed' },
  { pattern: /\bfetch\s*\(/i, reason: 'Network calls (fetch) are not allowed' },
  { pattern: /\bXMLHttpRequest\b/i, reason: 'XMLHttpRequest is not allowed' },
  { pattern: /\bWebSocket\b/i, reason: 'WebSocket is not allowed' },
  { pattern: /\bdocument\s*[.[]/i, reason: 'DOM access (document) is not allowed' },
  { pattern: /\bwindow\s*[.[]/i, reason: 'window access is not allowed' },
  { pattern: /\bglobalThis\s*[.[]/i, reason: 'globalThis is not allowed' },
  { pattern: /\blocalStorage\s*[.[]/i, reason: 'localStorage is not allowed' },
  { pattern: /\bsessionStorage\s*[.[]/i, reason: 'sessionStorage is not allowed' },
  {
    pattern: /\blocation\s*\.(?:href|assign|replace|reload|host)/i,
    reason: 'location navigation is not allowed',
  },
  { pattern: /\bnavigator\s*[.[]/i, reason: 'navigator is not allowed' },
  { pattern: /\bimport\s*\(/i, reason: 'Dynamic import() is not allowed' },
  { pattern: /\brequire\s*\(/i, reason: 'require() is not allowed' },
  { pattern: /__proto__|__defineGetter__|__defineSetter__/i, reason: 'Prototype tampering is not allowed' },
  {
    pattern: /\.constructor\s*\.\s*constructor/i,
    reason: 'Constructor-chain escapes are not allowed',
  },
  { pattern: /javascript\s*:/i, reason: 'javascript: URLs are not allowed' },
  { pattern: /<script[\s>]/i, reason: '<script> tags are not allowed' },
  { pattern: /\bon(click|error|load|mouse\w+)\s*=/i, reason: 'HTML inline event handlers are not allowed' },
  { pattern: /\bprocess\s*[.[]/i, reason: 'process access is not allowed' },
  { pattern: /\bchild_process\b/i, reason: 'child_process is not allowed' },
  { pattern: /\bfs\s*[.[]/i, reason: 'fs module access is not allowed' },
  { pattern: /data\s*:\s*text\/html/i, reason: 'data: HTML payloads are not allowed' },
]

const HTML_TAG = /<[^>]+>/

function prepareCode(code: string): string {
  return code
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/export\s+default\s+/g, '')
    .trim()
}

export function scanCodeForBlockedPatterns(code: string): string | null {
  for (const { pattern, reason } of BLOCKED_CODE_PATTERNS) {
    if (pattern.test(code)) return reason
  }
  return null
}

export function assertAppComponent(code: string): string | null {
  const hasApp =
    /export\s+default\s+function\s+App\b/.test(code) ||
    /export\s+default\s+App\b/.test(code) ||
    /function\s+App\s*\(/.test(code) ||
    /const\s+App\s*=/.test(code)

  if (!hasApp) {
    return 'Code must define an App component (e.g. export default function App() { ... })'
  }
  return null
}

export function assertCodeTranspilable(code: string): string | null {
  const prepared = prepareCode(code)
  if (!prepared) return 'Code is empty after removing imports'

  try {
    const { code: output } = transform(prepared, {
      presets: [['react', { runtime: 'classic' }]],
      filename: 'App.jsx',
    })
    if (!output) return 'Could not parse JSX — check syntax'
  } catch (err) {
    const message = err instanceof Error ? err.message.split('\n')[0] : 'Invalid JSX'
    return `Invalid JSX: ${message}`
  }
  return null
}

export function validateChallengeCode(code: string, label: string): string | null {
  const trimmed = code.trim()
  if (!trimmed) return `${label} is required`
  if (trimmed.length > MAX_CODE_CHARS) {
    return `${label} must be under ${MAX_CODE_CHARS.toLocaleString()} characters`
  }

  const blocked = scanCodeForBlockedPatterns(trimmed)
  if (blocked) return `${label}: ${blocked}`

  const app = assertAppComponent(trimmed)
  if (app) return `${label}: ${app}`

  const transpile = assertCodeTranspilable(trimmed)
  if (transpile) return `${label}: ${transpile}`

  return null
}

export function validatePlainText(
  value: string,
  label: string,
  maxChars: number,
  options?: { allowNewlines?: boolean; blockHtml?: boolean }
): string | null {
  const trimmed = value.trim()
  if (!trimmed) return `${label} is required`
  if (trimmed.length > maxChars) {
    return `${label} must be under ${maxChars} characters`
  }
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value)) {
    return `${label} contains invalid control characters`
  }
  if (options?.blockHtml !== false && HTML_TAG.test(trimmed)) {
    return `${label} cannot contain HTML tags`
  }
  if (!options?.allowNewlines && /\r|\n/.test(trimmed)) {
    return `${label} cannot contain line breaks`
  }
  return null
}

export function validateContributorName(name: string): string | null {
  const err = validatePlainText(name, 'Name', MAX_NAME_CHARS, { allowNewlines: false })
  if (err) return err
  if (!/^[\p{L}\p{M}\p{N}\s.'-]+$/u.test(name.trim())) {
    return 'Name can only contain letters, numbers, spaces, and . \' -'
  }
  return null
}

export function validateGithubUsername(handle: string): string | null {
  const trimmed = handle.trim().replace(/^@/, '')
  if (!trimmed) return null
  if (trimmed.length > 39) return 'GitHub username is too long'
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return 'Enter a valid GitHub username (no @)'
  }
  return null
}

export function validateTags(tags: string): string | null {
  if (!tags.trim()) return null
  const list = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  if (list.length > MAX_TAG_COUNT) return `Maximum ${MAX_TAG_COUNT} tags`
  for (const tag of list) {
    if (tag.length > MAX_TAG_CHARS) return `Each tag must be under ${MAX_TAG_CHARS} characters`
    if (HTML_TAG.test(tag)) return 'Tags cannot contain HTML'
    if (!/^[\p{L}\p{N}\s.#+-]+$/u.test(tag)) {
      return 'Tags can only use letters, numbers, spaces, and . # + -'
    }
  }
  return null
}

export const SUBMISSION_LIMITS = {
  MAX_CODE_CHARS,
  MAX_TEXT_CHARS,
  MAX_TITLE_CHARS,
  MAX_SUBTITLE_CHARS,
  MAX_NAME_CHARS,
  MAX_TAG_COUNT,
} as const
