import type { EditorThemeId } from './types'

export const EDITOR_THEME_OPTIONS: { id: EditorThemeId; label: string; group?: string }[] = [
  { id: 'rn-labs-dark', label: 'RN Dark', group: 'RN Labs' },
  { id: 'rn-labs-light', label: 'RN Light', group: 'RN Labs' },
  { id: 'vs-dark', label: 'VS Dark', group: 'Classic' },
  { id: 'vs-light', label: 'VS Light', group: 'Classic' },
  { id: 'hc-black', label: 'High Contrast', group: 'Classic' },
  { id: 'dracula', label: 'Dracula', group: 'Popular' },
  { id: 'github-dark', label: 'GitHub Dark', group: 'Popular' },
  { id: 'one-dark', label: 'One Dark', group: 'Popular' },
  { id: 'nord', label: 'Nord', group: 'Popular' },
  { id: 'night-owl', label: 'Night Owl', group: 'Popular' },
  { id: 'monokai', label: 'Monokai', group: 'Popular' },
  { id: 'cobalt', label: 'Cobalt', group: 'Popular' },
  { id: 'solarized-dark', label: 'Solarized Dark', group: 'Solarized' },
  { id: 'solarized-light', label: 'Solarized Light', group: 'Solarized' },
  { id: 'ayu-dark', label: 'Ayu Dark', group: 'Other' },
  { id: 'tomorrow-night', label: 'Tomorrow Night', group: 'Other' },
]

const LIGHT_THEMES: EditorThemeId[] = [
  'rn-labs-light',
  'vs-light',
  'solarized-light',
]

export function isLightEditorTheme(theme: EditorThemeId): boolean {
  return LIGHT_THEMES.includes(theme)
}

export function getEditorSurfaceColor(theme: EditorThemeId): string {
  const surfaces: Partial<Record<EditorThemeId, string>> = {
    'rn-labs-light': '#fafafa',
    'vs-light': '#ffffff',
    'solarized-light': '#fdf6e3',
    'dracula': '#282a36',
    'github-dark': '#0d1117',
    'one-dark': '#282c34',
    nord: '#2e3440',
    'night-owl': '#011627',
    monokai: '#272822',
    cobalt: '#002240',
    'solarized-dark': '#002b36',
    'ayu-dark': '#0b0e14',
    'tomorrow-night': '#1d1f21',
  }
  return surfaces[theme] ?? '#1e1e1e'
}

export function defineAllEditorThemes(monaco: typeof import('monaco-editor')) {
  monaco.editor.defineTheme('rn-labs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#5a5a5a',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#f59e0b',
      'editor.lineHighlightBackground': '#2a2a2a',
    },
  })

  monaco.editor.defineTheme('rn-labs-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#1f2937',
      'editorLineNumber.foreground': '#9ca3af',
      'editor.selectionBackground': '#fde68a55',
      'editorCursor.foreground': '#d97706',
      'editor.lineHighlightBackground': '#f3f4f6',
    },
  })

  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272A4' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'type', foreground: '8BE9FD' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#313340',
    },
  })

  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8B949E' },
      { token: 'keyword', foreground: 'FF7B72' },
      { token: 'string', foreground: 'A5D6FF' },
      { token: 'number', foreground: '79C0FF' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editorLineNumber.foreground': '#6e7681',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#58a6ff',
      'editor.lineHighlightBackground': '#161b22',
    },
  })

  monaco.editor.defineTheme('one-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5C6370' },
      { token: 'keyword', foreground: 'C678DD' },
      { token: 'string', foreground: '98C379' },
      { token: 'number', foreground: 'D19A66' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorLineNumber.foreground': '#636d83',
      'editor.selectionBackground': '#3e4451',
      'editorCursor.foreground': '#528bff',
      'editor.lineHighlightBackground': '#2c313a',
    },
  })

  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616E88' },
      { token: 'keyword', foreground: '81A1C1' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'number', foreground: 'B48EAD' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#d8dee9',
      'editorLineNumber.foreground': '#4c566a',
      'editor.selectionBackground': '#434c5e',
      'editorCursor.foreground': '#88c0d0',
      'editor.lineHighlightBackground': '#3b4252',
    },
  })

  monaco.editor.defineTheme('night-owl', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '637777' },
      { token: 'keyword', foreground: 'C792EA' },
      { token: 'string', foreground: 'ECC48D' },
      { token: 'number', foreground: 'F78C6C' },
    ],
    colors: {
      'editor.background': '#011627',
      'editor.foreground': '#d6deeb',
      'editorLineNumber.foreground': '#4b6478',
      'editor.selectionBackground': '#1d3b53',
      'editorCursor.foreground': '#80a4c2',
      'editor.lineHighlightBackground': '#0b2942',
    },
  })

  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715E' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'number', foreground: 'AE81FF' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#90908a',
      'editor.selectionBackground': '#49483e',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#3e3d32',
    },
  })

  monaco.editor.defineTheme('cobalt', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '0088FF' },
      { token: 'keyword', foreground: 'FF9D00' },
      { token: 'string', foreground: '3AD900' },
      { token: 'number', foreground: 'FF628C' },
    ],
    colors: {
      'editor.background': '#002240',
      'editor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#38566f',
      'editor.selectionBackground': '#003f8e',
      'editorCursor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#001a33',
    },
  })

  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586E75' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
      'editorLineNumber.foreground': '#586e75',
      'editor.selectionBackground': '#073642',
      'editorCursor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
    },
  })

  monaco.editor.defineTheme('solarized-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '93A1A1' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
    ],
    colors: {
      'editor.background': '#fdf6e3',
      'editor.foreground': '#657b83',
      'editorLineNumber.foreground': '#93a1a1',
      'editor.selectionBackground': '#eee8d5',
      'editorCursor.foreground': '#657b83',
      'editor.lineHighlightBackground': '#eee8d5',
    },
  })

  monaco.editor.defineTheme('ayu-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5C6773' },
      { token: 'keyword', foreground: 'FF8F40' },
      { token: 'string', foreground: 'AAD84C' },
      { token: 'number', foreground: 'D2A6FF' },
    ],
    colors: {
      'editor.background': '#0b0e14',
      'editor.foreground': '#bfbdb6',
      'editorLineNumber.foreground': '#4d5566',
      'editor.selectionBackground': '#253340',
      'editorCursor.foreground': '#e6b450',
      'editor.lineHighlightBackground': '#131721',
    },
  })

  monaco.editor.defineTheme('tomorrow-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '969896' },
      { token: 'keyword', foreground: 'C66D79' },
      { token: 'string', foreground: 'B5BD68' },
      { token: 'number', foreground: 'DE935F' },
    ],
    colors: {
      'editor.background': '#1d1f21',
      'editor.foreground': '#c5c8c6',
      'editorLineNumber.foreground': '#969896',
      'editor.selectionBackground': '#373b41',
      'editorCursor.foreground': '#c5c8c6',
      'editor.lineHighlightBackground': '#282a2e',
    },
  })
}
