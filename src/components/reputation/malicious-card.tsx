import { AlertTriangle } from 'lucide-react'
import { cn } from '@udecode/cn'

interface MaliciousCardProps {
  score: number
  description: string
  className?: string
}

export default function MaliciousCard({ score, description, className }: MaliciousCardProps) {
  return (
    <div
      className={cn('flex items-center justify-between rounded-2xl border border-white/5 bg-[#1C1C26] p-6', className)}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#FFA043] text-black">
          <AlertTriangle size={24} fill="currentColor" strokeWidth={2} />
        </div>
        <div>
          <div className="text-lg font-bold text-white">Malicious Behavior</div>
          <div className="text-sm text-gray-400">{description}</div>
        </div>
      </div>
      <div className="rounded-full bg-[#3A2E2E] px-4 py-2 text-xl font-bold text-white">
        -{Math.abs(score).toFixed(1)}
      </div>
    </div>
  )
}
