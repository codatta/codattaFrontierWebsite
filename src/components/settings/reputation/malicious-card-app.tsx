import { Info } from 'lucide-react'
import { cn } from '@udecode/cn'

export interface MaliciousCardAppProps {
  score?: number | null
  className?: string
}

export default function MaliciousCardApp({ score, className }: MaliciousCardAppProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl bg-white p-4 text-[#FF4D4F] shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF4D4F]/10">
          <Info className="size-6 text-[#FF4D4F]" />
        </div>
        <span className="font-bold text-[#1C1C26]">Malicious Behavior</span>
        <Info className="size-4 text-[#BBBBBE]" />
      </div>
      <div className="font-bold text-[#FF4D4F]">{score ? `-${Math.abs(score)}` : '-0.5'}</div>
    </div>
  )
}
