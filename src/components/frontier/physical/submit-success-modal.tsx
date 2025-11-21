import { Modal } from 'antd'
import underReviewSvgImage from '@/assets/icons/circle-under-review.svg'

export default function SubmitSuccessModal(props: { open: boolean; points: number; onClose: () => void }) {
  const { open, points, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[400px]">
      <div className="flex flex-col items-center justify-center p-6 text-white">
        <img className="mb-2" src={underReviewSvgImage} alt="" />
        <h1 className="mb-1 text-lg font-bold">{points} Points Awarded!</h1>
        <p className="text-center text-sm font-thin leading-[22px]">
          The acceptance status will be updated in your history in 15 days.
        </p>
        <p className="text-center text-sm font-thin leading-[22px]">
          Rewards for accepted submissions will be distributed directly to your account.
        </p>
      </div>
    </Modal>
  )
}
