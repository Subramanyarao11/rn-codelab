import * as RN from 'react-native'

export type PreviewPlatformOS = 'ios' | 'android' | 'web'

/** Mock Platform for in-browser preview so Platform.OS matches the selected device. */
export function createPlatformMock(os: PreviewPlatformOS) {
  const base = RN.Platform
  return {
    ...base,
    OS: os,
    select<T>(specifics: { ios?: T; android?: T; web?: T; default?: T }): T | undefined {
      return specifics[os] ?? specifics.default
    },
  }
}

export function shouldSimulateIosKeyboard(
  problemId: number,
  platform: PreviewPlatformOS
): boolean {
  return problemId === 7 && platform === 'ios'
}
