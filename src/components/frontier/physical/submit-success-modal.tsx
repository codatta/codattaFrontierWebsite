import { Button, Modal } from 'antd'
import underReviewSvgImage from '@/assets/icons/circle-under-review.svg'

export default function SubmitSuccessModal(props: { open: boolean; points?: number; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[400px]" closeIcon={false}>
      <div className="flex flex-col items-center justify-center p-6 text-white">
        <img className="mb-2" src={underReviewSvgImage} alt="" />
        {/* <h1 className="mb-1 text-lg font-bold">{points} Points Awarded!</h1> */}
        <div className="mt-2 text-xl font-bold text-[#FFA800]">Under Review</div>
        <p className="mt-2 text-center text-sm leading-[22px] text-[#BBBBBE]">
          The acceptance status will be updated in your history in 15 days. Rewards for accepted submissions will be
          distributed directly to your account.
        </p>
        <Button onClick={onClose} type="primary" className="mt-12 h-[42px] w-[120px] rounded-full">
          Got it
        </Button>
      </div>
    </Modal>
  )
}
