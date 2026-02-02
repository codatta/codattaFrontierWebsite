import React, { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'

interface BottomDrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  className?: string
}

export default function BottomDrawer({ open, onClose, children, className }: BottomDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle drawer visibility and animations
  useEffect(() => {
    if (open) {
      // Show the drawer
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
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Drawer with slide-up animation */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-[26px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out',
          isAnimating ? 'translate-y-0' : 'translate-y-full',
          className
        )}
      >
        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-5 pb-4">{children}</div>
      </div>
    </>
  )
}
