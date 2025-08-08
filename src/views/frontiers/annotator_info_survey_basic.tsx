import { Spin } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import Input from '@/components/frontier/info-survey/input'
import Select from '@/components/frontier/info-survey/select'
import { selectOptionsMap } from '@/components/frontier/info-survey/basic'

import { useIsMobile } from '@/hooks/use-is-mobile'

export default function AnnotatorInfoSurveyBasic({ templateId }: { templateId: string }) {
  const { taskId, questId = '' } = useParams()
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [pageLoading, setPageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allAnswered, setAllAnswered] = useState(false)
  const isMobile = useIsMobile()

  const onBack = () => {
    window.history.back()
  }

  const onSubmit = () => {
    // if (!allAnswered) {
    //   const unansweredQuestion = questions.find((q) => !answers[q.key])
    //   if (unansweredQuestion) {
    //     message.error(`Please complete the question: "${unansweredQuestion.question}"`)
    //   }
    //   return
    // }

    setIsSubmitting(true)
    // console.log('Submitting answers:', answers)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // message.success('Submitted successfully!')
    }, 2000)
  }

  const handleEmailChange = (value: string) => {
    console.log('handleEmailChange', value)
  }

  useEffect(() => {
    setPageLoading(false)
    setAllAnswered(false)
    console.log('CollectionTpl0001', taskId, questId, templateId)
    for (const key of ['country_of_residence', 'most_proficient_language', 'education_level', 'occupation']) {
      console.log(key, selectOptionsMap[key])
    }
  }, [taskId, questId, templateId])

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
          <div className="mx-auto mt-[22px] max-w-[1272px] px-6 pb-6 md:mt-[48px] md:pb-[48px]">
            <h2 className="px-4 text-left text-base font-bold text-white">Basic Information</h2>
            <ul className="mt-3 space-y-[22px] text-sm md:space-y-8">
              <li>
                <div className="mb-2 pl-4 text-[#BBBBBE]">Contact Email*</div>
                <Input
                  isMobile={isMobile}
                  className="rounded-[10px] leading-5"
                  placeholder=""
                  maxLength={256}
                  onChange={handleEmailChange}
                />
              </li>
              {['country_of_residence', 'most_proficient_language', 'education_level', 'occupation'].map(
                (key) =>
                  selectOptionsMap[key] && (
                    <li key={key}>
                      <div className="mb-2 pl-4 text-[#BBBBBE]">{selectOptionsMap[key].title}</div>
                      <Select
                        className="rounded-[10px] leading-5"
                        options={selectOptionsMap[key].options}
                        value={''}
                        onChange={() => {}}
                        placeholder=""
                        isMobile={isMobile}
                      />
                    </li>
                  )
              )}
            </ul>
            <h2 className="mt-[22px] px-4 text-left text-base font-bold text-white">Skills Assessment</h2>
            <ul className="mt-3 space-y-[22px] text-sm md:space-y-8">
              {['large_model_familiarity', 'coding_ability', 'blockchain_domain_knowledge'].map((key) => (
                <li key={key}>
                  <div className="mb-2 pl-4 text-[#BBBBBE]">{selectOptionsMap[key].title}</div>
                  <Select
                    className="rounded-[10px] leading-5"
                    options={selectOptionsMap[key].options}
                    value={''}
                    onChange={() => {}}
                    placeholder=""
                    isMobile={isMobile}
                  />
                </li>
              ))}
            </ul>

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

// http://localhost:5175/frontier/project/ANNOTATOR_INFO_SURVEY_BASIC/8202162439800108848/task-9-surveya1time
