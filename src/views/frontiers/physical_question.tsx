import { useState, useCallback } from 'react'
import { Form, Input, Button, message, Spin, Checkbox } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'

// import FileUpload from '@/components/common/file-upload'
import Upload, { type UploadedImage } from '@/components/frontier/physical/upload'
import PageHeader from '@/components/common/frontier-page-header'
import frontiterApi from '@/apis/frontiter.api'

interface ModelTest {
  id: string
  name: string
  files: UploadedImage[]
  link?: string
}

// ModelTestItem component
function ModelTestItem({
  model,
  onChange
}: {
  model: ModelTest
  onChange: ({ modelId, files, link }: { modelId: string; files?: UploadedImage[]; link?: string }) => void
}) {
  console.log(`Rendering Upload for ${model.id}, files:`, model.files)
  return (
    <li>
      <label className="mb-2 block text-base font-bold">
        {model.name}
        <span className="text-red-400">*</span>
      </label>
      <div className="rounded-lg border border-[#FFFFFF1F] p-4 pt-3">
        <Input
          placeholder="Please provide a link or upload an image."
          className="mb-3 border-none bg-transparent text-white placeholder:text-white/30"
          value={model.link}
          onChange={(e) => onChange({ modelId: model.id, link: e.target.value })}
        />
        <Upload value={model.files} onChange={(files: UploadedImage[]) => onChange({ modelId: model.id, files })} />
      </div>
    </li>
  )
}

