import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import bridge from '@/components/app/bridge'

// ---- Types -----------------------------------------------------------------

interface LogEntry {
  id: number
  time: string
  direction: 'send' | 'receive' | 'error'
  content: string
}

let logId = 0

const MOCK_CHANNEL = 'codatta-bridge-mock'

const directionColors: Record<LogEntry['direction'], string> = {
  send: '#60a5fa',
  receive: '#4ade80',
  error: '#f87171'
}

const directionLabels: Record<LogEntry['direction'], string> = {
  send: 'SEND',
  receive: 'RECV',
  error: 'ERR '
}

// ---- Styles ----------------------------------------------------------------

const btnStyle: React.CSSProperties = {
  padding: '6px 16px',
  borderRadius: 6,
  border: 'none',
  background: '#6366f1',
  color: '#fff',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap'
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#e2e8f0',
  fontSize: 13,
  outline: 'none',
  minWidth: 80
}

const logBoxStyle: React.CSSProperties = {
  background: '#1e1e2e',
  borderRadius: 6,
  padding: 8,
  marginTop: 8,
  fontFamily: 'monospace',
  fontSize: 11,
  lineHeight: 1.5
}

type ActionLogs = Record<string, LogEntry[]>

// ============================================================================
// Entry point: decides mock host vs real mode
// ============================================================================

export default function BridgeTest() {
  const [searchParams] = useSearchParams()
  const isWebview = searchParams.get('mode') === 'webview'

  // If mode=webview, we are inside the iframe - render the test panel directly.
  // The parent (mock host) has injected window.webkit for us.
  if (isWebview) {
    return <BridgeTestPanel />
  }

  // Otherwise render the host page which can toggle between mock and real mode
  return <BridgeTestHost />
}

// ============================================================================
// Mock Host: parent page acts as "native app"
// Renders the test panel inside an iframe, intercepts bridge calls, responds.
// ============================================================================

