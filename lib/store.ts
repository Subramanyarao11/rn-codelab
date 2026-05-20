import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppStore, EditorSettings } from './types'

const defaultProgress = {
  completed: false,
  solutionViewed: false,
  userCode: null as string | null,
}

export const defaultEditorSettings: EditorSettings = {
  theme: 'rn-labs-dark',
  fontSize: 13,
  minimap: false,
  wordWrap: true,
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      progress: {},
      editor: defaultEditorSettings,

      markComplete: (id) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? defaultProgress), completed: true },
          },
        })),

      markSolutionViewed: (id) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? defaultProgress), solutionViewed: true },
          },
        })),

      saveCode: (id, code) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? defaultProgress), userCode: code },
          },
        })),

      resetProblem: (id) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { completed: false, solutionViewed: false, userCode: null },
          },
        })),

      clearSavedCode: (id) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? defaultProgress), userCode: null },
          },
        })),

      setEditorSettings: (patch) =>
        set((s) => ({
          editor: { ...s.editor, ...patch },
        })),
    }),
    {
      name: 'rn-debug-labs-progress',
      partialize: (state) => ({
        progress: state.progress,
        editor: state.editor,
      }),
    }
  )
)
