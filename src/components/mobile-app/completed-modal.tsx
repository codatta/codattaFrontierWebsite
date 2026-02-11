import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import bridge from '@/components/mobile-app/bridge'

interface CompletedModalProps {
  open: boolean
  onBack?: () => void
}

export default function CompletedModal({ open, onBack }: CompletedModalProps) {
  const handleBack = onBack || (() => bridge.goBack())
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
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
          'fixed inset-0 z-50 bg-[#999]/30 transition-all duration-300 ease-out',
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        )}
      />

      {/* Modal with scale and fade animation */}
      <div className="fixed inset-0 z-50 mx-auto flex max-w-[322px] items-center justify-center p-4 text-black">
        <div
          className={cn(
            'w-full max-w-sm rounded-[42px] bg-white/60 p-6 shadow-app-btn backdrop-blur-md transition-all duration-300 ease-out',
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          {/* Content */}
          <h2 className="mb-2 text-[20px] font-bold">Task Already Completed</h2>
          <p className="mb-6 text-[15px] text-[#666666]">This task has been completed and cannot be submitted again.</p>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="w-full rounded-full bg-black py-3 text-[17px] font-semibold text-white"
          >
            Back
          </button>
        </div>
      </div>
    </>
  )
}