function BridgeTestHost() {
  const [mockEnabled, setMockEnabled] = useState(false)
  const [simDelay, setSimDelay] = useState(500)
  const [simSuccess, setSimSuccess] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Listen for bridge calls from the iframe (webview)
  useEffect(() => {
    if (!mockEnabled) return

    function onMessage(e: MessageEvent) {
      const msg = e.data
      if (!msg || msg.channel !== MOCK_CHANNEL) return

      if (msg.type === 'bridge-call') {
        // The iframe's bridge.postMessage was called - we are the "native app"
        const bridgeMsg = msg.data

        // Simulate native processing and respond after delay
        setTimeout(() => {
          const response = {
            id: bridgeMsg.id,
            result: simSuccess ? { success: true } : { success: false, errorMsg: 'Simulated error from native' },
            error: !simSuccess
          }
          // Send response back to iframe via handleNativeResponse
          iframeRef.current?.contentWindow?.postMessage(
            { channel: MOCK_CHANNEL, type: 'native-response', data: response },
            '*'
          )
        }, simDelay)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mockEnabled, simDelay, simSuccess])

  const iframeSrc = `/dev/bridge-test?mode=webview`

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Bridge Test</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
          Toggle mock mode to simulate the native app environment via iframe
        </p>

        {/* Mode toggle */}
        <Section title="Mode">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={mockEnabled}
                onChange={(e) => {
                  setMockEnabled(e.target.checked)
                }}
              />
              Enable Mock Mode (this page = native app, iframe = webview)
            </label>
            {mockEnabled && (
              <>
                <label style={{ fontSize: 13, color: '#94a3b8' }}>
                  Delay (ms):
                  <input
                    type="number"
                    value={simDelay}
                    onChange={(e) => setSimDelay(Number(e.target.value))}
                    style={{ ...inputStyle, width: 80, marginLeft: 6 }}
                  />
                </label>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={simSuccess} onChange={(e) => setSimSuccess(e.target.checked)} />
                  Simulate success
                </label>
              </>
            )}
          </div>
        </Section>

        {mockEnabled ? (
          <Section title="Webview (iframe)">
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              style={{
                width: '100%',
                height: 700,
                border: '1px solid #334155',
                borderRadius: 8,
                background: '#0f0f1a'
              }}
              title="Mock Webview"
            />
          </Section>
        ) : (
          <BridgeTestPanel />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Test Panel: the actual test UI with action buttons
// In mock mode this runs inside the iframe. In real mode it runs directly.
// ============================================================================

function BridgeTestPanel({ onLog }: { onLog?: (direction: LogEntry['direction'], content: string) => void }) {
  const [actionLogs, setActionLogs] = useState<ActionLogs>({})
  const [customUrl, setCustomUrl] = useState('')
  const [customView, setCustomView] = useState('')
  const [customWebviewUrl, setCustomWebviewUrl] = useState('https://www.google.com')
  const [customBrowserUrl, setCustomBrowserUrl] = useState('https://www.google.com')
  const [customDeeplink, setCustomDeeplink] = useState('twitter://user?screen_name=codaboratory')
  const [customFrontierId, setCustomFrontierId] = useState('test-frontier-123')
  const [customDatasetName, setCustomDatasetName] = useState('fashion')

  // ---- Inject mock webkit bridge when inside iframe (mode=webview) ----------
  useEffect(() => {
    // Check if we are inside an iframe
    if (window.parent === window) return

    // Install fake window.webkit that forwards calls to parent (the "native app")
    window.__bridgeMockEnabled = true
    window.webkit = {
      messageHandlers: {
        bridge: {
          postMessage: (msg) => {
            window.parent.postMessage({ channel: MOCK_CHANNEL, type: 'bridge-call', data: msg }, '*')
          }
        }
      }
    }

    // Listen for native responses from parent
    function onMessage(e: MessageEvent) {
      const msg = e.data
      if (!msg || msg.channel !== MOCK_CHANNEL || msg.type !== 'native-response') return
      if (window.handleNativeResponse) {
        window.handleNativeResponse(msg.data)
      }
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      delete window.__bridgeMockEnabled
    }
  }, [])

  // ---- Log helpers ---------------------------------------------------------

  const clearActionLog = useCallback((actionKey: string) => {
    setActionLogs((prev) => ({ ...prev, [actionKey]: [] }))
  }, [])

  const addLog = useCallback((actionKey: string, direction: LogEntry['direction'], content: string) => {
    setActionLogs((prev) => {
      const entry: LogEntry = {
        id: ++logId,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        direction,
        content
      }
      return { ...prev, [actionKey]: [...(prev[actionKey] || []), entry].slice(-4) }
    })
  }, [])

  // ---- Run action ----------------------------------------------------------

  const runAction = useCallback(
    async (actionKey: string, label: string, fn: () => Promise<unknown> | void) => {
      clearActionLog(actionKey)

      // Capture the raw BridgeMessage via debug hook
      let rawMsg: unknown = null
      bridge.onSend((msg) => {
        rawMsg = msg
      })

      addLog(actionKey, 'send', label)
      onLog?.('send', label)
      try {
        const resultPromise = fn()

        // Log the raw message that was sent to native
        if (rawMsg) {
          const rawText = JSON.stringify(rawMsg, null, 2)
          addLog(actionKey, 'send', `[RAW] ${rawText}`)
          onLog?.('send', `[RAW] ${rawText}`)
        }

        const result = await resultPromise
        if (result) {
          const text = JSON.stringify(result, null, 2)
          addLog(actionKey, 'receive', text)
          onLog?.('receive', text)
        }
      } catch (err) {
        const text = err instanceof Error ? err.message : String(err)
        addLog(actionKey, 'error', text)
        onLog?.('error', text)
      } finally {
        bridge.onSend(null)
      }
    },
    [addLog, clearActionLog, onLog]
  )

  return (
    <div style={{ background: '#0f0f1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '16px' }}>
      {/* Environment Info */}
      <Section title="Environment">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InfoItem label="isInApp()" value={String(bridge.isInApp())} />
          <InfoItem label="isBridgeAvailable()" value={String(bridge.isBridgeAvailable())} />
          <InfoItem label="In iframe" value={String(window.parent !== window)} />
          <InfoItem label="User Agent" value={navigator.userAgent} />
        </div>
      </Section>

      {/* Actions */}
      <Section title="Actions">
        <TestCase
          actionKey="close"
          logs={actionLogs['close']}
          onRun={() => runAction('close', 'bridge.close()', () => bridge.close())}
        />
        <TestCase
          actionKey="goBack"
          logs={actionLogs['goBack']}
          onRun={() => runAction('goBack', 'bridge.goBack()', () => bridge.goBack())}
        />
        <TestCase
          actionKey="openHome"
          logs={actionLogs['openHome']}
          onRun={() => runAction('openHome', 'bridge.openHome()', () => bridge.openHome())}
        />

        <TestCaseWithInput
          actionKey="downloadDataset"
          logs={actionLogs['downloadDataset']}
          placeholder="dataset name, e.g. fashion"
          value={customDatasetName}
          onChange={setCustomDatasetName}
          onRun={() =>
            runAction('downloadDataset', `bridge.downloadDataset('${customDatasetName}')`, () =>
              bridge.downloadDataset(customDatasetName)
            )
          }
        />

        <TestCaseWithInput
          actionKey="openAppView"
          logs={actionLogs['openAppView']}
          placeholder="view name, e.g. home"
          value={customView}
          onChange={setCustomView}
          onRun={() =>
            runAction('openAppView', `bridge.openAppView('${customView}')`, () => bridge.openAppView(customView))
          }
        />

        <TestCaseWithInput
          actionKey="openFrontierDetail"
          logs={actionLogs['openFrontierDetail']}
          placeholder="frontier ID"
          value={customFrontierId}
          onChange={setCustomFrontierId}
          onRun={() =>
            runAction('openFrontierDetail', `bridge.openFrontierDetail('${customFrontierId}')`, () =>
              bridge.openFrontierDetail(customFrontierId)
            )
          }
        />

        <TestCaseWithInput
          actionKey="openWebview"
          logs={actionLogs['openWebview']}
          placeholder="URL"
          value={customWebviewUrl}
          onChange={setCustomWebviewUrl}
          onRun={() =>
            runAction('openWebview', `bridge.openWebview('${customWebviewUrl}')`, () =>
              bridge.openWebview(customWebviewUrl)
            )
          }
        />

        <TestCaseWithInput
          actionKey="openBrowser"
          logs={actionLogs['openBrowser']}
          placeholder="URL"
          value={customBrowserUrl}
          onChange={setCustomBrowserUrl}
          onRun={() =>
            runAction('openBrowser', `bridge.openBrowser('${customBrowserUrl}')`, () =>
              bridge.openBrowser(customBrowserUrl)
            )
          }
        />

        <TestCaseWithInput
          actionKey="openDeeplink"
          logs={actionLogs['openDeeplink']}
          placeholder="appLink, e.g. twitter://..."
          value={customDeeplink}
          onChange={setCustomDeeplink}
          onRun={() =>
            runAction('openDeeplink', `bridge.openDeeplink('${customDeeplink}')`, () =>
              bridge.openDeeplink(customDeeplink)
            )
          }
        />

        <TestCaseWithInput
          actionKey="open"
          logs={actionLogs['open']}
          placeholder="app://open?type=app&view=home"
          value={customUrl}
          onChange={setCustomUrl}
          onRun={() => runAction('open', `bridge.open('${customUrl}')`, () => bridge.open(customUrl))}
        />
      </Section>

      {/* URL Builder Preview */}
      <Section title="URL Builder Preview">
        <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
          <UrlPreview label="buildAppViewUrl('home')" url={bridge.buildAppViewUrl('home')} />
          <UrlPreview
            label="buildAppViewUrl('FrontierDetail', { frontierId: '123' })"
            url={bridge.buildAppViewUrl('FrontierDetail', { frontierId: '123' })}
          />
          <UrlPreview
            label="buildWebviewUrl('https://google.com')"
            url={bridge.buildWebviewUrl('https://google.com')}
          />
          <UrlPreview
            label="buildBrowserUrl('https://google.com')"
            url={bridge.buildBrowserUrl('https://google.com')}
          />
          <UrlPreview
            label="buildDeeplinkUrl('twitter://user?screen_name=test')"
            url={bridge.buildDeeplinkUrl('twitter://user?screen_name=test')}
          />
        </div>
      </Section>
    </div>
  )
}

// ---- Sub-components --------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24, background: '#1a1a2e', borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#e2e8f0' }}>{title}</h2>
      {children}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  const boolColor = value === 'true' ? '#4ade80' : value === 'false' ? '#f87171' : undefined
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#94a3b8' }}>{label}: </span>
      <span style={{ color: boolColor || '#e2e8f0', fontWeight: boolColor ? 600 : 400, wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  )
}

function LogDisplay({ logs }: { logs?: LogEntry[] }) {
  if (!logs || logs.length === 0) return null
  return (
    <div style={logBoxStyle}>
      {logs.map((log) => (
        <div key={log.id}>
          <span style={{ color: '#64748b' }}>{log.time}</span>{' '}
          <span style={{ color: directionColors[log.direction], fontWeight: 600 }}>
            [{directionLabels[log.direction]}]
          </span>{' '}
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{log.content}</span>
        </div>
      ))}
    </div>
  )
}

function TestCase({ actionKey, logs, onRun }: { actionKey: string; logs?: LogEntry[]; onRun: () => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', minWidth: 140 }}>{actionKey}</span>
        <button onClick={onRun} style={btnStyle}>
          Run
        </button>
      </div>
      <LogDisplay logs={logs} />
    </div>
  )
}

function TestCaseWithInput({
  actionKey,
  logs,
  placeholder,
  value,
  onChange,
  onRun
}: {
  actionKey: string
  logs?: LogEntry[]
  placeholder: string
  value: string
  onChange: (v: string) => void
  onRun: () => void
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', minWidth: 140 }}>{actionKey}</span>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={onRun} style={btnStyle} disabled={!value}>
          Run
        </button>
      </div>
      <LogDisplay logs={logs} />
    </div>
  )
}

function UrlPreview({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <div style={{ color: '#94a3b8' }}>{label}</div>
      <div style={{ color: '#60a5fa', wordBreak: 'break-all' }}>{url}</div>
    </div>
  )
}
