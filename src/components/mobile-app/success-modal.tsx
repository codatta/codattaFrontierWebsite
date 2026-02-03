import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import CoinStarImage from '@/assets/common/coin-stars.png'

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
  title = 'Success!',
  message = 'Your submission has been received successfully.',
  points,
  buttonText = 'OK',
  className
}: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle modal visibility and animations
  useEffect(() => {
    if (open) {
      // Show the modal
      setIsVisible(true)
      // Trigger animation after mounting
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Start closing animation
      setIsAnimating(false)
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      // Restore body scroll
      document.body.style.overflow = ''

      return () => {
        clearTimeout(timer)
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-[#999]/30 transition-all transition-opacity duration-300 ease-out',
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

          {/* Title */}
          <h2 className="mb-2 text-center text-2xl font-bold">{title}</h2>

          {/* Points (if provided) */}
          {points !== undefined && points > 0 && (
            <div className="mb-3 text-center">
              <span className="text-2xl font-bold text-[#40E1EF]">+{points}</span>
              <span className="ml-1 text-lg text-gray-600">Points</span>
            </div>
          )}

          {/* Message */}
          <p className="mb-6 text-center text-sm text-gray-600">{message}</p>

          {/* Button */}
          <button onClick={onClose} className="w-full rounded-full bg-black py-3 text-white">
            {buttonText}
          </button>
        </div>
      </div>
    </>
  )
}
