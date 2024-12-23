import { createRoot } from 'react-dom/client'
import ExtensionGuideModal from '@/components/task/extension-guide-modal'
import TelegramGuideModal from '@/components/task/telegram-guide-modal'

const domId = 'quest-complete-modal-' + window.crypto.getRandomValues(new Uint32Array(1))[0]
let rootdom: HTMLDivElement | null = null

export const QUEST_TMA_TASK_IDS = ['DUAL-END-VALIDATION', 'DUAL-END-LOGIN', 'WATCH-ADS-COMPLETE', 'SIGN-IN-WITH_OKX']
export const QUEST_TASK_TARGET_IDS = ['MANTA-QUEST-VALIDATION', 'MANTA-SUBMISSION-HUM']

function showTelegramGuideModal(schema: string, callback?: () => void) {
  rootdom = document.createElement('div')
  rootdom.setAttribute('id', domId)
  document.body.appendChild(rootdom)
  const root = createRoot(rootdom)
  root.render(<TelegramGuideModal onClose={callback} tmaLink={schema} root={rootdom}></TelegramGuideModal>)
}

function showExtensionGuideModal() {
  rootdom = document.createElement('div')
  rootdom.setAttribute('id', domId)
  document.body.appendChild(rootdom)
  const root = createRoot(rootdom)
  root.render(<ExtensionGuideModal></ExtensionGuideModal>)
}

function unMountCompleteModal() {
  if (rootdom) document.body.removeChild(rootdom)
  rootdom = null
}

export const questStoreActions = {
  showTelegramGuideModal,
  unMountCompleteModal,
  showExtensionGuideModal
}
