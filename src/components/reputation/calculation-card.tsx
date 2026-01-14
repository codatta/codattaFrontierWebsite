import { cn } from '@udecode/cn'

interface CalculationItemProps {
  label: string
  value: string
  weight: number
  color?: string
}

function CalculationItem({ label, value, weight, color = 'text-[#875DFF]' }: CalculationItemProps) {
  return (
    <div className="flex h-[72px] min-w-[100px] flex-1 flex-col items-center justify-center rounded-xl bg-[#2B2B36]">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">
        <span className={color}>{value}</span>
        <span className="text-gray-500">*{weight}</span>
      </div>
    </div>
  )
}

export default function CalculationCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-[160px] flex-col justify-center rounded-2xl bg-[#1C1C26] px-6 py-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-bold text-white">About calculation</div>
        <div className="text-xs text-gray-400">
          This score is updated in real-time based on your activity over the last 180 days.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CalculationItem label="Identity" value="15%" weight={30} />
        <span className="text-gray-500">+</span>
        <CalculationItem label="Activity" value="10%" weight={30} />
        <span className="text-gray-500">+</span>
        <CalculationItem label="Staking" value="20%" weight={30} />
        <span className="text-gray-500">+</span>
        <CalculationItem label="Contribution" value="55%" weight={30} />
        <span className="text-gray-500">-</span>
        <div className="flex h-[72px] min-w-[100px] flex-1 flex-col items-center justify-center rounded-xl border border-[#5C3A3A] bg-[#3A2E2E]">
          <div className="text-xs text-[#FFA043]">Malicious</div>
          <div className="mt-1 text-sm font-semibold text-white">12</div>
        </div>
      </div>
    </div>
  )
}
