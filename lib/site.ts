export const SITE_NAME = 'RN Debug Labs'

export const SITE_DESCRIPTION =
  'Hands-on React Native debugging challenges in the browser. Read the bug report, fix the code, preview live, and pass automated tests — no native toolchain required.'

export const SITE_SHORT_DESCRIPTION =
  'Fix broken React Native code. Pass the tests. Learn by debugging.'

export const SITE_KEYWORDS = [
  'React Native',
  'debugging',
  'coding challenges',
  'learn React Native',
  'FlatList',
  'React Native bugs',
  'interactive tutorial',
  'Monaco editor',
  'browser lab',
  'Fix the Bug',
]

/** Canonical site URL — set NEXT_PUBLIC_SITE_URL on Vercel (e.g. https://rndebuglabs.com). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export const SITE_URL = getSiteUrl()
