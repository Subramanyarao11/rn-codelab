export interface TourStep {
  id: string
  target: string
  title: string
  body: string
  placement: 'top' | 'bottom' | 'left' | 'right'
  /** Align card on the secondary axis (start = top/left, end = bottom/right) */
  align?: 'start' | 'center' | 'end'
}

export const WORKSPACE_TOUR_STEPS: TourStep[] = [
  {
    id: 'sidebar',
    target: '[data-tour="sidebar-challenges"]',
    title: 'Challenge map',
    body: 'Jump between all 10 Fix-the-Bug labs. Completed challenges show a green check.',
    placement: 'right',
    align: 'start',
  },
  {
    id: 'problem',
    target: '[data-tour="problem"]',
    title: 'Bug brief',
    body: 'Read the report, symptoms, and your task before you touch the code.',
    placement: 'right',
  },
  {
    id: 'editor',
    target: '[data-tour="editor"]',
    title: 'Code editor',
    body: 'Edit the broken React Native source. Your draft autosaves as you type.',
    placement: 'right',
  },
  {
    id: 'preview',
    target: '[data-tour="preview"]',
    title: 'Live preview',
    body: 'See the app update in the phone frame. Use Run to refresh; Snack opens Expo on a device.',
    placement: 'left',
  },
  {
    id: 'tests',
    target: '[data-tour="tests"]',
    title: 'Automated tests',
    body: 'Click Check when you think the bug is fixed. Every test must pass to complete the challenge.',
    placement: 'left',
  },
  {
    id: 'toolbar',
    target: '[data-tour="toolbar-actions"]',
    title: 'Toolbar',
    body: 'Reset starter code, reveal hints or the solution, and move Prev / Next between challenges.',
    placement: 'bottom',
    align: 'end',
  },
]
