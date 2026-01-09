import { ChevronLeft, ArrowUp } from 'lucide-react'

interface MobileAppFrontierHeaderProps {
  title: string | React.ReactNode
  canSubmit: boolean
  showSubmitButton: boolean
  onBack?: () => void
  onSubmit?: () => void
}

export default function MobileAppFrontierHeader(props: MobileAppFrontierHeaderProps) {
  const { title, canSubmit, showSubmitButton, onBack, onSubmit } = props

  return (
    <div className="text-black">
      <div className="h-[76px]"></div>
      <div className="fixed top-0 z-10 grid w-full grid-cols-[44px_1fr_44px] bg-gradient-to-b from-[#F8F8F8] via-[#F8F8F8BB] to-[#F8F8F800] p-4 text-[17px]">
        <button
          onClick={onBack}
          className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
        >
          <ChevronLeft size={24}></ChevronLeft>
        </button>
        <div className="flex items-center justify-center">{title}</div>
        {showSubmitButton && (
          <button
            className="flex size-[44px] items-center justify-center rounded-full bg-[#40E1EF]/90 text-white shadow-app-btn backdrop-blur-sm transition-all disabled:bg-black/5 disabled:text-[#bbb]"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            <ArrowUp size={24}></ArrowUp>
          </button>
        )}
      </div>
    </div>
  )
}
