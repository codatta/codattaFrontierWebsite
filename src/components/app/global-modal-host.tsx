import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { appStoreActions, useAppStore } from '@/stores/app.store'
import { Modal } from 'antd'

export default function GlobalModalHost() {
  const { modal } = useAppStore()

  useEffect(() => {
    function handleClickAnywhere() {
      if (modal) appStoreActions.closeModal()
    }
    document.addEventListener('mousedown', handleClickAnywhere)
    return () => document.removeEventListener('mousedown', handleClickAnywhere)
  }, [modal])

  if (!modal) return null

  return createPortal(
    <Modal open={true} footer={null} maskClosable={false} closable={false}>
      <div className="flex flex-col items-center gap-2">
        {modal.type === 'error' && (
          <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.6" cx="60.5" cy="60" r="60" fill="#D92B2B" fill-opacity="0.12" />
            <circle cx="60.5" cy="60" r="40" fill="#D92B2B" fill-opacity="0.12" />
            <path
              d="M79.1543 39.0547C80.3344 39.0549 81.3359 40.0333 81.3359 41.2402V62.7168C79.8674 62.035 78.2315 61.6523 76.5059 61.6523C70.1621 61.6523 65.0195 66.7949 65.0195 73.1387C65.0195 75.1379 65.5316 77.0171 66.4297 78.6543H39.5176C38.3374 78.6541 37.3359 77.6756 37.3359 76.4688V41.2402C37.3359 40.0338 38.3126 39.0549 39.5176 39.0547H79.1543ZM41.7363 43.4551V74.2549H59.3359V43.4551H41.7363ZM57.1357 54.4551V58.8545H43.9355V54.4551H57.1357ZM57.1357 47.8545V52.2549H43.9355V47.8545H57.1357Z"
              fill="white"
            />
            <path
              d="M83.6648 78.042L79.3307 73.7079L83.6648 69.3738L80.7754 66.4844L76.4413 70.8185L72.1072 66.4844L69.2178 69.3738L73.5519 73.7079L69.2178 78.042L72.1072 80.9314L76.4413 76.5973L80.7754 80.9314L83.6648 78.042Z"
              fill="white"
            />
          </svg>
        )}
        <div className="text-center text-2xl font-bold">{modal.title}</div>
        <div className="mb-6 whitespace-pre-wrap text-center">{modal.content}</div>
        <button className="w-[240px] rounded-full bg-white py-2 text-black">OK</button>

        {/* <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-[1001] min-w-[280px] max-w-[90vw] rounded-lg bg-[#1C1C26] p-4 text-white shadow-xl">
        {modal.title ? <div className="mb-2 font-semibold">{modal.title}</div> : null}
        {modal.content}
        </div>
        </div> */}
      </div>
    </Modal>,
    document.body
  )
}
