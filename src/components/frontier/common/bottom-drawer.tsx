import React from 'react'
import { cn } from '@udecode/cn'
import { useDrawerAnimation } from '@/hooks/use-drawer-animation'

interface BottomDrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  className?: string
}

export default function BottomDrawer({ open, onClose, children, className }: BottomDrawerProps) {
  const { isVisible, isAnimating } = useDrawerAnimation(open)

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
