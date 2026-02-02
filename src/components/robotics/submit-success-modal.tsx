import { Modal } from 'antd'
import CoinSvgImage from '@/assets/common/coin.svg'
import SuccessModalBg from '@/assets/robotics/success-modal-bg.png'
import PointsAndUSDTIcons from '@/assets/robotics/points-usdt-icons.png'

export default function SubmitSuccessModal(props: {
  open: boolean
  points?: number
  type?: 'cmu' | 'robotics' | undefined
  onClose: () => void
}) {
  const { open, points, type, onClose } = props

  return (
    <>
      {type === 'cmu' ? (
        <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[600px]">
          <div
            className="w-full rounded-3xl"
            style={{
              backgroundImage: `url(${SuccessModalBg})`,
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <img className="w-full" src={PointsAndUSDTIcons} alt="" />
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl font-bold text-primary">Congratulations!</h1>
              {points !== undefined && (
                <p className="text-sm font-thin leading-[22px] text-white">
                  You have earned <span className="font-semibold">{points} Points & 1 USD!</span>
                </p>
              )}
              <p className="mb-6 text-center text-sm font-thin leading-[22px] text-gray-700">
                <span>
                  The points will be issued to your account automatically and the cash rewards will be able to claim
                  once you complete all tasks.
                </span>
              </p>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
          <div className="flex flex-col items-center justify-center text-white">
            <img className="mb-2" src={CoinSvgImage} alt="" />
            {points !== undefined ? (
              <>
                <h1 className="mb-1 text-lg font-bold">{points} Points Awarded!</h1>
                <p className="text-center text-sm font-thin">
                  Other rewards will issue automatically after answer verification.
                </p>
              </>
            ) : (
              <>
                <h1 className="mb-1 text-lg font-bold">Submitted Successfully!</h1>
                <p className="text-center text-sm font-thin">
                  Rewards will issue automatically after answer verification.
                </p>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
