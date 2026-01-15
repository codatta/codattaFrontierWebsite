import { Modal } from 'antd'
import { X } from 'lucide-react'

interface IdentityModalAppProps {
  open: boolean
  onClose: () => void
}

export default function IdentityModalApp({ open, onClose }: IdentityModalAppProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      centered
      width={300}
      styles={{
        content: {
          padding: 0,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <div className="p-6 text-center">
        <div className="mb-2 text-lg font-bold text-[#1C1C26]">Identity</div>
        <div className="mb-6 text-sm text-[#8E8E93]">
          Verify your social accounts
          <br />
          (Email, X, Telegram, Discord).
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full bg-[#F2F2F7] px-3 py-1.5">
            <button onClick={onClose} className="rounded-full bg-[#1C1C26] p-1">
              <X className="size-3 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 font-bold text-[#58E6F3]">+7.5</div>
          <button disabled className="h-9 w-20 rounded-full bg-[#F2F2F7] font-medium text-[#BBBBBE]">
            Go
          </button>
        </div>
      </div>
    </Modal>
  )
}
