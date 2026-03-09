import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import bridge from '@/components/common/bridge'

interface SubmittedModalProps {
  open: boolean
  onClose?: () => void
  className?: string
}

export default function SubmittedModal({ open, onClose = () => bridge.goBack(), className }: SubmittedModalProps) {
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
      <div
        className={cn(
          'fixed inset-0 z-50 bg-[#999]/30 transition-all duration-300 ease-out',
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        )}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 mx-auto flex max-w-[322px] items-center justify-center p-4 text-base text-black">
        <div
          className={cn(
            'shadow-lg w-full max-w-sm rounded-[42px] bg-[#F5F5F5] p-4 transition-all duration-300 ease-out',
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
        >
          <h2 className="mb-3 text-center font-bold leading-tight text-black">Task Already Completed</h2>
          <p className="mb-4 text-center leading-relaxed text-black">
            This task has been completed and cannot be submitted again.
          </p>

          <button onClick={onClose} className="h-[48px] w-full rounded-full bg-black font-semibold text-white">
            Back
          </button>
        </div>
      </div>
    </>
  )
}
