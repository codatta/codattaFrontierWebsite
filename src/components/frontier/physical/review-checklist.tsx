import { Checkbox } from 'antd'

interface ReviewChecklistProps {
  value: string[]
  onChange: (value: string, checked: boolean) => void
  error?: string
}

const CHECKLIST_OPTIONS = [
  {
    label:
      'Original: Not copied from textbooks/online sources(e.g., quantum field theory books by Peskin, Weinberg, Schwartz, etc.)',
    value: 'original'
  },
  {
    label: 'Clear Notation: All non-standard symbols defined',
    value: 'clear_notation'
  },
  {
    label:
      'Reasonable Complexity: The question does not involve overly complex calculations (e.g., multi-loop Feynman diagrams, complicated integrals, etc.), and the solution process does not rely on specialized symbolic computation tools (e.g., FeynCalc, Mathematica, etc.).',
    value: 'reasonable_complexity'
  },
  { label: 'Complete Solution: Full step-by-step answer prepared', value: 'complete_solution' }
]

export default function ReviewChecklist({ value, onChange, error }: ReviewChecklistProps) {
  return (
    <div>
      <h2 className="mb-3 text-base font-bold">
        Review Checklist <span className="font-normal text-[#BBBBBE]">*(confirm your question meets all criteria)</span>
      </h2>
      <ul className="space-y-3">
        {CHECKLIST_OPTIONS.map((option) => (
          <li key={option.value} className="rounded-lg border border-[#FFFFFF1F] px-4 py-3 text-sm font-semibold">
            <Checkbox
              checked={value.includes(option.value)}
              onChange={(e) => onChange(option.value, e.target.checked)}
              className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-purple-500 [&_.ant-checkbox-inner]:size-4 [&_.ant-checkbox-inner]:rounded-none [&_.ant-checkbox-inner]:border-white"
            >
              <span className="text-xs leading-relaxed text-white/70">{option.label}</span>
            </Checkbox>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
