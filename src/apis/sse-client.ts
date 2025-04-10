export interface MessageData {
  task_status: 'run' | 'finish'
  model: string
  content: string
}

export interface SSEClientOptions {
  url: string
  onMessage: (data: string, event: MessageEvent) => void
  onError?: (error: Event) => void
  onOpen?: (event: Event) => void
  onComplete?: () => void
  retryInterval?: number
}

enum ConnectionState {
  CONNECTING,
  OPEN,
  CLOSED,
  ERROR
}

export class SSEClient {
  private eventSource: EventSource | null = null
  private retryTimer: number | null = null
  private heartbeatInterval: number | null = null
  private state: ConnectionState = ConnectionState.CONNECTING
  private options: SSEClientOptions

  constructor(options: SSEClientOptions) {
    console.log(this.state)
    this.options = {
      retryInterval: 3000,
      ...options
    }
    this.connect()
    this.heartbeatInterval = window.setInterval(() => {
      if (this.eventSource?.readyState === EventSource.OPEN) {
        // send heartbeat
      }
    }, 15000)
  }

  private connect() {
    if (this.eventSource) {
      this.close()
    }

    try {
      this.eventSource = new EventSource(this.options.url)

      this.eventSource.onopen = (event) => {
        this.options.onOpen?.(event)
        this.state = ConnectionState.OPEN
        this.clearRetryTimer()
      }

      this.eventSource.onmessage = (event) => {
        this.options.onMessage(event.data, event)
      }

      this.eventSource.onerror = (error) => {
        this.options.onError?.(error)
        this.scheduleRetry()
      }
    } catch (error) {
      console.error('SSE connection error:', error)
      // this.scheduleRetry()
    }
  }

  private scheduleRetry() {
    this.clearRetryTimer()
    this.retryTimer = window.setTimeout(() => {
      this.connect()
    }, this.options.retryInterval)
  }

  private clearRetryTimer() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
  }

  private clearHeartbeatInterval() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  public close() {
    this.clearRetryTimer()
    this.clearHeartbeatInterval()
    this.state = ConnectionState.CLOSED
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}
