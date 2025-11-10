import { useState, useCallback } from 'react'
import { message, Modal } from 'antd'
import frontiterApi from '@/apis/frontiter.api'
import { ResultType } from '@/components/frontier/info-survey/types'
import { UploadedImage } from './upload'
import {
  ModelTest,
  ValidationErrors,
  validateQuestionContent,
  validateResearchLiterature,
  validateModelTests,
  checkDuplicateInRealTime
} from './validation'

async function getLastSubmission(frontierId: string, taskIds: string) {
  const res = await frontiterApi.getSubmissionList({
    page_num: 1,
    page_size: 1,
    frontier_id: frontierId,
    task_ids: taskIds
  })
  return res.data[0]
}

export function usePhysicalQuestion(taskId: string | undefined, templateId: string) {
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [resultType, setResultType] = useState<ResultType | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})

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

  const validateForm = useCallback(
    (updateErrors = true) => {
      const newErrors: ValidationErrors = {}
      let isValid = true

      // Validate question content
      const questionError = validateQuestionContent(questionContent.text, questionContent.images)
      if (questionError) {
        newErrors.questionContent = questionError
        isValid = false
      }

      // Validate recent research literature
      const literatureError = validateResearchLiterature(
        recentResearchLiterature.hasSource,
        recentResearchLiterature.url
      )
      if (literatureError) {
        newErrors.recentResearchLiterature = literatureError
        isValid = false
      }

      // Validate certification checkbox
      if (!certificationChecked) {
        newErrors.certification = 'Please confirm the certification.'
        isValid = false
      }

      // Validate model tests
      const { errors: modelTestErrors, isValid: modelTestsValid } = validateModelTests(modelTests)
      if (!modelTestsValid) {
        newErrors.modelTests = modelTestErrors
        isValid = false
      }

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
        setResultType('ADOPT')
      } catch (error) {
        console.error('Failed to fetch reward points:', error)
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

  const handleModelTestChange = useCallback(
    (modelId: string, data: { link?: string; images?: UploadedImage[]; correct?: true }) => {
      const { link, images, correct } = data

      if (correct) {
        setModelTests((prev) =>
          prev.map((model) => ({
            ...model,
            correct: model.id === modelId
          }))
        )
        if (errors.correctAnswer) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.correctAnswer
            return newErrors
          })
        }
      } else {
        setModelTests((prev) =>
          prev.map((model) => {
            if (model.id === modelId) {
              return {
                ...model,
                images: images !== undefined ? images : model.images,
                link: link !== undefined ? link : model.link
              }
            }
            return model
          })
        )

        // Real-time duplicate validation
        const duplicateError = checkDuplicateInRealTime(modelId, modelTests, link, images)
        setErrors((prev) => {
          const newErrors = { ...prev }

          if (duplicateError) {
            if (!newErrors.modelTests) newErrors.modelTests = {}
            newErrors.modelTests[modelId] = duplicateError
          } else if (newErrors.modelTests?.[modelId]) {
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

  return {
    // State
    loading,
    isSubmitting,
    pageLoading,
    rewardPoints,
    resultType,
    errors,
    questionContent,
    recentResearchLiterature,
    certificationChecked,
    reviewChecklist,
    modelTests,
    // Actions
    setQuestionContent,
    setRecentResearchLiterature,
    setCertificationChecked,
    setReviewChecklist,
    setErrors,
    handleModelTestChange,
    handleSubmit,
    validateForm,
    checkTaskStatus
  }
}
