import { Modal } from 'antd'
import { X } from 'lucide-react'

interface InfoModalAppProps {
  open: boolean
  onClose: () => void
  title: string
  description?: React.ReactNode
}

export default function InfoModalApp({ open, onClose, title, description }: InfoModalAppProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      centered
      width={322}
      transitionName=""
      maskTransitionName=""
      zIndex={9999}
      classNames={{
        content: '!p-0 !bg-transparent',
        mask: '!bg-[#3333333B]'
      }}
    >
      <>
        <div className="relative flex min-h-[148px] w-full flex-col items-center justify-center overflow-hidden rounded-[34px] border border-white/60 bg-white/90 p-6 text-center backdrop-blur-2xl">
          {/* Content */}
          <div className="relative z-10">
            <div className="mb-2 text-[32px] font-bold leading-10 text-[#1C1C26]">{title}</div>
            {description && <div className="text-sm font-medium leading-[18px] text-[#1C1C26]">{description}</div>}
          </div>
        </div>
        <div className="-mt-3 flex items-center justify-center">
          <CloseIcon onClick={onClose} />
        </div>
      </>
    </Modal>
  )
}

function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex size-[96px] cursor-pointer items-center justify-center" onClick={onClick}>
      <div className="flex size-[44px] items-center justify-center rounded-full bg-white backdrop-blur-[20px]">
        <X className="size-5 text-[#404040]" strokeWidth={2.5} />
      </div>
    </div>
  )
}
