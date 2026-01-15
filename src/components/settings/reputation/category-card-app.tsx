import React from 'react'
import { Info } from 'lucide-react'
import { cn } from '@udecode/cn'

export interface CategoryCardAppProps {
  icon: React.ReactNode
  title: string
  score?: number | null
  metrics: {
    label: string
    value: string | number
    subValue?: string | number
    unit?: string
    subLabel?: string
  }
  progress: {
    current: number
    total: number
  }
  buttonText: string
  onButtonClick?: () => void
  onInfoClick?: () => void
  buttonDisabled?: boolean
}

export default function CategoryCardApp({
  icon,
  title,
  score,
  metrics,
  progress,
  buttonText,
  onButtonClick,
  onInfoClick,
  buttonDisabled
}: CategoryCardAppProps) {
  const progressPercent = Math.min((progress.current / progress.total) * 100, 100)

  return (
    <div className="rounded-3xl bg-white p-4 text-[#1C1C26] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="flex items-center gap-1 font-bold">
            {title}
            {onInfoClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onInfoClick()
                }}
              >
                <Info className="size-4 text-[#BBBBBE]" />
              </button>
            )}
          </span>
        </div>
        <div className="text-lg font-bold text-[#58E6F3]">
          {score === undefined || score === null ? '--' : `+${score}`}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-[#8E8E93]">
        <div className="flex gap-1">
          <span>{metrics.label}</span>
          {metrics.subLabel && (
            <span className="ml-2">
              {metrics.subLabel}:{metrics.subValue}
            </span>
          )}
        </div>
        {!metrics.subLabel && (
          <div>
            <span>{metrics.value}</span>
            {metrics.subValue !== undefined && <span>/{metrics.subValue}</span>}
            {metrics.unit && <span>{metrics.unit}</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#F2F2F7]">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(90deg,#58E6F3,#79A5FC)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={cn(
            'h-8 rounded-full px-4 text-xs font-medium transition-colors',
            buttonDisabled ? 'bg-[#F2F2F7] text-[#BBBBBE]' : 'bg-[#1C1C26] text-white hover:bg-[#2C2C36]'
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
