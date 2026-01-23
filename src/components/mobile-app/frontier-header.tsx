import { ChevronLeft, ArrowUp } from 'lucide-react'
import { cn } from '@udecode/cn'
import { ReactNode } from 'react'

interface MobileAppFrontierHeaderProps {
  title: string | React.ReactNode
  canSubmit: boolean
  showSubmitButton: boolean
  onBack?: () => void
  onSubmit?: () => void
  transparent?: boolean
  rightIcon?: ReactNode
  onRightIconClick?: () => void
  rightIconBackground?: boolean
}

export default function MobileAppFrontierHeader(props: MobileAppFrontierHeaderProps) {
  const {
    title,
    canSubmit,
    showSubmitButton,
    onBack,
    onSubmit,
    transparent,
    rightIcon,
    onRightIconClick,
    rightIconBackground
  } = props

  const handleBack =
    onBack ||
    (() => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isInApp = userAgent.includes('codatta')
      if (isInApp && typeof window !== 'undefined') {
        const nativeBridge = (
          window as typeof window & { native?: { call: (method: string, ...args: unknown[]) => void } }
        ).native
        if (nativeBridge?.call) nativeBridge.call('goBack')
        else window.history.back()
      } else {
        window.history.back()
      }
    })

  return (
    <div className="text-black">
      <div className="h-[76px]"></div>
      <div
        className={`fixed top-0 z-10 grid w-full grid-cols-[44px_1fr_44px] p-4 text-[17px] ${
          transparent ? '' : 'bg-gradient-to-b from-[#F8F8F8] via-[#F8F8F8BB] to-[#F8F8F800]'
        }`}
      >
        <button
          onClick={handleBack}
          className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
        >
          <ChevronLeft size={24}></ChevronLeft>
        </button>
        <div className="flex items-center justify-center">{title}</div>
        {showSubmitButton ? (
          <button
            className="flex size-[44px] items-center justify-center rounded-full bg-[#40E1EF]/90 text-white shadow-app-btn backdrop-blur-sm transition-all disabled:bg-black/5 disabled:text-[#bbb]"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            <ArrowUp size={24}></ArrowUp>
          </button>
        ) : rightIcon ? (
          <button
            onClick={onRightIconClick}
            className={cn(
              'flex size-[44px] items-center justify-center',
              rightIconBackground && 'rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm'
            )}
          >
            {rightIcon}
          </button>
        ) : (
          <div className="w-[44px]" />
        )}
      </div>
    </div>
  )
}
