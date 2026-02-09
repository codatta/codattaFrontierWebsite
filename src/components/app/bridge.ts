// ============================================================================
// Native Bridge - Webview <-> App Native Communication
// ============================================================================

// ----- Types ----------------------------------------------------------------

interface BridgeMessage {
  id: string
  action: string
  payload?: Record<string, unknown> | string
}

interface NativeResponse {
  id: string
  result: {
    success: boolean
    errorMsg?: string
    [key: string]: unknown
  }
  error: boolean
}

type ResponseResolver = {
  resolve: (res: NativeResponse) => void
  reject: (reason: unknown) => void
  timer: ReturnType<typeof setTimeout>
}

// Extend window for webkit bridge & callback
declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        bridge: {
          postMessage: (message: BridgeMessage) => void
        }
      }
    }
    handleNativeResponse?: (response: NativeResponse) => void
    __bridgeMockEnabled?: boolean
  }
}

// ----- Internal state -------------------------------------------------------

const pendingRequests = new Map<string, ResponseResolver>()

const DEFAULT_TIMEOUT = 3000 // 10s

let _onSendHook: ((msg: BridgeMessage) => void) | null = null

// ----- Core send ------------------------------------------------------------

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8)
}

function isInApp(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('codatta')
}

function isBridgeAvailable(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.webkit?.messageHandlers?.bridge) return false
  return isInApp() || !!window.__bridgeMockEnabled
}

function sendMessage(
  action: string,
  payload: Record<string, unknown> | string = {},
  timeout = DEFAULT_TIMEOUT
): Promise<NativeResponse> {
  return new Promise((resolve, reject) => {
    if (!isBridgeAvailable()) {
      reject(new Error('[Bridge] webkit bridge is not available'))
      return
    }

    const id = generateId()

    const timer = setTimeout(() => {
      pendingRequests.delete(id)
      reject(new Error(`[Bridge] action "${action}" timed out (${timeout}ms)`))
    }, timeout)

    pendingRequests.set(id, { resolve, reject, timer })

    const msg: BridgeMessage = { id, action, payload }
    _onSendHook?.(msg)
    window.webkit!.messageHandlers.bridge.postMessage(msg)
  })
}

// ----- Global callback handler ----------------------------------------------

function setupResponseHandler() {
  if (typeof window === 'undefined') return

  window.handleNativeResponse = (response: NativeResponse) => {
    const pending = pendingRequests.get(response.id)
    if (!pending) return

    clearTimeout(pending.timer)
    pendingRequests.delete(response.id)

    if (response.error) {
      pending.reject(new Error(response.result?.errorMsg || '[Bridge] native error'))
    } else {
      pending.resolve(response)
    }
  }
}

setupResponseHandler()

// ============================================================================
// App URL Protocol Helpers
// Format: app://open?type=<type>&<params>
// ============================================================================

type OpenType = 'app' | 'webview' | 'browser' | 'deeplink'

function buildAppViewUrl(view: string, params?: Record<string, string>): string {
  const query = new URLSearchParams({ type: 'app' as OpenType, view, ...params })
  return `app://open?${query.toString()}`
}

function buildWebviewUrl(url: string): string {
  const query = new URLSearchParams({ type: 'webview' as OpenType, url })
  return `app://open?${query.toString()}`
}

function buildBrowserUrl(url: string): string {
  const query = new URLSearchParams({ type: 'browser' as OpenType, url })
  return `app://open?${query.toString()}`
}

function buildDeeplinkUrl(appLink: string): string {
  const query = new URLSearchParams({ type: 'deeplink' as OpenType, appLink })
  return `app://open?${query.toString()}`
}

// ============================================================================
// Bridge Object
// ============================================================================

const bridge = {
  /** Check if running inside the Codatta app webview */
  isInApp,

  /** Check if the webkit bridge is available */
  isBridgeAvailable,

  /** Low-level: send a message to native, returns Promise<NativeResponse> */
  postMessage: sendMessage,

  /** Register a debug hook called with the raw BridgeMessage before each send */
  onSend(hook: ((msg: BridgeMessage) => void) | null) {
    _onSendHook = hook
  },

  // ----- URL builders -------------------------------------------------------

  /** Build `app://open?type=app&view=...` */
  buildAppViewUrl,

  /** Build `app://open?type=webview&url=...` */
  buildWebviewUrl,

  /** Build `app://open?type=browser&url=...` */
  buildBrowserUrl,

  /** Build `app://open?type=deeplink&appLink=...` */
  buildDeeplinkUrl,

  // ----- Actions ------------------------------------------------------------

  /** Close the current webview */
  close(): Promise<NativeResponse> {
    return sendMessage('close')
  },

  /** Go back in H5 history; if no history, exits webview to native */
  goBack(): Promise<NativeResponse> | void {
    if (!isBridgeAvailable()) {
      Promise.resolve(() => window?.history?.back())
    }
    return sendMessage('goBack')
  },

  /** Open a url using the app:// protocol */
  open(url: string): Promise<NativeResponse> {
    return sendMessage('open', { target: url })
  },

  // ----- Convenience shortcuts ----------------------------------------------

  /** Navigate to a native app view, e.g. `bridge.openAppView('home')` */
  openAppView(view: string, params?: Record<string, string>): Promise<NativeResponse> {
    return this.open(buildAppViewUrl(view, params))
  },

  /** Open a URL inside the app's webview */
  openWebview(url: string): Promise<NativeResponse> {
    return this.open(buildWebviewUrl(url))
  },

  /** Open a URL in the system browser */
  openBrowser(url: string): Promise<NativeResponse> {
    return this.open(buildBrowserUrl(url))
  },

  /** Open a deeplink (e.g. twitter://, tg://) */
  openDeeplink(appLink: string): Promise<NativeResponse> {
    return this.open(buildDeeplinkUrl(appLink))
  },

  /** Navigate to the Frontier detail page in the app */
  openFrontierDetail(frontierId: string): Promise<NativeResponse> {
    return this.openAppView('FrontierDetail', { frontierId })
  },

  /** Navigate to the app home screen */
  openHome(): Promise<NativeResponse> {
    return this.openAppView('home')
  },

  /** Request the native app to download a dataset */
  downloadDataset(datasetName: string): Promise<NativeResponse> {
    return sendMessage('downloadDataset', datasetName)
  }
}

export default bridge
