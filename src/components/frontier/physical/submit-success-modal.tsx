import { Modal } from 'antd'
import CoinSvgImage from '@/assets/common/coin.svg'

export default function SubmitSuccessModal(props: { open: boolean; points: number; onClose: () => void }) {
  const { open, points, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <img className="mb-2" src={CoinSvgImage} alt="" />
        <h1 className="mb-1 text-lg font-bold">{points} Points Awarded!</h1>
        <p className="text-center text-sm font-thin">
          The acceptance status will be updated in your history after Airdrop Round 2 ends.
        </p>
        <p className="text-center text-sm font-thin">
          Rewards for accepted submissions will be distributed directly to your account.
        </p>
      </div>
    </Modal>
  )
}
