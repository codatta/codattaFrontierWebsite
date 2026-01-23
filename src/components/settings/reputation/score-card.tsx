import { cn } from '@udecode/cn'

import ReputationIcon from '@/assets/userinfo/reputation-icon.svg?react'
import background from '@/assets/userinfo/reputation-bg.png'

interface ScoreCardProps {
  score?: number | null
  className?: string
}

export default function ScoreCard({ score, className }: ScoreCardProps) {
  return (
    <div
      className={cn(
        'bg-left-center relative flex min-w-[230px] items-center overflow-hidden rounded-xl bg-repeat-x px-8 py-6 text-white',
        className
      )}
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'auto 100%' }}
    >
      <div className="relative z-10 flex items-center gap-3">
        <ReputationIcon className="size-[94px]" />

        <div className="font-bold">
          <div className="text-lg">Your Reputation</div>
          <div className="text-[64px] leading-[1em]">{score ?? '--'}</div>
        </div>
      </div>

      {/* Icon placeholder - replace with actual image/icon if available */}
    </div>
  )
}
