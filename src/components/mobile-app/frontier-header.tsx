import { ChevronLeft, ArrowUp } from 'lucide-react'
import { cn } from '@udecode/cn'
import { ReactNode } from 'react'

interface MobileAppFrontierHeaderProps {
  title: string | React.ReactNode
  onBack?: () => void
  onSubmit?: () => void
  submitDisabled?: boolean
  transparent?: boolean
  rightIcon?: ReactNode
  onRightIconClick?: () => void
  rightIconBackground?: boolean
  onHelp?: () => void
}

export default function MobileAppFrontierHeader(props: MobileAppFrontierHeaderProps) {
  const {
    title,
    onBack,
    onSubmit,
    submitDisabled,
    transparent,
    rightIcon,
    onRightIconClick,
    rightIconBackground,
    onHelp
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

  const finalRightIcon = onHelp ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.1901 14.0736C13.2303 13.953 13.4582 13.4959 14.6841 12.6753C16.6602 11.3506 17.5444 9.45805 17.1777 7.34461C16.8059 5.2094 15.0657 3.45615 12.9456 3.0827C11.3965 2.80805 9.8274 3.22489 8.63503 4.223C7.43094 5.23283 6.74121 6.71484 6.74121 8.29071C6.74121 8.98402 7.3039 9.54671 7.99722 9.54671C8.69053 9.54671 9.25322 8.98402 9.25322 8.29071C9.25322 7.46007 9.61658 6.67836 10.2496 6.14748C10.8793 5.61996 11.6829 5.40392 12.5085 5.55464C13.5904 5.74556 14.5132 6.67827 14.7041 7.7735C14.7761 8.18715 14.9956 9.44304 13.2858 10.5868C11.9008 11.5163 11.1137 12.3687 10.8106 13.273C10.5895 13.9312 10.9444 14.6428 11.6025 14.8639C11.7348 14.9091 11.8688 14.9293 12.0011 14.9293C12.5236 14.9293 13.0126 14.5977 13.1901 14.0736ZM13.7077 19.3253C13.7077 18.4009 12.9591 17.6507 12.033 17.6507H12.0163C11.0919 17.6507 10.3498 18.4009 10.3498 19.3253C10.3498 20.2497 11.1086 21 12.033 21C12.9575 21 13.7077 20.2497 13.7077 19.3253Z"
        fill="#40E1EF"
      />
    </svg>
  ) : (
    rightIcon
  )

  const handleRightIconClick = onHelp || onRightIconClick

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
        <div className="flex items-center justify-center gap-1">{title}</div>
        {onSubmit ? (
          <button
            className="flex size-[44px] items-center justify-center rounded-full bg-[#40E1EF]/90 text-white shadow-app-btn backdrop-blur-sm transition-all disabled:bg-black/5 disabled:text-[#bbb]"
            disabled={submitDisabled}
            onClick={onSubmit}
          >
            <ArrowUp size={24}></ArrowUp>
          </button>
        ) : finalRightIcon ? (
          <button
            onClick={handleRightIconClick}
            className={cn(
              'flex size-[44px] items-center justify-center',
              (rightIconBackground || !!onHelp) && 'rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm'
            )}
          >
            {finalRightIcon}
          </button>
        ) : (
          <div className="w-[44px]" />
        )}
      </div>
    </div>
  )
}
