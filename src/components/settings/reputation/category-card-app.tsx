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
  progress?: {
    current: number
    total: number
  }
  buttonText?: string
  onButtonClick?: () => void
  onInfoClick?: () => void
  buttonDisabled?: boolean
  metricsLayout?: 'default' | 'split'
  progressVariant?: 'gradient' | 'contrast'
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
  buttonDisabled,
  metricsLayout = 'default',
  progressVariant = 'gradient'
}: CategoryCardAppProps) {
  const progressPercent = progress ? Math.min((progress.current / progress.total) * 100, 100) : 0

  return (
    <div
      className="rounded-3xl p-4 text-[#1C1C26] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
      style={{
        background:
          'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)) padding-box, linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.2) 50%, #FFFFFF 100%) border-box',
        border: '1.5px solid transparent'
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span
            className="flex items-center gap-1 font-bold"
            onClick={(e) => {
              e.stopPropagation()
              onInfoClick?.()
            }}
          >
            {title}
            {onInfoClick && <Info className="size-4 text-[#BBBBBE]" />}
          </span>
        </div>
        <div className="text-2xl font-semibold text-[#40E1EF]">
          {score === undefined || score === null ? '--' : score === 0 ? '0.0' : `+${score.toFixed(1)}`}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-[#8E8E93]">
        {metricsLayout === 'split' ? (
          <>
            <span>
              {metrics.label}:{metrics.value}
            </span>
            {metrics.subLabel && (
              <span>
                {metrics.subLabel}:{metrics.subValue}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="flex gap-1">
              <span>
                {metrics.label}
                {metrics.subLabel ? `: ${metrics.value}` : ''}
              </span>
              {metrics.subLabel && (
                <span className="ml-2">
                  {metrics.subLabel}: {metrics.subValue}
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
          </>
        )}
      </div>

      <div
        className="relative h-2 flex-1 overflow-hidden rounded-full"
        style={{ backgroundColor: progressVariant === 'contrast' ? 'black' : '#F2F2F7' }}
      >
        <div
          className={cn('absolute left-0 top-0 h-full', progressVariant !== 'contrast' && 'rounded-full')}
          style={{
            width: `${progressPercent}%`,
            background:
              progressVariant === 'contrast'
                ? '#40E1EF'
                : 'linear-gradient(90deg, #40E1EF 0%, rgba(64, 225, 239, 0.12) 100%)'
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className={cn(
            'flex h-9 w-[76px] items-center justify-center rounded-full text-base font-medium shadow-[0px_1px_4px_rgba(0,0,0,0.12),0px_0px_1px_rgba(0,0,0,0.1)] transition-colors',
            buttonDisabled ? 'bg-white text-[#D9D9D9]' : 'bg-black text-white hover:bg-black/80'
          )}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
