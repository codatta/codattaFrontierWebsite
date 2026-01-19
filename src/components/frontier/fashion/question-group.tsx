import { OptionCard } from './option-card'

interface Option {
  label: string
  description?: string
  value: string
}

interface QuestionGroupProps {
  title: string
  options: Option[]
  value?: string
  onChange: (value: string) => void
}

export function QuestionGroup({ title, options, value, onChange }: QuestionGroupProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[#00000029] bg-[#252532] px-6 py-5">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            value={option.value}
            selected={value === option.value}
            onClick={onChange}
          />
        ))}
      </div>
    </div>
  )
}
