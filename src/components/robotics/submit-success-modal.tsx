import { Modal } from 'antd'
import CoinSvgImage from '@/assets/common/coin.svg'

export default function SubmitSuccessModal(props: {
  open: boolean
  points: number
  onClose: () => void
}) {
  const { open, points, onClose } = props

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onClose={onClose}
      footer={null}
      centered
      className="max-w-[386px]"
    >
      <div className="flex flex-col items-center justify-center text-white">
        <img className="mb-2" src={CoinSvgImage} alt="" />
        <h1 className="mb-1 text-lg font-bold">{points} Points Awarded!</h1>
        <p className="text-center text-sm font-thin">
          Other rewards will issue automatically after answer verification.
        </p>
      </div>
    </Modal>
  )
}
