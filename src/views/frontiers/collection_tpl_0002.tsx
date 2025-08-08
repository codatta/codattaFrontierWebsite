import { Spin, message } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import SelectCard from '@/components/frontier/info-collection/select-card'
import { Button } from '@/components/booster/button'

import { getQuizQuestions, QuestionKey, AnswerKey } from '@/components/frontier/info-collection/quiz'

interface Props {
  templateId: string
}

export default function CollectionTpl0002({ templateId }: Props) {
  const { taskId, questId = '' } = useParams()
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [pageLoading, setPageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<{ [key in QuestionKey]: AnswerKey }>({
    most_proficient_language: '',
    education_level: '',
    occupation: '',
    large_model_familiarity: '',
    coding_ability: '',
    blockchain_domain_knowledge: ''
  })
  const [questions, setQuestions] = useState(getQuizQuestions())

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
            <span>Personal Information Collection</span>
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

// http://localhost:5175/frontier/project/PERSONAL_INFO_COLLECTION_0002/8202164179200108849/task-9-collectionb1time
