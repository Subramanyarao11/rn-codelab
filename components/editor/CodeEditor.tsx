'use client'

import { useEffect, useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useStore } from '@/lib/store'
import { getEditorSurfaceColor } from '@/lib/editorThemes'
import { setupMonaco, buildEditorOptions, getMonacoTheme } from '@/lib/monacoSetup'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const editorSettings = useStore((s) => s.editor)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null)

  const handleBeforeMount = (monaco: typeof import('monaco-editor')) => {
    monacoRef.current = monaco
    setupMonaco(monaco)
  }

  const handleMount: OnMount = (ed, monaco) => {
    editorRef.current = ed
    monacoRef.current = monaco
    ed.updateOptions(buildEditorOptions(editorSettings, readOnly))
    monaco.editor.setTheme(getMonacoTheme(editorSettings.theme))

    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      ed.trigger('keyboard', 'editor.action.triggerSuggest', {})
    })
  }

  useEffect(() => {
    const ed = editorRef.current
    const monaco = monacoRef.current
    if (!ed || !monaco) return
    ed.updateOptions(buildEditorOptions(editorSettings, readOnly))
    monaco.editor.setTheme(getMonacoTheme(editorSettings.theme))
  }, [editorSettings, readOnly])

  const bg = getEditorSurfaceColor(editorSettings.theme)

  return (
    <div className="h-full min-h-0 flex-1" style={{ backgroundColor: bg }}>
      <Editor
        height="100%"
        language="javascript"
        theme={getMonacoTheme(editorSettings.theme)}
        value={value}
        onChange={(v) => onChange(v ?? '')}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        options={buildEditorOptions(editorSettings, readOnly)}
        loading={
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading editor…
          </div>
        }
      />
    </div>
  )
}
