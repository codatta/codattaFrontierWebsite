function callAppBridge(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.set(key, encodeURIComponent(value))
    }
  }

  const url = `app://${path}?${searchParams.toString()}`

  console.log('bridge Url', url)

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)

  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 1000)
}

/**
 *
 * @param type
 *   app: app inside page
 *   webview: app inside h5
 *   browser: app outside
 *   deeplink: app outside
 * @param url
 */
export function jumpInApp(type: 'app' | 'webview' | 'browser' | 'deeplink', url: string) {
  const params: Record<string, string> = { type }

  switch (type) {
    case 'app':
      params['view'] = url
      break
    case 'deeplink':
      params['appLink'] = url
      break
    default:
      params['url'] = url
      break
  }

  callAppBridge('open', params)
}
