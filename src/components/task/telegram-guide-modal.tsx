import { ReactEventHandler, useRef, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import QRCode from 'qrcode.react'
import { Base64 } from 'js-base64'
import { ConfigProvider, Modal } from 'antd'
import AntdTheme from '@/styles/antd.theme'

const TG_BOT_NAME = import.meta.env.VITE_TG_BOT_NAME

export default function TelegramGuideModal(props: { onClose?: () => void; tmaLink: string; root: HTMLDivElement }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { tmaLink, root } = props
  const [open, setOpen] = useState(true)

  const startParam = Base64.encodeURI(tmaLink || 'tma://app')
  const showLink = `https://t.me/${TG_BOT_NAME}/app?startapp=${startParam}`

  const clearDom = () => {
    setOpen(false)
    setTimeout(() => {
      if (root) document.body.removeChild(root)
      if (props.onClose) props.onClose()
    }, 500)
  }

  const closeModal: ReactEventHandler<HTMLSpanElement> = (event) => {
    event.stopPropagation()
    clearDom()
  }

  if (root) {
    root.addEventListener('click', (event) => {
      if (!event.target) return
      const node = event.target as HTMLElement
      if (contentRef.current?.contains(node)) clearDom()
    })
  }

  return (
    <ConfigProvider theme={AntdTheme}>
      <Modal
        centered
        open={open}
        footer={null}
        width={'100%'}
        closable={false}
        onCancel={() => setOpen(false)}
        className="[&>.ant-modal-content]:bg-transparent"
        classNames={{
          body: 'p-0',
          wrapper: 'backdrop-blur-sm',
          content: 'p-0 !bg-white/0'
        }}
      >
        {/* <div className="h-screen w-screen"></div> */}
        <div ref={contentRef} className={`flex flex-col items-center gap-2 bg-transparent`}>
          <div className="inline-block rounded-3xl border border-white/10 bg-gray p-6">
            <div className="rounded-2xl bg-white p-4">
              <QRCode value={showLink} size={128} fgColor="#000000" />
            </div>
            <p className="mt-4 text-center text-base font-bold leading-6 text-white">Play on your mobile</p>
            <p className="mt-1 text-center text-sm leading-[22px] text-gray-300">@codatta_bot</p>
          </div>
          <a className="block rounded-full bg-black/10 px-4 py-2" href={showLink}>
            {showLink}
          </a>
          <div className="mt-2 text-center text-white">
            <CloseCircleOutlined className="size-6 cursor-pointer" onClick={closeModal} />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}
