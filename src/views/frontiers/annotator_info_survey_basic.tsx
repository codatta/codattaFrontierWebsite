import { Modal, Spin, message } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import Input from '@/components/frontier/info-survey/input'
import Select from '@/components/frontier/info-survey/select'
import { selectOptionsMap } from '@/components/frontier/info-survey/basic'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import PrivacyModel from '@/components/frontier/info-survey/privacy-model'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { isValidEmail } from '@/utils/str'

import frontiterApi from '@/apis/frontiter.api'
import { BasicInfoKey, ResultType } from '@/components/frontier/info-survey/types'
import Result from '@/components/frontier/info-survey/result'

interface SurveyFormData {
  email: string
  country_of_residence: string
  most_proficient_language: string
  education_level: string
  occupation: string
  large_model_familiarity: string
  coding_ability: string
  blockchain_domain_knowledge: string
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

export default function AnnotatorInfoSurveyBasic({ templateId }: { templateId: string }) {
  const { taskId, questId = '' } = useParams()
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [pageLoading, setPageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [resultType, setResultType] = useState<ResultType | null>(null)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState<SurveyFormData>({
    email: '',
    country_of_residence: '',
    most_proficient_language: '',
    education_level: '',
    occupation: '',
    large_model_familiarity: '',
    coding_ability: '',
    blockchain_domain_knowledge: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SurveyFormData, string>>>({})

  const basicInfoKeys: BasicInfoKey[] = [
    'country_of_residence',
    'most_proficient_language',
    'education_level',
    'occupation'
  ]

  const skillsAssessmentKeys: BasicInfoKey[] = [
    'large_model_familiarity',
    'coding_ability',
    'blockchain_domain_knowledge'
  ]

  const onBack = () => {
    window.history.back()
  }

  const handleResultStatus = (status: string = '') => {
    status = status.toLocaleUpperCase()
    if (['PENDING', 'SUBMITTED'].includes(status)) {
      setResultType('PENDING')
    } else if (status === 'REFUSED') {
      setResultType('REJECT')
    } else if (status === 'ADOPT') {
      setResultType('ADOPT')
    } else {
      setPrivacyModalOpen(true)
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

      if (isBnb) {
        const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)
        handleResultStatus(lastSubmission?.status)
      } else {
        const totalRewards = taskDetail.data.reward_info
          .filter((item) => {
            return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          })
          .reduce((acc, cur) => {
            return acc + cur.reward_value
          }, 0)

        setRewardPoints(totalRewards)
        setPrivacyModalOpen(true)
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error.message ? error.message : 'Failed to get task detail!',
        okText: 'Try Again',
        className: '[&_.ant-btn]:!bg-[#875DFF]',
        onOk: () => {
          checkTaskStatus()
        }
      })
    } finally {
      setPageLoading(false)
    }
  }, [taskId, templateId, isBnb])

  const handleEmailBlur = () => {
    const trimmedEmail = formData.email.trim()
    if (trimmedEmail !== formData.email) {
      updateFormData('email', trimmedEmail)
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format.' }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
  }

  const updateFormData = (field: keyof SurveyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = useCallback(
    (updateErrors = true) => {
      const newErrors: Partial<Record<keyof SurveyFormData, string>> = {}
      let isValid = true

      if (!formData.email) {
        newErrors.email = 'Email is required.'
        isValid = false
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Invalid email format.'
        isValid = false
      }

      const keys = Object.keys(formData) as Array<keyof SurveyFormData>
      for (const key of keys) {
        if (key !== 'email' && !formData[key]) {
          newErrors[key] = 'This field is required.'
          isValid = false
        }
      }

      if (updateErrors) {
        setErrors(newErrors)
      }
      return isValid
    },
    [formData]
  )

  const onSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }
    setIsSubmitting(true)
    try {
      const mappedData: { [key: string]: string | { value: string; label: string } } = {
        source: isBnb ? 'binance' : 'codatta',
        email: formData.email
      }

      const keys = Object.keys(formData) as Array<keyof SurveyFormData>
      for (const key of keys) {
        if (key !== 'email') {
          const value = formData[key]
          const options = selectOptionsMap[key]?.options || []
          const selectedOption = options.find((option) => option.value === value)
          mappedData[key] = {
            value: value,
            label: selectedOption?.label || ''
          }
        }
      }

      const res = await frontiterApi.submitTask(taskId!, {
        data: mappedData,
        templateId: templateId,
        taskId: taskId
      })

      const resultData = res.data as unknown as {
        status: ResultType
      }

      message.success('Submitted successfully!').then(() => {
        handleResultStatus(resultData?.status)
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitAgain = () => {
    setResultType(null)
    setPrivacyModalOpen(true)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="min-h-screen">
          <h1 className="mx-auto flex max-w-[1272px] items-center justify-between px-6 text-center text-base font-bold leading-[48px] md:leading-[74px]">
            {!isBnb ? (
              <div
                className="flex w-[60px] cursor-pointer items-center gap-2 text-sm font-normal text-[white]"
                onClick={onBack}
              >
                <ArrowLeft size={18} className="md:size-[14px]" /> Back
              </div>
            ) : (
              <div className="w-[60px]" />
            )}
            <div className="flex-1 text-center">Annotator Information Survey</div>
            <div className="w-[60px]" />
          </h1>

          {resultType ? (
            isBnb ? (
              <Result type={resultType} onSubmitAgain={onSubmitAgain} />
            ) : (
              <SubmitSuccessModal points={rewardPoints} open={true} onClose={() => window.history.back()} />
            )
          ) : (
            <div className="mx-auto mt-[22px] max-w-[1272px] px-6 pb-6 md:mt-[48px] md:pb-[48px]">
              <h2 className="p-4 text-left text-base font-bold text-white md:pl-0">Basic Information</h2>
              <ul className="mt-3 space-y-[22px] text-sm md:space-y-[14px]">
                <li>
                  <label
                    className="pl-4 text-[#BBBBBE] md:pl-0 md:text-base md:font-bold md:text-white"
                    htmlFor="email"
                  >
                    Contact Email<span className="text-red-400">*</span>
                  </label>
                  <Input
                    isMobile={isMobile}
                    className="mt-2 rounded-[10px] leading-5 md:rounded-lg md:leading-[22px]"
                    placeholder="Enter your email address"
                    maxLength={256}
                    type="email"
                    value={formData.email}
                    onChange={(value) => updateFormData('email', value)}
                    name="email"
                    onBlur={handleEmailBlur}
                  />
                  {errors.email && <p className="mt-1 pl-4 text-sm text-red-500">{errors.email}</p>}
                </li>
                {basicInfoKeys.map((key) => (
                  <li key={key}>
                    <div className="mb-2 pl-4 text-[#BBBBBE] md:pl-0 md:text-base md:font-bold md:text-white">
                      {selectOptionsMap[key].title}
                      {selectOptionsMap[key].required ? <span className="text-red-400">*</span> : ''}
                    </div>
                    <Select
                      className="rounded-[10px] leading-5 md:rounded-lg md:leading-[22px]"
                      options={[...selectOptionsMap[key].options]}
                      value={formData[key]}
                      onChange={(value) => updateFormData(key, String(value))}
                      placeholder="Select an option"
                      isMobile={isMobile}
                    />
                    {errors[key] && <p className="mt-1 pl-4 text-sm text-red-500 md:pl-0">{errors[key]}</p>}
                  </li>
                ))}
              </ul>
              <h2 className="mt-[22px] px-4 text-left text-base font-bold text-white md:mt-12 md:pl-0 md:text-lg">
                Skills Assessment
              </h2>
              <ul className="mt-3 space-y-[22px] text-sm md:space-y-[14px]">
                {skillsAssessmentKeys.map((key) => (
                  <li key={key}>
                    <div className="mb-2 pl-4 text-[#BBBBBE] md:pl-0 md:text-base md:font-bold md:text-white">
                      {selectOptionsMap[key].title}
                      {selectOptionsMap[key].required ? <span className="text-red-400">*</span> : ''}
                    </div>
                    <Select
                      className="rounded-[10px] leading-5 md:rounded-lg md:leading-[22px]"
                      options={[...selectOptionsMap[key].options]}
                      value={formData[key]}
                      onChange={(value) => updateFormData(key, String(value))}
                      placeholder="Select an option"
                      isMobile={isMobile}
                    />
                    {errors[key] && <p className="mt-1 pl-4 text-sm text-red-500 md:pl-0">{errors[key]}</p>}
                  </li>
                ))}
              </ul>
              <Button
                text="Submit Information"
                className={`h-[44px] w-full rounded-full text-base font-bold ${!validateForm(false) && 'opacity-50'} md:mx-auto md:w-[240px] md:text-sm md:font-normal`}
                onClick={onSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
              {privacyModalOpen && <PrivacyModel onClose={() => setPrivacyModalOpen(false)} />}
            </div>
          )}
        </div>
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/ANNOTATOR_INFO_SURVEY_BASIC/8211237469900109207/task-9-surveya1time
