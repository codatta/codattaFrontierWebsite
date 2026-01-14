import { Button } from 'antd'
import { cn } from '@udecode/cn'
import { ReactNode } from 'react'

export interface CategoryCardProps {
  icon: ReactNode
  title: string
  score?: number | null
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
    <div
      className={cn('flex min-w-[528px] flex-col rounded-3xl border border-[#875DFF1F] bg-[#252532] p-6', className)}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white">{icon}</div>
          <span className="text-lg font-bold text-white">{title}</span>
        </div>
        <div className="rounded-full bg-[#875DFF33]/20 px-3 text-2xl font-semibold leading-9 text-[#875DFF]">
          {score === undefined || score === null ? (
            '--'
          ) : (
            <>
              {score > 0 ? '+' : ''}
              {score.toFixed(1)}
            </>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-base">
        <span className="text-white">{metrics.label}</span>
        <div className="text-white">
          <span>{metrics.value}</span>
          {metrics.subValue && <span>/{metrics.subValue}</span>}
        </div>
      </div>

      <div className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(90deg,#58E6F3,#79A5FC,#D35BFC,#FEBCCC)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <Button
        block
        className="mb-3 h-9 rounded-lg border-none bg-white font-medium text-[#1C1C26] hover:!bg-[#1C1C26] hover:!text-white"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>

      <div className="text-center text-xs text-[#BBBBBE]">{description}</div>
    </div>
  )
}
