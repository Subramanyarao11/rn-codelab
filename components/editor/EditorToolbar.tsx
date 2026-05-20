'use client'

import { Minus, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { EDITOR_THEME_OPTIONS } from '@/lib/editorThemes'
import type { EditorThemeId } from '@/lib/types'
import { cn } from '@/lib/cn'

export function EditorToolbar() {
  const editor = useStore((s) => s.editor)
  const setEditorSettings = useStore((s) => s.setEditorSettings)

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[10px] text-zinc-600 lg:inline">Ctrl+Space · autocomplete</span>
      <select
        value={editor.theme}
        onChange={(e) => setEditorSettings({ theme: e.target.value as EditorThemeId })}
        className={cn(
          'h-7 max-w-[140px] cursor-pointer rounded border border-zinc-700 bg-zinc-900',
          'px-2 text-[10px] text-zinc-300 outline-none focus:border-amber-500/50'
        )}
        aria-label="Editor theme"
      >
        {EDITOR_THEME_OPTIONS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
      <div className="flex items-center rounded border border-zinc-700 bg-zinc-900">
        <button
          type="button"
          onClick={() => setEditorSettings({ fontSize: Math.max(11, editor.fontSize - 1) })}
          className="px-1.5 py-0.5 text-zinc-400 hover:text-zinc-200"
          aria-label="Decrease font size"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="min-w-[28px] text-center text-[10px] tabular-nums text-zinc-400">
          {editor.fontSize}
        </span>
        <button
          type="button"
          onClick={() => setEditorSettings({ fontSize: Math.min(20, editor.fontSize + 1) })}
          className="px-1.5 py-0.5 text-zinc-400 hover:text-zinc-200"
          aria-label="Increase font size"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <label className="flex cursor-pointer items-center gap-1 text-[10px] text-zinc-500">
        <input
          type="checkbox"
          checked={editor.wordWrap}
          onChange={(e) => setEditorSettings({ wordWrap: e.target.checked })}
          className="accent-amber-500"
        />
        Wrap
      </label>
      <label className="flex cursor-pointer items-center gap-1 text-[10px] text-zinc-500">
        <input
          type="checkbox"
          checked={editor.minimap}
          onChange={(e) => setEditorSettings({ minimap: e.target.checked })}
          className="accent-amber-500"
        />
        Minimap
      </label>
    </div>
  )
}
