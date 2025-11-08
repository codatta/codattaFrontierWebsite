import { useState } from 'react'
import { Form, Input, Button, message, Spin, Checkbox } from 'antd'
import { Plus } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

import FileUpload from '@/components/common/file-upload'
import PageHeader from '@/components/common/frontier-page-header'
import frontiterApi from '@/apis/frontiter.api'

interface FileValue {
  name: string
  path: string
}

interface ModelTest {
  id: string
  name: string
  files: FileValue[]
}

export default function PhysicalQuestion({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Form states
  const [questionContent, setQuestionContent] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [isBasedOnLiterature, setIsBasedOnLiterature] = useState<string>('')
  const [literatureCitation, setLiteratureCitation] = useState('')
  const [modelTests, setModelTests] = useState<ModelTest[]>([
    { id: '1', name: 'GPT-4-pro*', files: [] },
    { id: '2', name: 'Grok-4', files: [] },
    { id: '3', name: 'Bamboo-Good-14-102k-Saga*', files: [] },
    { id: '4', name: 'qwen-2-238k-8228-Thinking-250P', files: [] },
    { id: '5', name: 'Bamboo-V2.2-Thinking', files: [] }
  ])
  const [conclusion, setConclusion] = useState('')
  const [bonusChecklist, setBonusChecklist] = useState<string[]>([])

  const languageOptions = [
    { label: 'Python & C/Masm etc', value: 'python_c' },
    { label: 'Rust/Zig, Haskell, OCaml', value: 'rust_haskell' }
  ]

  const handleModelFileChange = (modelId: string, files: FileValue[]) => {
    setModelTests((prev) => prev.map((model) => (model.id === modelId ? { ...model, files } : model)))
  }

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
          bonusChecklist
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
          "I confirm that I have not included any individual's name (such as the model's name, the model's developer, the model's vendor, the model's vendor, etc.)",
        value: 'no_names'
      },
      {
        label: 'Code-related: AI-non-oriented code (e.g., does not have CHSI, PyTorch, TensorFlow, etc.)',
        value: 'code_related'
      },
      {
        label:
          'Reasonable Correlation: You assert that you are familiar with a complete understanding of the problem (e.g., CHSI, CHSI has been run through discipline, specialized literature, etc.) and the solution provided does not violate the problem statement (e.g., CHSI, PyTorch, TensorFlow, etc.)',
        value: 'reasonable'
      },
      { label: 'Confident Solution: Full stack for only one product (product)', value: 'confident' }
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
                checked={bonusChecklist.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBonusChecklist([...bonusChecklist, option.value])
                  } else {
                    setBonusChecklist(bonusChecklist.filter((v) => v !== option.value))
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
              <div className="mb-4">
                <h2 className="mb-1 text-sm font-medium text-white">Model Testing*</h2>
                <p className="text-xs text-white/50">GPT-4-pro*</p>
              </div>

              <div className="space-y-4">
                {modelTests.map((model) => (
                  <div key={model.id}>
                    <label className="mb-2 block text-sm font-medium text-white">{model.name}</label>
                    <FileUpload
                      value={model.files}
                      // @ts-expect-error - FileUpload component type issue
                      onChange={(files) => handleModelFileChange(model.id, files)}
                      maxCount={5}
                      accept="image/*,.pdf,.doc,.docx"
                    >
                      <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 bg-[#252033] transition-colors hover:border-purple-500/50 hover:bg-[#2a2538]">
                        <div className="flex items-center gap-2 text-white/50">
                          <Plus className="size-5" />
                          <span className="text-sm">Please provide a file or address or image</span>
                        </div>
                      </div>
                    </FileUpload>
                  </div>
                ))}
              </div>
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
