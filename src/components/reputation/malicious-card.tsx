import { AlertTriangle } from 'lucide-react'
import { cn } from '@udecode/cn'

interface MaliciousCardProps {
  score?: number | null
  description: string
  className?: string
}

export default function MaliciousCard({ score, description, className }: MaliciousCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border border-[#FFFFFF1F] bg-[#1C1C26] p-6',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#FFA043] text-black">
          <AlertTriangle size={24} fill="currentColor" strokeWidth={2} />
        </div>
        <div>
          <div className="mb-1 text-lg font-bold text-white">Malicious Behavior</div>
          <div className="text-xs text-[#BBBBBE]">{description}</div>
        </div>
      </div>
      <div className="rounded-full bg-[#FFFFFF1F] px-3 text-2xl font-semibold leading-[44px] text-white">
        {score === undefined || score === null ? '--' : <>{score === 0 ? '0' : `-${Math.abs(score).toFixed()}`}</>}
      </div>
    </div>
  )
}
