import { Info } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface HintTooltipProps {
  hintText: string
  tooltipContent: string
  className?: string
}

export default function HintTooltip({ hintText, tooltipContent, className = '' }: HintTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  const handleContainerClick = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div ref={containerRef} className={`relative inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm text-white/70">{hintText}</span>
      <div className="relative">
        <button
          onClick={handleContainerClick}
          className="flex items-center justify-center transition-colors hover:text-white/50"
        >
          <Info size={16} className="text-white/30" />
        </button>

        {isVisible && (
          <div className="absolute left-0 top-6 z-50 min-w-[200px] rounded-lg border border-[#875DFF] bg-[#1C1C26] p-3 shadow-lg">
            <div className="text-xs leading-relaxed text-white/70">{tooltipContent}</div>
            <div className="absolute -top-1 left-2 h-2 w-2 rotate-45 border-l border-t border-[#875DFF] bg-[#1C1C26]"></div>
          </div>
        )}
      </div>
    </div>
  )
}
