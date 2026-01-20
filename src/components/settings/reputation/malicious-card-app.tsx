import { cn } from '@udecode/cn'
import { Info } from 'lucide-react'

import { Icon5App } from './icons-app'

export interface MaliciousCardAppProps {
  score?: number
  className?: string
  onInfoClick?: () => void
}

export default function MaliciousCardApp({ score = 0, className, onInfoClick }: MaliciousCardAppProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-3xl p-4 text-[#FF4D4F] shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
        className
      )}
      style={{
        background:
          'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)) padding-box, linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.2) 50%, #FFFFFF 100%) border-box',
        border: '1.5px solid transparent'
      }}
    >
      <div className="flex items-center gap-3">
        <Icon5App />
        <span className="font-bold text-[#1C1C26]">Malicious Behavior</span>
        <Info
          className="size-4 text-[#BBBBBE]"
          onClick={(e) => {
            e.stopPropagation()
            onInfoClick?.()
          }}
        />
      </div>
      <div className="text-2xl font-semibold text-[#FF9072]">{score !== 0 ? `-${Math.abs(score)}` : '0.0'}</div>
    </div>
  )
}
