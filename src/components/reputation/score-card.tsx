import { cn } from '@udecode/cn'
import ReputationRate from '@/components/common/reputation-rate'

interface ScoreCardProps {
  score: number
  className?: string
}

export default function ScoreCard({ score, className }: ScoreCardProps) {
  return (
    <div
      className={cn(
        'relative flex h-[160px] items-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#875DFF] to-[#6A40FF] px-10 text-white',
        className
      )}
    >
      {/* Background decoration - diamond shape placeholder */}
      <div className="absolute -left-10 top-1/2 size-40 -translate-y-1/2 rotate-45 bg-white/10 blur-xl"></div>

      {/* Icon placeholder - replace with actual image/icon if available */}
      <div className="relative z-10 mr-6 flex size-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
        <div className="size-16 rotate-45 bg-gradient-to-br from-white to-transparent opacity-80"></div>
      </div>

      <div className="relative z-10">
        <div className="text-lg font-medium opacity-90">Your Reputation</div>
        <ReputationRate rate={score} size={64} className="mt-1 font-bold leading-none text-white" />
      </div>
    </div>
  )
}
