import { CheckCircle2 } from 'lucide-react'
import { cn } from '@udecode/cn'

interface OptionCardProps {
  label: string
  description?: string
  value: string
  selected: boolean
  onClick: (value: string) => void
}

export function OptionCard({ label, description, value, selected, onClick }: OptionCardProps) {
  return (
    <div
      onClick={() => onClick(value)}
      className={cn(
        'group relative flex cursor-pointer items-center justify-between rounded-lg border border-[#FFFFFF1F] px-4 py-3 transition-all hover:border-[#FFFFFF3F]',
        selected ? 'bg-white text-black' : 'bg-[#252532] text-[#FFFFFF]'
      )}
    >
      <div className="flex flex-col gap-1">
        <span className={cn('text-sm font-semibold', selected ? 'text-[#252532]' : 'text-white')}>
          {label}
          {description && (
            <span className={cn('ml-2 text-xs font-normal', selected ? 'text-[#404049]' : 'text-[#BBBBBE]')}>
              {description}
            </span>
          )}
        </span>
      </div>
      {selected && <CheckCircle2 className="size-5 text-[#252532]" fill="currentColor" color="white" />}
    </div>
  )
}
