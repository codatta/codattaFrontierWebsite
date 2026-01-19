import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ToastState {
  message: string
  visible: boolean
  timeoutId?: NodeJS.Timeout
}

let globalToastState: ToastState = {
  message: '',
  visible: false
}

const listeners = new Set<(state: ToastState) => void>()

const showToast = (message: string, duration: number = 2000) => {
  // Clear existing timeout
  if (globalToastState.timeoutId) {
    clearTimeout(globalToastState.timeoutId)
  }

  // Show new toast
  globalToastState = {
    message,
    visible: true
  }

  listeners.forEach((listener) => listener(globalToastState))

  // Auto hide after duration
  const timeoutId = setTimeout(() => {
    globalToastState = {
      message: '',
      visible: false
    }
    listeners.forEach((listener) => listener(globalToastState))
  }, duration)

  globalToastState.timeoutId = timeoutId
}

export function useAppToast() {
  const [state, setState] = useState<ToastState>(globalToastState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  return {
    show: useCallback((message: string, duration?: number) => {
      showToast(message, duration)
    }, []),
    state
  }
}

export function AppToastContainer() {
  const { state } = useAppToast()

  if (!state.visible) return null

  return createPortal(
    <div
      className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        animation: 'none'
      }}
    >
      <div
        className="relative flex h-[38px] items-center justify-center whitespace-nowrap rounded-lg px-6"
        style={{
          background: 'rgba(51, 51, 51, 0.8)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0px 10px 6px rgba(0, 0, 0, 0.02), 0px 17px 7px rgba(0, 0, 0, 0.01)',
          minWidth: '134px'
        }}
      >
        <span className="text-sm font-normal leading-5 text-white">{state.message}</span>
      </div>
    </div>,
    document.body
  )
}
