import { Button } from 'antd'
import { cn } from '@udecode/cn'
import { ReactNode } from 'react'

export interface CategoryCardProps {
  icon: ReactNode
  title: string
  score: number
  metrics: {
    label: string
    value: string | number
    subValue?: string | number
  }
  progress: {
    current: number
    total: number
    colorStart?: string
    colorEnd?: string
  }
  buttonText: string
  onButtonClick?: () => void
  description: string
  className?: string
}

export default function CategoryCard({
  icon,
  title,
  score,
  metrics,
  progress,
  buttonText,
  onButtonClick,
  description,
  className
}: CategoryCardProps) {
  const progressPercent = Math.min((progress.current / progress.total) * 100, 100)

  return (
    <div className={cn('flex flex-col rounded-2xl bg-[#1C1C26] p-6', className)}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white">{icon}</div>
          <span className="text-lg font-bold text-white">{title}</span>
        </div>
        <div className="rounded-full bg-[#875DFF]/20 px-3 py-1 text-base font-bold text-[#875DFF]">
          +{score.toFixed(1)}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white">{metrics.label}</span>
        <div className="text-white">
          <span>{metrics.value}</span>
          {metrics.subValue && <span className="text-gray-400">/{metrics.subValue}</span>}
        </div>
      </div>

      <div className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4CC9F0] to-[#875DFF]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <Button
        block
        className="mb-3 h-10 rounded-lg border-none bg-white font-semibold text-black hover:bg-gray-200"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>

      <div className="text-center text-xs text-gray-500">{description}</div>
    </div>
  )
}
