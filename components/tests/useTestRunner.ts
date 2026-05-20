'use client'

import { createElement, act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { fireEvent } from '@testing-library/dom'
import { waitFor } from '@testing-library/dom'
import * as RN from 'react-native'
import type { TestCase } from '@/lib/types'

type TestInput = Omit<TestCase, 'status'>

type ActGlobal = typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }

function setActEnvironment(enabled: boolean) {
  const g = globalThis as ActGlobal
  if (enabled) {
    g.IS_REACT_ACT_ENVIRONMENT = true
  } else {
    delete g.IS_REACT_ACT_ENVIRONMENT
  }
}

let testContainer: HTMLDivElement | null = null
let testRoot: Root | null = null

function getTestContainer(): HTMLDivElement {
  if (!testContainer) {
    testContainer = document.createElement('div')
    testContainer.id = 'rn-debug-labs-test-root'
    testContainer.setAttribute('data-testid', 'test-root')
    document.body.appendChild(testContainer)
  }
  testContainer.style.cssText =
    'position:relative;width:400px;height:700px;display:flex;flex-direction:column;overflow:hidden;'
  return testContainer
}

async function mountTestTree(element: React.ReactElement, container: HTMLElement) {
  await act(async () => {
    if (!testRoot) {
      testRoot = createRoot(container)
    }
    testRoot.render(element)
  })
}

async function unmountTestTree() {
  const root = testRoot
  testRoot = null
  if (!root) return
  await act(async () => {
    root.unmount()
  })
}

function queryByTestId(testId: string): HTMLElement | null {
  const root = getTestContainer()
  return root.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null
}

function getElementText(el: HTMLElement): string {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value
  }
  return (el.textContent ?? '').trim()
}

function getTextContent(testId: string): string {
  const el = queryByTestId(testId)
  if (!el) return ''
  return getElementText(el)
}

async function seedAsyncStorage(seed: Record<string, string>) {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
  await AsyncStorage.clear()
  for (const [key, value] of Object.entries(seed)) {
    await AsyncStorage.setItem(key, value)
  }
}

function findNativeTextInput(el: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el
  }
  return el.querySelector('input:not([type=hidden]), textarea')
}

async function simulateRnTextInput(
  target: HTMLElement,
  text: string
): Promise<boolean> {
  const input = findNativeTextInput(target)
  if (!input) return false

  await act(async () => {
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: text } })
  })
  return true
}

async function runSingleTest(tc: TestInput): Promise<'pass' | 'fail'> {
  try {
    switch (tc.type) {
      case 'no_crash':
        return 'pass'

      case 'dom_exists': {
        const ids = tc.selectors ?? (tc.selector ? [tc.selector] : [])
        try {
          await waitFor(
            () => {
              const missing = ids.filter((id) => queryByTestId(id) === null)
              if (missing.length > 0) {
                throw new Error(`Missing: ${missing.join(', ')}`)
              }
            },
            { timeout: 5000 }
          )
          return 'pass'
        } catch {
          return 'fail'
        }
      }

      case 'dom_text': {
        if (!tc.selector) return 'fail'
        try {
          await waitFor(
            () => {
              const text = getTextContent(tc.selector!)
              if (tc.expectedText && !text.includes(tc.expectedText)) {
                throw new Error(`Expected "${tc.expectedText}" in "${text}"`)
              }
            },
            { timeout: 3000 }
          )
          return 'pass'
        } catch {
          return 'fail'
        }
      }

      case 'interaction': {
        const target = tc.actionTarget ? queryByTestId(tc.actionTarget) : null
        if (tc.action === 'type' && target && tc.actionValue) {
          const typed = await simulateRnTextInput(target, tc.actionValue)
          if (!typed) return 'fail'
        } else if (tc.action === 'press' && target) {
          await act(async () => {
            target.click()
          })
          await act(async () => {
            await new Promise((r) => setTimeout(r, 100))
          })
        } else if (tc.action) {
          return 'fail'
        }

        if (tc.selector && tc.expectedText) {
          try {
            await waitFor(
              () => {
                const text = getTextContent(tc.selector!)
                if (!text.includes(tc.expectedText!)) {
                  throw new Error(`Expected "${tc.expectedText}" in "${text}"`)
                }
              },
              { timeout: 3000 }
            )
            return 'pass'
          } catch {
            return 'fail'
          }
        }
        if (tc.selector) {
          return queryByTestId(tc.selector) !== null ? 'pass' : 'fail'
        }
        return 'pass'
      }

      default:
        return 'fail'
    }
  } catch {
    return 'fail'
  }
}

function TestHarness({ children }: { children: React.ReactNode }) {
  return createElement(
    RN.View,
    { style: { flex: 1, width: '100%', height: '100%', backgroundColor: '#fff' } },
    children
  )
}

export async function runTests(
  userCode: string,
  testCases: TestInput[]
): Promise<{ results: TestCase[]; error?: string }> {
  setActEnvironment(true)
  try {
    await unmountTestTree()

    let Component: React.ComponentType
    try {
      const { evalUserCode } = await import('@/lib/evalUserCode')
      Component = evalUserCode(userCode)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse code'
      return {
        results: testCases.map((tc) => ({ ...tc, status: 'fail' as const })),
        error: message,
      }
    }

    const container = getTestContainer()

    const storageSeed = testCases.find((tc) => tc.storageSeed)?.storageSeed
    if (storageSeed) {
      await seedAsyncStorage(storageSeed)
    }

    const WrappedApp = () =>
      createElement(TestHarness, null, createElement(Component))

    try {
      await mountTestTree(createElement(WrappedApp), container)
      await act(async () => {
        await new Promise((r) => setTimeout(r, 300))
      })
    } catch (err) {
      await unmountTestTree()
      const message = err instanceof Error ? err.message : 'Component failed to render'
      return {
        results: testCases.map((tc) => ({ ...tc, status: 'fail' as const })),
        error: message,
      }
    }

    const results: TestCase[] = []
    for (const tc of testCases) {
      const status = await runSingleTest(tc)
      results.push({ ...tc, status })
    }

    await unmountTestTree()

    if (storageSeed) {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
      await AsyncStorage.clear()
    }

    return { results }
  } finally {
    setActEnvironment(false)
  }
}
