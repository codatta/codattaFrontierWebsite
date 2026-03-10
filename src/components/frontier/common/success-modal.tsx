import { cn } from '@udecode/cn'
import CoinStarImage from '@/assets/common/coin-stars.png'
import { useDrawerAnimation } from '@/hooks/use-drawer-animation'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
  points?: number
  buttonText?: string
  className?: string
}

export default function SuccessModal({
  open,
  onClose,
  title = 'Successful',
  message = 'Your submission has been received successfully.',
  points,
  buttonText = 'Got it',
  className
}: SuccessModalProps) {
  const { isVisible, isAnimating } = useDrawerAnimation(open)

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-[#999]/30 transition-all duration-300 ease-out',
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        )}
        onClick={onClose}
      />

      {/* Modal with scale and fade animation */}
      <div className="fixed inset-0 z-50 mx-auto flex max-w-[322px] items-center justify-center p-4 text-black">
        <div
          className={cn(
            'w-full max-w-sm rounded-[42px] bg-white/60 p-6 shadow-app-btn backdrop-blur-md transition-all duration-300 ease-out',
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
        >
          {/* Success Icon */}
          <div className="mb-4 flex justify-center">
            <img className="mt-[-60px] w-[150px]" src={CoinStarImage}></img>
          </div>

          {/* Content */}
          {points !== undefined && points > 0 ? (
            <>
              <h2 className="mb-2 text-center text-base font-semibold">
                <span className="text-[42px] font-bold leading-[42px] text-[#40E1EF]">+{points}</span>Points
              </h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Other rewards will issue automatically after answer verification.
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-center text-2xl font-bold">{title}</h2>
              <p className="mb-6 text-center text-sm text-gray-600">{message}</p>
            </>
          )}

          {/* Button */}
          <button onClick={onClose} className="w-full rounded-full bg-black py-3 text-white">
            {buttonText}
          </button>
        </div>
      </div>
    </>
  )
}
