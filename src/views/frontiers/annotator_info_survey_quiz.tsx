import { Modal, Spin, message } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import SelectCard from '@/components/frontier/info-survey/select-card'
import { Button } from '@/components/booster/button'

import { getQuizQuestions } from '@/components/frontier/info-survey/quiz'
import { QuestionKey, AnswerKey, Question } from '@/components/frontier/info-survey/types'

import frontiterApi from '@/apis/frontiter.api'

interface Props {
  templateId: string
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

export default function AnnotatorInfoSurveySkills({ templateId }: Props) {
  const { taskId, questId = '' } = useParams()
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [pageLoading, setPageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)
  const [answers, setAnswers] = useState<{ [key in QuestionKey]: AnswerKey }>({
    most_proficient_language: '',
    education_level: '',
    occupation: '',
    large_model_familiarity: '',
    coding_ability: '',
    blockchain_domain_knowledge: ''
  })
  const [questions, setQuestions] = useState<Question[]>([])

  const allAnswered = useMemo(() => {
    return Object.values(answers).every((answer) => answer !== '')
  }, [answers])

  const onBack = () => {
    window.history.back()
  }

  const onChange = (key: string, selectedKey: AnswerKey) => {
    console.log(key, selectedKey)
    setAnswers((prev) => ({ ...prev, [key]: selectedKey }))
  }

  const onSubmit = () => {
    if (!allAnswered) {
      const unansweredQuestion = questions.find((q) => !answers[q.key])
      if (unansweredQuestion) {
        message.error(`Please complete the question: "${unansweredQuestion.question}"`)
      }
      return
    }

    setIsSubmitting(true)
    console.log('Submitting answers:', answers)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      message.success('Submitted successfully!')
    }, 2000)
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

      console.log('data_display', taskDetail.data.data_display)

      if (isBnb) {
        const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)
        if (lastSubmission) {
          handleResultStatus(lastSubmission?.status)
        } else if (taskDetail.data.data_display.related_task_id) {
          const relatedLastSubmission = await getLastSubmission(
            taskDetail.data.frontier_id,
            taskDetail.data.data_display.related_task_id
          )
          console.log('relatedLastSubmission', relatedLastSubmission)
        }
      } else {
        const totalRewards = taskDetail.data.reward_info
          .filter((item) => {
            return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          })
          .reduce((acc, cur) => {
            return acc + cur.reward_value
          }, 0)

        setRewardPoints(totalRewards)
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

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="min-h-screen">
          <h1 className="mx-auto flex max-w-[1272px] items-center justify-between px-6 text-center text-base font-bold leading-[48px] md:leading-[74px]">
            {!isBnb ? (
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} className="md:size-[14px]" /> Back
              </div>
            ) : (
              <span></span>
            )}
            <span>Annotator Information Survey</span>
            <span></span>
          </h1>
          <hr className="hidden border-[#FFFFFF1F] md:block" />
          <div className="mx-auto mt-[22px] max-w-[1272px] space-y-[22px] px-6 pb-6 md:mt-[48px] md:space-y-8 md:pb-[48px]">
            {questions.map((item) => (
              <SelectCard
                key={item.key}
                title={item.question}
                question={item.des}
                options={item.options}
                selectedKey={answers[item.key]}
                onChange={(selectedKey) => onChange(item.key, selectedKey)}
              />
            ))}
            <Button
              text="Submit Information"
              onClick={onSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              className={`md:mx-auto md:w-[240px] md:text-sm md:font-normal ${!allAnswered ? 'cursor-not-allowed opacity-50' : ''}`}
            />
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/ANNOTATOR_INFO_SURVEY_QUIZ/8211239602200109208/task-9-surveyb1time
