import TextArea from 'antd/es/input/TextArea'
import Upload, { type UploadedImage } from './upload'

interface QuestionContentSectionProps {
  value: {
    text: string
    images: UploadedImage[]
  }
  onChange: (value: { text?: string; images?: UploadedImage[] }) => void
  error?: string
}

export default function QuestionContentSection({ value, onChange, error }: QuestionContentSectionProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Question Content<span className="text-red-400">*</span>
      </label>
      <div className="space-y-4 rounded-lg border border-[#FFFFFF1F] px-4 py-3">
        <TextArea
          value={value.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Please enter the question content"
          rows={4}
          maxLength={500}
          showCount
          className="resize-none border-none"
          status={error ? 'error' : ''}
        />
        <Upload onChange={(images) => onChange({ images })} value={value.images} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <div className="mt-2 rounded-lg bg-[#FFFFFF0A] px-4 py-3">
        <h3 className="mb-3 text-base font-semibold text-white">📋 Language & Formatting</h3>
        <ul className="list-inside list-disc space-y-2 text-sm text-[#BBBBBE]">
          <li>Supported languages: English & Chinese only</li>
          <li>Required format for formulas: LaTeX</li>
        </ul>
      </div>
    </div>
  )
}
