import { Input, Select } from 'antd'
import Upload, { type UploadedImage } from './upload'
import { ModelTest } from './validation'

interface ModelTestingSectionProps {
  modelTests: ModelTest[]
  onModelChange: (modelId: string, data: { link?: string; images?: UploadedImage[]; correct?: true }) => void
  errors?: { [key: string]: string }
  correctAnswerError?: string
}

export default function ModelTestingSection({
  modelTests,
  onModelChange,
  errors,
  correctAnswerError
}: ModelTestingSectionProps) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-white">Model Testing*</h2>

      <ul className="space-y-4 rounded-2xl bg-[#252532] p-6">
        {modelTests.map((model) => {
          return (
            <li key={model.id}>
              <label className="mb-2 block text-base font-bold">
                {model.name} <span className="text-red-400">*</span>
                <span className="ml-2 text-xs font-normal text-[#BBBBBE]">(link max 120 characters)</span>
              </label>
              <div className="rounded-lg border border-[#FFFFFF1F] p-4 pt-3">
                <Input
                  placeholder="Please provide a link or upload an image."
                  className="mb-3 border-none bg-transparent text-white placeholder:text-white/30"
                  value={model.link}
                  onChange={(e) => onModelChange(model.id, { link: e.target.value })}
                  status={errors?.[model.id] ? 'error' : ''}
                  maxLength={120}
                />
                <Upload
                  value={model.images}
                  onChange={(images: UploadedImage[]) => onModelChange(model.id, { images })}
                />
              </div>
              {errors?.[model.id] && <p className="mt-1 text-sm text-red-500">{errors[model.id]}</p>}
            </li>
          )
        })}
        <li>
          <label className="mb-2 block text-base font-bold">Correct answer</label>
          <Select
            className="h-12 w-full"
            placeholder="Select correct answer."
            options={modelTests.map((model) => ({ value: model.id, label: model.name }))}
            onChange={(value) => onModelChange(value, { correct: true })}
            value={modelTests.find((m) => m.correct)?.id}
            status={correctAnswerError ? 'error' : ''}
          />
          {correctAnswerError && <p className="mt-1 text-sm text-red-500">{correctAnswerError}</p>}
        </li>
      </ul>
    </div>
  )
}
