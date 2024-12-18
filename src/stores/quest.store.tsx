import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CloseCircleOutlined } from '@ant-design/icons'
import QRCode from 'qrcode.react'
import { Base64 } from 'js-base64'
import { ConfigProvider, Modal } from 'antd'
import CallExtensionImage1 from '@/assets/quest/call-extension-1.png'
import CallExtensionImage2 from '@/assets/quest/call-extension-2.png'
import AntdTheme from '@/styles/antd.theme'

const domId =
  'quest-complete-modal-' + window.crypto.getRandomValues(new Uint32Array(1))[0]
const TG_BOT_NAME = import.meta.env.VITE_TG_BOT_NAME
let rootdom: HTMLDivElement | null = null

export const QUEST_TMA_TASK_IDS = [
  'DUAL-END-VALIDATION',
  'DUAL-END-LOGIN',
  'WATCH-ADS-COMPLETE',
  'SIGN-IN-WITH_OKX'
]
export const QUEST_TASK_TARGET_IDS = [
  'MANTA-QUEST-VALIDATION',
  'MANTA-SUBMISSION-HUM'
]

function ExtensionGuideModal() {
  const [open, setOpen] = useState(true)
  return (
    <ConfigProvider theme={AntdTheme}>
      <Modal
        centered
        open={open}
        footer={null}
        width={380}
        onCancel={() => setOpen(false)}
        classNames={{
          body: 'p-0',
          wrapper: 'backdrop-blur-sm',
          content: 'p-0'
        }}
      >
        <h1 className="mb-6 text-lg font-bold">
          Open extension to start submission
        </h1>
        <div className="">
          <h2 className="mb-2">
            1. Click at the top right of your browser and pin codatta clip for
            easy access
          </h2>
          <img
            src={CallExtensionImage1}
            className="mb-6 w-full rounded-2xl border"
            alt=""
          />

          <h2 className="mb-2">
            2. Right-click on any webpage and select 'Create Submission' to
            quickly open the extension
          </h2>
          <img
            src={CallExtensionImage2}
            className="w-full rounded-2xl border"
            alt=""
          />
        </div>
      </Modal>
    </ConfigProvider>
  )
}

function CompleteModal(props: { onClose?: () => void; tmaLink: string }) {
  const contentRef = useRef(null)
  const { tmaLink } = props
  const [open, setOpen] = useState(true)

  const startParam = Base64.encodeURI(tmaLink || 'tma://app')
  const showLink = `https://t.me/${TG_BOT_NAME}/app?startapp=${startParam}`

  const clearDom = () => {
    setOpen(false)
    setTimeout(() => {
      if (rootdom) document.body.removeChild(rootdom)
      if (props.onClose) props.onClose()
      rootdom = null
    }, 500)
  }

  const closeModal = (event) => {
    event.stopPropagation()
    clearDom()
  }

  if (rootdom) {
    rootdom.addEventListener('click', (event) => {
      if (contentRef.current && contentRef.current.contains(event.target)) {
        clearDom()
      }
    })
  }

  return (
    <div className="fixed left-0 top-0 z-[1001] h-screen w-screen bg-transparent">
      <div className="ant-drawer-mask h-screen w-screen"></div>
      <div
        ref={contentRef}
        className={`absolute flex flex-col items-center gap-2 ${
          open ? 'animate-[uneZoomIn_1s]' : 'animate-[uneZoomOut_1s]'
        }`}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="inline-block rounded-3xl border border-white/10 bg-gray p-6">
          <div className="rounded-2xl bg-white p-4">
            <QRCode value={showLink} size={128} fgColor="#000000" />
          </div>
          <p className="mt-4 text-center text-base font-bold leading-6 text-white">
            Play on your mobile
          </p>
          <p className="mt-1 text-center text-sm leading-[22px] text-gray-300">
            @codatta_bot
          </p>
        </div>
        <a className="block rounded-full bg-black/10 px-4 py-2" href={showLink}>
          {showLink}
        </a>
        <div className="mt-2 text-center text-white">
          <CloseCircleOutlined
            className="size-6 cursor-pointer"
            onClick={closeModal}
          />
        </div>
      </div>
    </div>
  )
}

function showCompleteModal(schema: string, callback?: () => void) {
  rootdom = document.createElement('div')
  rootdom.setAttribute('id', domId)
  document.body.appendChild(rootdom)
  const root = createRoot(rootdom)
  root.render(
    <CompleteModal onClose={callback} tmaLink={schema}></CompleteModal>
  )
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
  showCompleteModal,
  unMountCompleteModal,
  showExtensionGuideModal
}
