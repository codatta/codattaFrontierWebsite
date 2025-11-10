import { Input, Select, Checkbox } from 'antd'

interface ResearchLiteratureSectionProps {
  hasSource: boolean | undefined
  url: string | undefined
  certificationChecked: boolean
  onHasSourceChange: (hasSource: boolean) => void
  onUrlChange: (url: string) => void
  onCertificationChange: (checked: boolean) => void
  error?: string
  certificationError?: string
}

export default function ResearchLiteratureSection({
  hasSource,
  url,
  certificationChecked,
  onHasSourceChange,
  onUrlChange,
  onCertificationChange,
  error,
  certificationError
}: ResearchLiteratureSectionProps) {
  return (
    <div>
      <label className="mb-2 block text-base font-bold text-white">
        Is the question based on recent research literature? <span className="text-red-400">*</span>
      </label>
      <div className="flex gap-2">
        <Select
          value={hasSource === undefined ? undefined : hasSource ? 'yes' : 'no'}
          onChange={(value) => onHasSourceChange(value === 'yes')}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          placeholder="Select an option"
          className="h-12 w-[240px]"
          status={error ? 'error' : ''}
        />
        {hasSource && (
          <Input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Source URL"
            className="h-12 flex-1"
            status={error ? 'error' : ''}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <div className="mt-3">
        <Checkbox
          checked={!!certificationChecked}
          onChange={(e) => onCertificationChange(e.target.checked)}
          className="mb-2 text-white/70 [&_.ant-checkbox-inner]:border-white/30"
        >
          <span className="text-sm leading-4 text-[#BBBBBE]">
            Certification: I confirm this question can be solved independently using only the provided context.
          </span>
        </Checkbox>
        {certificationError && <p className="mt-1 text-sm text-red-500">{certificationError}</p>}
      </div>
    </div>
  )
}