export default function PhysicalQuestion({ templateId }: { templateId: string }) {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)

  // Form states
  const [questionContent, setQuestionContent] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [isBasedOnLiterature, setIsBasedOnLiterature] = useState<string>('')
  const [literatureCitation, setLiteratureCitation] = useState('')
  const [modelTests, setModelTests] = useState<ModelTest[]>([
    { id: 'model_1', name: 'GPT-5-pro', files: [], link: '' },
    { id: 'model_2', name: 'Grok-4', files: [], link: '' },
    { id: 'model_3', name: 'Duobao-Seed-1.6-1015-high', files: [], link: '' },
    { id: 'model_4', name: 'qwen3-235B-A22B-Thinking-2507', files: [], link: '' },
    { id: 'model_5', name: 'DeepSeek-V3.2-Thinking', files: [], link: '' }
  ])
  const [conclusion, setConclusion] = useState('')
  const [reviewChecklist, setReviewChecklist] = useState<string[]>([])

  const languageOptions = [
    { label: 'Python & C/Masm etc', value: 'python_c' },
    { label: 'Rust/Zig, Haskell, OCaml', value: 'rust_haskell' }
  ]

  const handleModelTestChange = useCallback(
    ({ modelId, files, link }: { modelId: string; files?: UploadedImage[]; link?: string }) => {
      console.log('handleModelTestChange', { modelId, files, link })
      setModelTests((prev) => {
        console.log(
          'prev modelTests:',
          prev.find((m) => m.id === modelId)
        )
        const updated = prev.map((model) => {
          if (model.id === modelId) {
            const newModel = { ...model }
            if (files !== undefined) newModel.files = files
            if (link !== undefined) newModel.link = link
            console.log('updated model:', newModel)
            return newModel
          }
          return model
        })
        return updated
      })
    },
    []
  )

  const handleSubmit = async () => {
    try {
      await form.validateFields()

      if (!questionContent.trim()) {
        message.error('Please enter question content')
        return
      }

      if (languages.length === 0) {
        message.error('Please select at least one language')
        return
      }

      if (!isBasedOnLiterature) {
        message.error('Please specify if the question is based on recent research literature')
        return
      }

      setLoading(true)

      const submitData = {
        taskId,
        templateId,
        data: {
          questionContent,
          languages,
          isBasedOnLiterature: isBasedOnLiterature === 'yes',
          literatureCitation: isBasedOnLiterature === 'yes' ? literatureCitation : undefined,
          modelTests: modelTests.map((model) => ({
            name: model.name,
            files: model.files
          })),
          conclusion,
          reviewChecklist
        }
      }

      await frontiterApi.submitTask(taskId!, submitData)
      message.success('Question submitted successfully!')

      setTimeout(() => {
        navigate(-1)
      }, 1500)
    } catch (error) {
      message.error((error as Error).message || 'Failed to submit question')
    } finally {
      setLoading(false)
    }
  }

  function CheckList() {
    const options = [
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
    return (
      <div>
        <h2 className="mb-3 text-base font-bold">
          Review Checklist{' '}
          <span className="font-normal text-[#BBBBBE]">*(confirm your question meets all criteria)</span>
        </h2>
        <div className="space-y-3">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-start gap-3 rounded-lg border border-[#FFFFFF1F] px-4 py-3 text-sm font-semibold"
            >
              <Checkbox
                checked={reviewChecklist.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setReviewChecklist([...reviewChecklist, option.value])
                  } else {
                    setReviewChecklist(reviewChecklist.filter((v) => v !== option.value))
                  }
                }}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-purple-500 [&_.ant-checkbox-inner]:size-4 [&_.ant-checkbox-inner]:rounded-none [&_.ant-checkbox-inner]:border-white"
              />
              <span className="text-xs leading-relaxed text-white/70">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen bg-[#1a1625] pb-12">
        <PageHeader title="Physical Question Submission" />
        <div className="mx-auto max-w-[1352px] px-10">
          {/* Header */}
          {/* Form */}
          <Form form={form} layout="vertical" className="space-y-12 pb-12">
            {/* Question Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Question Content*</label>
              <Input.TextArea
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Share group of target (on coding)"
                rows={6}
                className="resize-none rounded-lg border-white/10 bg-[#252033] text-white placeholder:text-white/30"
                style={{
                  backgroundColor: '#252033',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            {/* Language & Formatting */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-0.5 bg-purple-500" />
                <h2 className="text-base font-semibold text-white">Language & Formatting</h2>
              </div>
              <div className="space-y-2">
                {languageOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-3 text-sm text-white/80">
                    <Checkbox
                      checked={languages.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLanguages([...languages, option.value])
                        } else {
                          setLanguages(languages.filter((l) => l !== option.value))
                        }
                      }}
                      className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-purple-500 [&_.ant-checkbox-inner]:border-white/30"
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Is the question based on recent research literature? */}
            <div>
              <label className="mb-3 block text-sm font-medium text-white">
                Is the question based on recent research literature?*
              </label>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsBasedOnLiterature('yes')}
                  className={`h-10 flex-1 rounded-lg border transition-all ${
                    isBasedOnLiterature === 'yes'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-transparent text-white/60 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => setIsBasedOnLiterature('no')}
                  className={`h-10 flex-1 rounded-lg border transition-all ${
                    isBasedOnLiterature === 'no'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-transparent text-white/60 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  choose-No
                </Button>
              </div>

              {isBasedOnLiterature === 'yes' && (
                <div className="mt-3">
                  <Checkbox
                    checked={!!literatureCitation}
                    className="mb-2 text-white/70 [&_.ant-checkbox-inner]:border-white/30"
                  >
                    <span className="text-sm">
                      Cite literature (not included in any individual's name (such as the model's name, the model's
                      developer, the model's vendor, the model's vendor, etc.))
                    </span>
                  </Checkbox>
                  <Input
                    value={literatureCitation}
                    onChange={(e) => setLiteratureCitation(e.target.value)}
                    placeholder="e.g., arXiv:2024.12345 or DOI: 10.1234/example"
                    className="rounded-lg border-white/10 bg-[#252033] text-white placeholder:text-white/30"
                    style={{
                      backgroundColor: '#252033',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Model Testing */}
            <div>
              <h2 className="mb-3 text-lg font-bold text-white">Model Testing*</h2>

              <ul className="space-y-4 rounded-2xl bg-[#252532] p-6">
                {modelTests.map((model) => {
                  console.log(`Mapping model ${model.id}, files:`, model.files)
                  return <ModelTestItem key={model.id} model={model} onChange={handleModelTestChange} />
                })}
              </ul>
            </div>

            {/* Conclusion */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Conclusion*</label>
              <Input.TextArea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                placeholder="e.g., arXiv:2024.12345 or DOI: 10.1234/example"
                rows={4}
                className="resize-none rounded-lg border-white/10 bg-[#252033] text-white placeholder:text-white/30"
                style={{
                  backgroundColor: '#252033',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            <CheckList />
          </Form>
        </div>
        <Notes />
        {/* Submit Button */}
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={loading}
          className="mx-auto mt-12 block h-10 w-[240px] rounded-full text-sm font-normal"
        >
          Submit
        </Button>
      </div>
    </Spin>
  )
}

function Notes() {
  const notes = [
    'Accepted contributions will receive standard compensation.',
    'All submissions undergo rigorous review. Questions not meeting the stated criteria will be rejected.'
  ]
  return (
    <div className="mx-auto max-w-[1352px] bg-[#875DFF0A] px-10 py-[30px]">
      <h3 className="text-lg font-bold text-[#875DFF]">Submission Notes</h3>
      <ul className="mt-4 list-inside list-disc text-sm leading-[22px] text-[#BBBBBE]">
        {notes.map((note, index) => (
          <li key={'note_' + index}>{note}</li>
        ))}
      </ul>
    </div>
  )
}
