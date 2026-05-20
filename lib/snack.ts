/** Expo Snack `files` payload — see https://github.com/expo/snack/blob/main/docs/url-query-parameters.md */
export function buildSnackFilesPayload(code: string): string {
  const files = {
    'App.js': {
      type: 'CODE' as const,
      contents: code,
    },
  }
  return encodeURIComponent(JSON.stringify(files))
}

export function buildSnackUrl(
  code: string,
  platform: 'web' | 'ios' | 'android' = 'web'
): string {
  const query = [
    `files=${buildSnackFilesPayload(code)}`,
    `platform=${platform}`,
    'preview=true',
    'hideQueryParams=true',
    'theme=dark',
    'supportedPlatforms=web,ios,android',
    'sdkVersion=51.0.0',
  ].join('&')
  return `https://snack.expo.dev/embedded?${query}`
}

export function sendCodeToSnack(iframe: HTMLIFrameElement, code: string): void {
  const payload = JSON.stringify({
    type: 'CODE_CHANGE',
    code,
    files: {
      'App.js': {
        type: 'CODE',
        contents: code,
      },
    },
  })
  iframe.contentWindow?.postMessage(payload, 'https://snack.expo.dev')
}
