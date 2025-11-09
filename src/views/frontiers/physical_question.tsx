import { useState, useCallback } from 'react'
import { Form, Input, Button, message, Spin, Checkbox, Select } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'

// import FileUpload from '@/components/common/file-upload'
import Upload, { type UploadedImage } from '@/components/frontier/physical/upload'
import PageHeader from '@/components/common/frontier-page-header'
import frontiterApi from '@/apis/frontiter.api'

interface ModelTest {
  id: string
  name: string
  files: UploadedImage[]
  link: string
  correct: boolean
}

export default function PhysicalQuestion({ templateId }: { templateId: string }) {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)

  // Form states
  const [questionContent, setQuestionContent] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [recentResearchLiterature, setRecentResearchLiterature] = useState<{ url?: string; hasSource?: boolean }>({
    url: '',
    hasSource: false
  })
  const [certificationChecked, setCertificationChecked] = useState<boolean>(false)
  const [reviewChecklist, setReviewChecklist] = useState<string[]>([])
  const [modelTests, setModelTests] = useState<ModelTest[]>([
    { id: 'model_1', name: 'GPT-5-pro', files: [], link: '', correct: false },
    { id: 'model_2', name: 'Grok-4', files: [], link: '', correct: false },
    { id: 'model_3', name: 'Duobao-Seed-1.6-1015-high', files: [], link: '', correct: false },
    { id: 'model_4', name: 'qwen3-235B-A22B-Thinking-2507', files: [], link: '', correct: false },
    { id: 'model_5', name: 'DeepSeek-V3.2-Thinking', files: [], link: '', correct: false }
  ])

  const handleModelTestChange = useCallback(
    ({
      modelId,
      files,
      link,
      correct
    }: {
      modelId: string
      files?: UploadedImage[]
      link?: string
      correct?: true
    }) => {
      if (correct) {
        setModelTests((prev) => {
          const updated = prev.map((model) => {
            const newModel = { ...model }
            if (model.id === modelId) {
              newModel.correct = true
              console.log('updated model:', newModel)
              return newModel
            } else {
              newModel.correct = false
            }
            return newModel
          })
          return updated
        })
      } else {
        setModelTests((prev) => {
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
      }
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

      // if (!isBasedOnLiterature) {
      //   message.error('Please specify if the question is based on recent research literature')
      //   return
      // }

      setLoading(true)

      const submitData = {
        taskId,
        templateId,
        data: {
          questionContent,
          languages,
          // isBasedOnLiterature: isBasedOnLiterature === 'yes',
          // literatureCitation: isBasedOnLiterature === 'yes' ? literatureCitation : undefined,
          modelTests: modelTests.map((model) => ({
            name: model.name,
            files: model.files
          })),
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
        <ul className="space-y-3">
          {options.map((option) => (
            <li key={option.value} className="rounded-lg border border-[#FFFFFF1F] px-4 py-3 text-sm font-semibold">
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
              >
                <span className="text-xs leading-relaxed text-white/70">{option.label}</span>
              </Checkbox>
            </li>
          ))}
        </ul>
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
              <label className="mb-2 block text-sm font-medium text-white">
                Question Content<span className="text-red-400">*</span>
              </label>
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
              <div className="mt-2 rounded-lg bg-[#FFFFFF0A] px-4 py-3">
                <h3 className="mb-3 text-base font-semibold text-white">📋 Language & Formatting</h3>
                <ul className="list-inside list-disc space-y-2 text-sm text-[#BBBBBE]">
                  <li>Supported languages: English & Chinese only</li>
                  <li>Required format for formulas: LaTeX</li>
                </ul>
              </div>
            </div>

            {/* Is the question based on recent research literature? */}
            <div>
              <label className="mb-2 block text-base font-bold text-white">
                Is the question based on recent research literature? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <Select
                  value={recentResearchLiterature.hasSource ? 'yes' : 'no'}
                  onChange={(value) => {
                    if (value === 'yes') {
                      setRecentResearchLiterature({ hasSource: true })
                    } else {
                      setRecentResearchLiterature({ hasSource: false })
                    }
                  }}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                  className="h-12 w-[240px]"
                />
                {recentResearchLiterature.hasSource && (
                  <Input
                    value={recentResearchLiterature.url}
                    onChange={(e) => setRecentResearchLiterature({ url: e.target.value })}
                    placeholder="Source URL"
                    className="h-12 flex-1"
                  />
                )}
              </div>

              <div className="mt-3">
                <Checkbox
                  checked={!!certificationChecked}
                  onChange={(e) => setCertificationChecked(e.target.checked)}
                  className="mb-2 text-white/70 [&_.ant-checkbox-inner]:border-white/30"
                >
                  <span className="text-sm leading-4 text-[#BBBBBE]">
                    Certification: I confirm this question can be solved independently using only the provided context.
                  </span>
                </Checkbox>
              </div>
            </div>

            {/* Model Testing */}
            <div>
              <h2 className="mb-3 text-lg font-bold text-white">Model Testing*</h2>

              <ul className="space-y-4 rounded-2xl bg-[#252532] p-6">
                {modelTests.map((model) => {
                  return (
                    <li key={model.id}>
                      <label className="mb-2 block text-base font-bold">
                        {model.name} <span className="text-red-400">*</span>
                      </label>
                      <div className="rounded-lg border border-[#FFFFFF1F] p-4 pt-3">
                        <Input
                          placeholder="Please provide a link or upload an image."
                          className="mb-3 border-none bg-transparent text-white placeholder:text-white/30"
                          value={model.link}
                          onChange={(e) => handleModelTestChange({ modelId: model.id, link: e.target.value })}
                        />
                        <Upload
                          value={model.files}
                          onChange={(files: UploadedImage[]) => handleModelTestChange({ modelId: model.id, files })}
                        />
                      </div>
                    </li>
                  )
                })}
                <li>
                  <label className="mb-2 block text-base font-bold">Correct answer</label>
                  <Select
                    className="h-12 w-full"
                    placeholder="Select correct answer."
                    options={modelTests.map((model) => ({ value: model.id, label: model.name }))}
                    onChange={(value) => handleModelTestChange({ modelId: value, correct: true })}
                  />
                </li>
              </ul>
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
