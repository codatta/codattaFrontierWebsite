import { Modal } from 'antd'
import { AlertCircle } from 'lucide-react'

interface EducationReviewModalProps {
  open: boolean
  onClose: () => void
}

export function EducationReviewModal({ open, onClose }: EducationReviewModalProps) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={400} closable={false} maskClosable={false}>
      <div className="flex flex-col items-center gap-2 py-6">
        {/* Icon */}
        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#FFA800]">
          <AlertCircle className="size-10 text-white" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <h3 className="text-[20px] font-bold leading-[30px] text-[#FFA800]">Under Review</h3>
          <p className="text-[14px] leading-[22px] text-[#BBBBBE]">
            Your submission is being reviewed. Please wait patiently for the results.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="rounded-full bg-[#875DFF] px-6 py-2.5 text-[14px] leading-[22px] text-white transition-opacity hover:opacity-80"
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}
