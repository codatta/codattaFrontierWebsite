import { useCallback } from 'react'
import { proxy, useSnapshot } from 'valtio'

interface ToastState {
  message: string
  visible: boolean
  timeoutId?: ReturnType<typeof setTimeout>
}

const toastState = proxy<ToastState>({
  message: '',
  visible: false
})

const showToast = (message: string, duration: number = 2000) => {
  if (toastState.timeoutId) {
    clearTimeout(toastState.timeoutId)
  }

  toastState.message = message
  toastState.visible = true

  toastState.timeoutId = setTimeout(() => {
    toastState.visible = false
    toastState.message = ''
  }, duration)
}

export function useGlobalToast() {
  const state = useSnapshot(toastState)
  return {
    state,
    show: useCallback((message: string, duration?: number) => {
      showToast(message, duration)
    }, [])
  }
}
