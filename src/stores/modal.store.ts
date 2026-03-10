import { proxy, useSnapshot } from 'valtio'

export type ModalPayload = {
  id?: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  content: string
}

type ModalState = {
  modal: ModalPayload | null
}

const state = proxy<ModalState>({
  modal: null
})

export function useModalStore() {
  return useSnapshot(state)
}

export const modalStoreActions = {
  openModal(payload: ModalPayload) {
    state.modal = payload
  },
  closeModal() {
    state.modal = null
  }
}
