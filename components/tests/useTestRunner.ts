'use client'

import { createElement } from 'react'
import { render, act, cleanup, waitFor, fireEvent } from '@testing-library/react'
import * as RN from 'react-native'
import type { TestCase } from '@/lib/types'

type TestInput = Omit<TestCase, 'status'>

let testContainer: HTMLDivElement | null = null

function getTestContainer(): HTMLDivElement {
  if (!testContainer) {
    testContainer = document.createElement('div')
    testContainer.id = 'rn-debug-labs-test-root'
    testContainer.setAttribute('data-testid', 'test-root')
    document.body.appendChild(testContainer)
  }
  // FlatList / flex layouts need a sized parent on react-native-web
  testContainer.style.cssText =
    'position:relative;width:400px;height:700px;display:flex;flex-direction:column;overflow:hidden;'
  return testContainer
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
  cleanup()

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
    await act(async () => {
      render(createElement(WrappedApp), { container })
    })
    // Allow FlatList / effects to mount on react-native-web
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300))
    })
  } catch (err) {
    cleanup()
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

  cleanup()

  if (storageSeed) {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
    await AsyncStorage.clear()
  }

  return { results }
}
