import { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Spin, Checkbox, Select, Modal } from 'antd'
import { useParams } from 'react-router-dom'
import TextArea from 'antd/es/input/TextArea'

import PageHeader from '@/components/common/frontier-page-header'
import Upload, { type UploadedImage } from '@/components/frontier/physical/upload'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { ResultType } from '@/components/frontier/info-survey/types'

import frontiterApi from '@/apis/frontiter.api'

interface ModelTest {
  id: string
  name: string
  images: UploadedImage[]
  link: string
  correct: boolean
}

async function getLastSubmission(frontierId: string, taskIds: string) {
  const res = await frontiterApi.getSubmissionList({
    page_num: 1,
    page_size: 1,
    frontier_id: frontierId,
    task_ids: taskIds
  })
  const lastSubmission = res.data[0]
  return lastSubmission
}

export default function PhysicalQuestion({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { taskId } = useParams()

  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [resultType, setResultType] = useState<ResultType | null>(null)
  const [errors, setErrors] = useState<{
    questionContent?: string
    recentResearchLiterature?: string
    certification?: string
    modelTests?: { [key: string]: string }
    correctAnswer?: string
    reviewChecklist?: string
  }>({})

  // Form states
  const [questionContent, setQuestionContent] = useState<{ images: UploadedImage[]; text: string }>({
    images: [],
    text: ''
  })
  const [recentResearchLiterature, setRecentResearchLiterature] = useState<{ url?: string; hasSource?: boolean }>({
    url: '',
    hasSource: undefined
  })
  const [certificationChecked, setCertificationChecked] = useState<boolean>(false)
  const [reviewChecklist, setReviewChecklist] = useState<string[]>([])
  const [modelTests, setModelTests] = useState<ModelTest[]>([
    { id: 'model_1', name: 'GPT-5-pro', images: [], link: '', correct: false },
    { id: 'model_2', name: 'Grok-4', images: [], link: '', correct: false },
    { id: 'model_3', name: 'Duobao-Seed-1.6-1015-high', images: [], link: '', correct: false },
    { id: 'model_4', name: 'qwen3-235B-A22B-Thinking-2507', images: [], link: '', correct: false },
    { id: 'model_5', name: 'DeepSeek-V3.2-Thinking', images: [], link: '', correct: false }
  ])

  const handleModelTestChange = useCallback(
    ({
      modelId,
      images,
      link,
      correct
    }: {
      modelId: string
      images?: UploadedImage[]
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
        // Clear correct answer error when selected
        if (errors.correctAnswer) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.correctAnswer
            return newErrors
          })
        }
      } else {
        setModelTests((prev) => {
          const updated = prev.map((model) => {
            if (model.id === modelId) {
              const newModel = { ...model }
              if (images !== undefined) newModel.images = images
              if (link !== undefined) newModel.link = link
              console.log('updated model:', newModel)
              return newModel
            }
            return model
          })
          return updated
        })

        // Real-time duplicate validation
        setErrors((prev) => {
          const newErrors = { ...prev }

          // Get current state with the update
          const currentModels = modelTests.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                images: images !== undefined ? images : model.images,
                link: link !== undefined ? link : model.link
              }
            }
            return model
          })

          // Check for duplicate URLs
          if (link !== undefined && link.trim()) {
            const trimmedLink = link.trim()
            const duplicateUrl = currentModels.some(
              (model) => model.id !== modelId && model.link.trim() === trimmedLink
            )

            if (duplicateUrl) {
              if (!newErrors.modelTests) newErrors.modelTests = {}
              newErrors.modelTests[modelId] = 'This URL is already used in another model test.'
              return newErrors
            }
          }

          // Check for duplicate images
          if (images !== undefined && images.length > 0) {
            const allImageHashes: string[] = []
            currentModels.forEach((model) => {
              model.images.forEach((img) => {
                if (img.hash) allImageHashes.push(img.hash)
              })
            })

            const duplicateHash = images.find(
              (img) => img.hash && allImageHashes.filter((hash) => hash === img.hash).length > 1
            )

            if (duplicateHash) {
              if (!newErrors.modelTests) newErrors.modelTests = {}
              newErrors.modelTests[modelId] = 'This image is already used in another model test.'
              return newErrors
            }
          }

          // Clear error if no duplicates found
          if (newErrors.modelTests?.[modelId]) {
            delete newErrors.modelTests[modelId]
            if (Object.keys(newErrors.modelTests).length === 0) {
              delete newErrors.modelTests
            }
          }

          return newErrors
        })
      }
    },
    [errors, modelTests]
  )

  const validateForm = useCallback(
    (updateErrors = true) => {
      const isValidUrl = (url: string) => {
        try {
          const urlObj = new URL(url)
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
        } catch (_error) {
          return false
        }
      }

      const newErrors: typeof errors = {}
      let isValid = true

      // Validate question content - requires text OR images
      if (!questionContent.text.trim() && questionContent.images.length === 0) {
        newErrors.questionContent = 'Please provide question content (text or an image).'
        isValid = false
      } else if (questionContent.text.trim().length > 500) {
        newErrors.questionContent = 'Question content must not exceed 500 characters.'
        isValid = false
      }

      // Validate recent research literature
      if (recentResearchLiterature.hasSource === undefined) {
        newErrors.recentResearchLiterature =
          'Please select whether the question is based on recent research literature.'
        isValid = false
      } else if (recentResearchLiterature.hasSource && !recentResearchLiterature.url?.trim()) {
        newErrors.recentResearchLiterature = 'Source URL is required when selecting "Yes".'
        isValid = false
      } else if (
        recentResearchLiterature.hasSource &&
        recentResearchLiterature.url?.trim() &&
        !isValidUrl(recentResearchLiterature.url.trim())
      ) {
        newErrors.recentResearchLiterature = 'Please provide a valid URL (http:// or https://).'
        isValid = false
      }

      // Validate certification checkbox
      if (!certificationChecked) {
        newErrors.certification = 'Please confirm the certification.'
        isValid = false
      }

      // Validate model tests - each model requires link OR images (at least one)
      const modelTestErrors: { [key: string]: string } = {}
      const allUrls: string[] = []
      const allImageHashes: string[] = []

      // Collect all URLs and image hashes for duplicate checking
      modelTests.forEach((model) => {
        const trimmedLink = model.link.trim()
        if (trimmedLink) {
          allUrls.push(trimmedLink)
        }
        model.images.forEach((img) => {
          if (img.hash) {
            allImageHashes.push(img.hash)
          }
        })
      })

      modelTests.forEach((model) => {
        const hasLink = model.link.trim().length > 0
        const hasImages = model.images.length > 0

        if (!hasLink && !hasImages) {
          modelTestErrors[model.id] = 'Please provide a link or upload an image.'
          isValid = false
        } else if (hasLink && model.link.trim().length > 120) {
          modelTestErrors[model.id] = 'Link must not exceed 120 characters.'
          isValid = false
        } else if (hasLink && !isValidUrl(model.link.trim())) {
          modelTestErrors[model.id] = 'Please provide a valid URL (http:// or https://).'
          isValid = false
        } else if (hasLink && allUrls.filter((url) => url === model.link.trim()).length > 1) {
          modelTestErrors[model.id] = 'This URL is already used in another model test.'
          isValid = false
        } else if (hasImages) {
          // Check for duplicate images
          const duplicateHash = model.images.find(
            (img) => img.hash && allImageHashes.filter((hash) => hash === img.hash).length > 1
          )
          if (duplicateHash) {
            modelTestErrors[model.id] = 'This image is already used in another model test.'
            isValid = false
          }
        }
      })
      if (Object.keys(modelTestErrors).length > 0) {
        newErrors.modelTests = modelTestErrors
      }

      // Correct answer is optional - no validation needed

      // Validate review checklist
      if (reviewChecklist.length !== 4) {
        newErrors.reviewChecklist = 'Please confirm all checklist items.'
        isValid = false
      }

      if (updateErrors) {
        setErrors(newErrors)
      }
      return isValid
    },
    [questionContent, recentResearchLiterature, certificationChecked, modelTests, reviewChecklist]
  )

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }

    setIsSubmitting(true)
    setLoading(true)

    try {
      const submitData = {
        taskId,
        templateId,
        data: {
          questionContent: {
            text: questionContent.text.trim(),
            images: questionContent.images
          },
          recentResearchLiterature: {
            hasSource: recentResearchLiterature.hasSource,
            url: recentResearchLiterature.url?.trim()
          },
          certificationChecked,
          modelTests: modelTests.map((model) => ({
            name: model.name,
            images: model.images,
            link: model.link.trim(),
            correct: model.correct
          })),
          reviewChecklist
        }
      }

      await frontiterApi.submitTask(taskId!, submitData)

      message.success('Question submitted successfully!')

      // Fetch reward points before showing result
      try {
        const taskDetail = await frontiterApi.getTaskDetail(taskId!)
        const calculatedRewards = taskDetail.data.reward_info
          .filter((item) => {
            return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          })
          .reduce((acc, cur) => {
            return acc + cur.reward_value
          }, 0)

        setRewardPoints(calculatedRewards)
        // Set result type to show the success modal with correct rewards
        setResultType('ADOPT')
      } catch (error) {
        console.error('Failed to fetch reward points:', error)
        // Still show result even if reward fetch fails
        setResultType('ADOPT')
      }
    } catch (error) {
      Modal.error({
        title: 'Submission Failed',
        content: (error as Error).message || 'Failed to submit question. Please try again.',
        okText: 'OK',
        className: '[&_.ant-btn]:!bg-[#875DFF]'
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const handleQuestionContentChange = (text: string) => {
    setQuestionContent({ ...questionContent, text })
    // Clear error if either text or images are present
    if (errors.questionContent && (text.trim() || questionContent.images.length > 0)) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.questionContent
        return newErrors
      })
    }
  }

  const handleQuestionContentImagesChange = (images: UploadedImage[]) => {
    setQuestionContent({ ...questionContent, images })
    // Clear error if either text or images are present
    if (errors.questionContent && (questionContent.text.trim() || images.length > 0)) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.questionContent
        return newErrors
      })
    }
  }

  const handleRecentResearchLiteratureChange = (hasSource: boolean) => {
    setRecentResearchLiterature({ hasSource, url: hasSource ? recentResearchLiterature.url : '' })
    if (errors.recentResearchLiterature) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.recentResearchLiterature
        return newErrors
      })
    }
  }

  const handleSourceUrlChange = (url: string) => {
    setRecentResearchLiterature({ ...recentResearchLiterature, url })
    if (errors.recentResearchLiterature && url.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.recentResearchLiterature
        return newErrors
      })
    }
  }

  const handleCertificationChange = (checked: boolean) => {
    setCertificationChecked(checked)
    if (errors.certification && checked) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.certification
        return newErrors
      })
    }
  }

  const handleReviewChecklistChange = (value: string, checked: boolean) => {
    const newChecklist = checked ? [...reviewChecklist, value] : reviewChecklist.filter((v) => v !== value)
    setReviewChecklist(newChecklist)
    if (errors.reviewChecklist && newChecklist.length === 4) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.reviewChecklist
        return newErrors
      })
    }
  }

  const handleResultStatus = (status: string = '') => {
    status = status.toLocaleUpperCase()
    if (['PENDING', 'SUBMITTED'].includes(status)) {
      setResultType('PENDING')
    } else if (status === 'REFUSED') {
      setResultType('REJECT')
    } else if (status === 'ADOPT') {
      setResultType('ADOPT')
    }
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }

      const totalRewards = taskDetail.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      setRewardPoints(totalRewards)

      // Check if there's a previous submission
      const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)

      if (lastSubmission?.status) {
        handleResultStatus(lastSubmission.status)
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: (error as Error).message || 'Failed to get task detail!',
        okText: 'Try Again',
        className: '[&_.ant-btn]:!bg-[#875DFF]',
        onOk: () => {
          checkTaskStatus()
        }
      })
    } finally {
      setPageLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

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
                onChange={(e) => handleReviewChecklistChange(option.value, e.target.checked)}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-purple-500 [&_.ant-checkbox-inner]:size-4 [&_.ant-checkbox-inner]:rounded-none [&_.ant-checkbox-inner]:border-white"
              >
                <span className="text-xs leading-relaxed text-white/70">{option.label}</span>
              </Checkbox>
            </li>
          ))}
        </ul>
        {errors.reviewChecklist && <p className="mt-2 text-sm text-red-500">{errors.reviewChecklist}</p>}
      </div>
    )
  }

  return (
    <Spin spinning={pageLoading || loading} className="min-h-screen">
      <div className="min-h-screen bg-[#1a1625] pb-12">
        <PageHeader title="Physical Question Submission" />
        {resultType ? (
          <SubmitSuccessModal points={rewardPoints} open={true} onClose={() => window.history.back()} />
        ) : (
          <div className="mx-auto max-w-[1352px] px-10">
            {/* Header */}
            {/* Form */}
            <Form form={form} layout="vertical" className="space-y-12 pb-12">
              {/* Question Content */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Question Content<span className="text-red-400">*</span>
                  <span className="ml-2 text-xs font-normal text-[#BBBBBE]">(max 500 characters)</span>
                </label>
                <div className="space-y-4 rounded-lg border border-[#FFFFFF1F] px-4 py-3">
                  <TextArea
                    value={questionContent.text}
                    onChange={(e) => handleQuestionContentChange(e.target.value)}
                    placeholder="Please enter the question content"
                    rows={4}
                    maxLength={500}
                    showCount
                    className="resize-none border-none"
                    status={errors.questionContent ? 'error' : ''}
                  />
                  <Upload onChange={handleQuestionContentImagesChange} value={questionContent.images} />
                </div>
                {errors.questionContent && <p className="mt-1 text-sm text-red-500">{errors.questionContent}</p>}
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
                    value={
                      recentResearchLiterature.hasSource === undefined
                        ? undefined
                        : recentResearchLiterature.hasSource
                          ? 'yes'
                          : 'no'
                    }
                    onChange={(value) => handleRecentResearchLiteratureChange(value === 'yes')}
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                    placeholder="Select an option"
                    className="h-12 w-[240px]"
                    status={errors.recentResearchLiterature ? 'error' : ''}
                  />
                  {recentResearchLiterature.hasSource && (
                    <Input
                      value={recentResearchLiterature.url}
                      onChange={(e) => handleSourceUrlChange(e.target.value)}
                      placeholder="Source URL"
                      className="h-12 flex-1"
                      status={errors.recentResearchLiterature ? 'error' : ''}
                    />
                  )}
                </div>
                {errors.recentResearchLiterature && (
                  <p className="mt-1 text-sm text-red-500">{errors.recentResearchLiterature}</p>
                )}

                <div className="mt-3">
                  <Checkbox
                    checked={!!certificationChecked}
                    onChange={(e) => handleCertificationChange(e.target.checked)}
                    className="mb-2 text-white/70 [&_.ant-checkbox-inner]:border-white/30"
                  >
                    <span className="text-sm leading-4 text-[#BBBBBE]">
                      Certification: I confirm this question can be solved independently using only the provided
                      context.
                    </span>
                  </Checkbox>
                  {errors.certification && <p className="mt-1 text-sm text-red-500">{errors.certification}</p>}
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
                          <span className="ml-2 text-xs font-normal text-[#BBBBBE]">(link max 120 characters)</span>
                        </label>
                        <div className="rounded-lg border border-[#FFFFFF1F] p-4 pt-3">
                          <Input
                            placeholder="Please provide a link or upload an image."
                            className="mb-3 border-none bg-transparent text-white placeholder:text-white/30"
                            value={model.link}
                            onChange={(e) => handleModelTestChange({ modelId: model.id, link: e.target.value })}
                            status={errors.modelTests?.[model.id] ? 'error' : ''}
                            maxLength={120}
                          />
                          <Upload
                            value={model.images}
                            onChange={(images: UploadedImage[]) => handleModelTestChange({ modelId: model.id, images })}
                          />
                        </div>
                        {errors.modelTests?.[model.id] && (
                          <p className="mt-1 text-sm text-red-500">{errors.modelTests[model.id]}</p>
                        )}
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
                      value={modelTests.find((m) => m.correct)?.id}
                      status={errors.correctAnswer ? 'error' : ''}
                    />
                    {errors.correctAnswer && <p className="mt-1 text-sm text-red-500">{errors.correctAnswer}</p>}
                  </li>
                </ul>
              </div>
              <CheckList />
            </Form>
          </div>
        )}
        {!resultType && (
          <>
            <Notes />
            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              className={`mx-auto mt-12 block h-10 w-[240px] rounded-full text-sm font-normal ${!validateForm(false) && !isSubmitting ? 'opacity-50' : ''}`}
            >
              Submit
            </Button>
          </>
        )}
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
    <div className="bg-[#875DFF0A]">
      <div className="mx-auto max-w-[1352px] px-10 py-[30px]">
        <h3 className="text-lg font-bold text-[#875DFF]">Submission Notes</h3>
        <ul className="mt-4 list-inside list-disc text-sm leading-[22px] text-[#BBBBBE]">
          {notes.map((note, index) => (
            <li key={'note_' + index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
