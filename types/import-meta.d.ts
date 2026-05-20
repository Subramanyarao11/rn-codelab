/** Next.js / Turbopack client HMR (replaces webpack `module.hot` in the browser). */
interface ImportMetaHot {
  dispose(callback: () => void): void
  accept(): void
  invalidate(): void
}

interface ImportMeta {
  readonly hot?: ImportMetaHot
}
