import { Modal, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import underReviewSvgImage from '@/assets/icons/circle-under-review.svg'

interface TaskCompleteProps {
  open?: boolean
  onClose?: () => void
}

export default function TaskComplete({ open = true }: TaskCompleteProps) {
  const navigate = useNavigate()
  const onClose = () => {
    navigate(-1)
  }
  return (
    <Modal open={open} footer={null} closable={false} centered width={400}>
      <div className="flex flex-col items-center justify-center rounded-3xl px-6 text-white">
        {/* Orange warning icon */}
        <img src={underReviewSvgImage} alt="" className="size-[72px]" />

        {/* Title */}
        <h1 className="mt-2 text-xl font-bold text-[#FFA800]">Under Review</h1>

        {/* Description */}
        <p className="mb-12 mt-2 text-center text-sm leading-[22px] text-[#BBBBBE]">
          Review results will be available in 48 hours. Approval unlocks all tasks below.
        </p>

        {/* Got it button */}
        <Button type="primary" size="large" onClick={onClose} className="h-10 w-[120px] rounded-full text-sm">
          Got it
        </Button>
      </div>
    </Modal>
  )
}
