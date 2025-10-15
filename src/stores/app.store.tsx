import { proxy, useSnapshot } from 'valtio'

export type AppModalPayload = {
  id?: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  content: string
}

type AppState = {
  modal: AppModalPayload | null
}

const state = proxy<AppState>({
  modal: null
})

export function useAppStore() {
  return useSnapshot(state)
}

export const appStoreActions = {
  openModal(payload: AppModalPayload) {
    state.modal = payload
  },
  closeModal() {
    state.modal = null
  },
  clear() {
    state.modal = null
  }
}
