import { cn } from '@udecode/cn'
import { ReputationDetail } from '@/apis/reputation.api'

interface CalculationItemProps {
  label: string
  score?: number
  weight?: string
  opt?: string
  showOpt?: boolean
  className?: string
}

function CalculationItem({ label, weight, score, opt, showOpt = true, className }: CalculationItemProps) {
  if (!opt || score === undefined || score === null) {
    return null
  }

  return (
    <div className="flex flex-1 items-center gap-2">
      {showOpt && <span className="text-gray-500">{opt === '-' ? '➖' : '➕'}</span>}
      <div
        className={cn(
          'flex h-[60px] min-w-[108px] flex-1 flex-col items-center justify-center rounded-xl border border-[#FFFFFF1F] bg-[#875DFF1A] px-3 text-sm',
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#FFFFFF99]">{label}</span>
          {weight && (
            <span className="rounded bg-[#875DFF]/20 px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#875DFF]">
              {weight}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-base font-bold text-white">{score.toFixed(2)}</div>
      </div>
    </div>
  )
}

interface CalculationCardProps {
  className?: string
  data?: ReputationDetail
}

export default function CalculationCard({ className, data }: CalculationCardProps) {
  return (
    <div
      className={cn('flex h-auto min-h-[160px] flex-col justify-center rounded-2xl bg-[#252532] px-6 py-4', className)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-base font-bold text-white">About calculation</div>
        <div className="text-xs text-[#BBBBBE]">
          This score is updated in real-time based on your activity over the last 180 days.
        </div>
      </div>

      <div className="flex min-h-[60px] flex-wrap items-center gap-2">
        <CalculationItem
          label="Identity"
          weight={data?.identify?.percent as string}
          score={data?.identify?.score}
          opt={data?.identify?.opt}
          showOpt={false}
        />
        <CalculationItem
          label="Activity"
          weight={data?.login?.percent as string}
          score={data?.login?.score}
          opt={data?.login?.opt}
        />
        <CalculationItem
          label="Staking"
          weight={data?.staking?.percent as string}
          score={data?.staking?.score}
          opt={data?.staking?.opt}
        />
        <CalculationItem
          label="Contribution"
          weight={data?.contribution?.percent as string}
          score={data?.contribution?.score}
          opt={data?.contribution?.opt}
        />
        <CalculationItem
          label="Malicious"
          weight={data?.malicious_behavior?.percent as string}
          score={data?.malicious_behavior?.score || 0}
          opt={data?.malicious_behavior?.opt}
          className="bg-[#FFA8001A] text-[#FFA800]"
        />
      </div>
    </div>
  )
}
