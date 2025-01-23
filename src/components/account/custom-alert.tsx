import { ConfigProvider, Modal, ThemeConfig } from 'antd'
import { X } from 'lucide-react'
import AntdTheme from '@/styles/antd.theme'

export default function CustomAlert(props: {
  open: boolean
  title: string | React.ReactNode
  children: React.ReactNode
  onClose?: () => void
}) {
  const { title, children, onClose, open } = props
  const alertTheme: ThemeConfig = Object.assign({}, AntdTheme, {
    components: {
      Modal: {
        contentBg: '#1C1C26',
        borderRadius: 16,
        borderRadiusLG: 16,
        titleFontSize: 20
      }
    }
  })

  return (
    <ConfigProvider theme={alertTheme}>
      <Modal closeIcon={null} open={open} centered onCancel={onClose} footer={null}>
        <div className="mb-4 flex items-center">
          <div className="text-xl font-bold text-white">{title}</div>
          {onClose && (
            <div className="ml-auto cursor-pointer p-1" onClick={onClose}>
              <X></X>
            </div>
          )}
        </div>
        <div className="text-gray-700">{children}</div>
      </Modal>
    </ConfigProvider>
  )
}
