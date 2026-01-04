import { X, Mail, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@udecode/cn'

interface CommercialAccessDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CommercialAccessDrawer({ open, onClose }: CommercialAccessDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [copied, setCopied] = useState(false)

  const email = 'support@codatta.io'

  // Handle drawer visibility and animations
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Drawer with slide-up animation */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-[26px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out',
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="p-6 pb-20">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="size-[44px]"></div>
            <h2 className="text-xl font-bold text-black">Commercial Access</h2>
            <button
              onClick={onClose}
              className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] text-black shadow-app-btn backdrop-blur-sm transition-colors hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Description */}
          <p className="mb-6 text-center text-[15px] text-[#999999]">
            Need full rights or enterprise-grade support? Contact our sales team for a custom quote.
          </p>

          {/* Email Input Field */}
          <div className="relative flex items-center rounded-[12px] border border-[#40E1EF] bg-white px-4 py-3">
            <Mail className="mr-3 size-5 text-[#40E1EF]" />
            <span className="flex-1 text-[15px] text-black">{email}</span>
            <button
              onClick={handleCopy}
              className="ml-3 flex items-center justify-center transition-opacity hover:opacity-70"
            >
              {copied ? (
                <span className="text-sm text-[#40E1EF]">Copied!</span>
              ) : (
                <Copy className="size-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
