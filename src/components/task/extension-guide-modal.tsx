import { ConfigProvider, Modal } from 'antd'
import CallExtensionImage1 from '@/assets/quest/call-extension-1.png'
import CallExtensionImage2 from '@/assets/quest/call-extension-2.png'
import AntdTheme from '@/styles/antd.theme'
import { useState } from 'react'

export default function ExtensionGuideModal() {
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
        <h1 className="mb-6 text-lg font-bold">Open extension to start submission</h1>
        <div className="">
          <h2 className="mb-2">1. Click at the top right of your browser and pin codatta clip for easy access</h2>
          <img src={CallExtensionImage1} className="mb-6 w-full rounded-2xl border" alt="" />

          <h2 className="mb-2">
            2. Right-click on any webpage and select 'Create Submission' to quickly open the extension
          </h2>
          <img src={CallExtensionImage2} className="w-full rounded-2xl border" alt="" />
        </div>
      </Modal>
    </ConfigProvider>
  )
}
