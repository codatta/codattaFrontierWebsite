import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import { X } from 'lucide-react'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  title?: string | React.ReactNode
  content: string | React.ReactNode
  className?: string
}

export default function InfoModal({ open, onClose, title = 'Fashion', content, className }: InfoModalProps) {
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
          'fixed inset-0 z-50 bg-[#999]/30 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        )}
        onClick={onClose}
      />

      {/* Modal with scale and fade animation */}
      <div className="fixed inset-0 z-50 mx-auto flex max-w-[390px] items-center justify-center p-4 text-black">
        <div
          className={cn(
            'relative w-full max-w-sm rounded-[26px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all duration-300 ease-out',
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm transition-all hover:bg-[#f9f9f950]"
          >
            <X size={20} className="text-[#1F2937]" />
          </button>

          {/* Title with icon */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
          </div>

          {/* Content */}
          <div className="text-sm leading-relaxed text-[#6B7280]">{content}</div>
        </div>
      </div>
    </>
  )
}
