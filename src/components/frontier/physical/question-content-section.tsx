import Upload, { type UploadedImage } from './upload'
import MarkdownLatex from '@/components/common/markdown-latex'

interface QuestionContentSectionProps {
  value: {
    text: string
    images: UploadedImage[]
  }
  onChange: (value: { text?: string; images?: UploadedImage[] }) => void
  error?: string
}

export default function QuestionContentSection({ value, onChange, error }: QuestionContentSectionProps) {
  const placeholder = `# Physics Formula for Example

## Newton's Second Law

The mathematical expression is:

$$
F = ma
$$

Where:
- $F$ is force (unit: Newton N)
- $m$ is mass (unit: kilogram kg)
- $a$ is acceleration (unit: m/s²)

## Energy Conservation

Einstein's mass-energy equation:

$$
E = mc^2
$$

## Quadratic Formula

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Question Content<span className="text-red-400">*</span>
      </label>
      <p className="mb-3 text-sm text-[#BBBBBE]">
        Enter your question description or upload an image to illustrate the question.
      </p>
      <div className="space-y-4 rounded-lg border border-[#FFFFFF1F] px-4 py-3">
        <MarkdownLatex
          editable
          value={value.text}
          onChange={(text) => onChange({ text })}
          placeholder={placeholder}
          previewLayout="side"
          editorHeight="300px"
          showCount
          maxLength={500}
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
