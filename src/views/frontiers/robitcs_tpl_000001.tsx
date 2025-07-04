/**
 *  Month2 Week1
 */

import { Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '@udecode/cn'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/food_tpl_m2/submission-progress'
import Result from '@/components/frontier/food_tpl_m2/result'

import { Button } from '@/components/booster/button'

import CheckCircle from '@/assets/common/check-circle.svg?react'

import boosterApi from '@/apis/booster.api'

import { w1_mock_data } from '@/components/frontier/food_tpl_m2/mock'
import frontiterApi from '@/apis/frontiter.api'

/**
 * TODO: Get annotation display data
 * @param param0
 * @returns
 */

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validatedDays, setValidatedDays] = useState(0)
  const [data, setData] = useState(w1_mock_data)

  useEffect(() => {
    setPageLoading(true)
    boosterApi
      .getFoodAnnotationDays(questId!)
      .then((annotationDays) => {
        setSubmitted(annotationDays.data.has_current_date)
        setValidatedDays(annotationDays.data.day_count)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }, [questId])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">AI Analysis Result</h1>
        {submitted ? (
          <Result templateId={templateId} />
        ) : (
          <main>
            <SubmissionProgress questId={questId!} validatedDays={validatedDays} />
            <DataPreview {...data} />
            <Form taskId={taskId!} templateId={templateId} onSubmitted={() => setSubmitted(true)} />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm

function DataPreview({ imgUrl, des }: { imgUrl: string; des: string[] }) {
  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className="overflow-hidden rounded-xl">
        <img src={imgUrl} alt="" className="h-auto w-full" />
      </div>
      <h3 className="mb-2 mt-5 pl-4 font-normal">AI Analysis Result</h3>
      <ul className="rounded-xl bg-[#252532] px-4 py-3 text-base text-white">
        {des.map((item, index) => (
          <li key={'des' + index} className="list-inside list-disc">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Form({ taskId, templateId, onSubmitted }: { taskId: string; templateId: string; onSubmitted: () => void }) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<'correct' | 'incorrect' | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: {
          is_correct: selected === 'correct'
        }
      })
      onSubmitted()
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 px-6">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Please make a judgment on the above*</h3>
      <div className="flex items-center gap-3 text-base text-white">
        <button
          className="flex flex-1 flex-nowrap items-center justify-between rounded-xl bg-[#FFFFFF14] px-4 py-[10px]"
          onClick={() => setSelected('correct')}
        >
          <span>👍 Correct</span> <CheckCircle className={selected === 'correct' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button
          className="flex flex-1 flex-nowrap items-center justify-between rounded-xl bg-[#FFFFFF14] px-4 py-[10px]"
          onClick={() => setSelected('incorrect')}
        >
          <span>👎 Incorrect</span> <CheckCircle className={selected === 'incorrect' ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>
      <Button
        text="Confirm"
        onClick={handleSubmit}
        className={cn(
          'mt-4 w-full rounded-full bg-primary px-4 leading-[44px] text-white',
          !selected ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        disabled={!selected}
        loading={loading}
      />
    </div>
  )
}
