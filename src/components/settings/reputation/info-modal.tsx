import { Modal } from 'antd'

import CloseBtn from './close-btn'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: React.ReactNode
}

export default function InfoModal({ open, onClose, title, description }: InfoModalProps) {
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
        <CloseBtn onClick={onClose} className="mx-auto mt-3" />
      </>
    </Modal>
  )
}
