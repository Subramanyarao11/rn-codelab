import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira)', 'monospace'],
      },
      colors: {
        app: {
          bg: 'var(--app-bg)',
          fg: 'var(--app-fg)',
          'fg-secondary': 'var(--app-fg-secondary)',
          'fg-muted': 'var(--app-fg-muted)',
          'fg-subtle': 'var(--app-fg-subtle)',
          surface: 'var(--app-surface)',
          'surface-elevated': 'var(--app-surface-elevated)',
          'surface-muted': 'var(--app-surface-muted)',
          card: 'var(--app-card)',
          border: 'var(--app-border)',
          'border-subtle': 'var(--app-border-subtle)',
          header: 'var(--app-header)',
          sidebar: 'var(--app-sidebar)',
          hover: 'var(--app-hover)',
          'hover-strong': 'var(--app-hover-strong)',
          input: 'var(--app-input-bg)',
          'input-border': 'var(--app-input-border)',
          control: 'var(--app-control-bg)',
          'control-hover': 'var(--app-control-hover)',
          'progress-track': 'var(--app-progress-track)',
          'editor-loading': 'var(--app-editor-loading)',
          overlay: 'var(--app-overlay)',
          'tour-card': 'var(--app-tour-card)',
        },
      },
      boxShadow: {
        'tour-card': '0 25px 50px -12px var(--app-tour-shadow)',
      },
    },
  },
  plugins: [],
}
export default config
