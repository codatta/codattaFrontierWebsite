/**
 *  Month2 Week1
 */

import { Spin, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
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
import { FoodDisplayData } from '@/components/frontier/food_tpl_m2/types'

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
  const [data, setData] = useState({} as FoodDisplayData)

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const [annotationDays, displayData] = await Promise.all([
        boosterApi.getFoodAnnotationDays(questId!),
        frontiterApi.getTaskDetail(taskId!)
      ])
      setSubmitted(annotationDays.data.has_current_date)
      setValidatedDays(annotationDays.data.day_count)

      const question = displayData.data.questions as unknown as {
        image_url: string
        num: string
        items: {
          ingredients: string
          cooking_method: string
          category: string
          estimated_calories: string
          model: string
        }[]
      }
      const description = question.items![0]

      setData({
        imgUrl: question.image_url,
        ingredients: description.ingredients,
        cookingMethod: description.cooking_method,
        category: description.category,
        estimatedCalories: description.estimated_calories,
        model: description.model, // for submission
        num: question.num // for submission
      })

      console.log('displayData', displayData)
    } catch (error) {
      message.error(error.message)
    } finally {
      setPageLoading(false)
    }
  }, [questId, taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [questId, checkTaskStatus])

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
            <Form
              taskId={taskId!}
              templateId={templateId}
              onSubmitted={() => setSubmitted(true)}
              model={data.model}
              num={data.num}
            />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm

function DataPreview({ imgUrl, ingredients, cookingMethod, category, estimatedCalories }: FoodDisplayData) {
  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className="overflow-hidden rounded-xl">
        <img src={imgUrl} alt="" className="h-auto w-full" />
      </div>
      <h3 className="mb-2 mt-5 pl-4 font-normal">AI Analysis Result</h3>
      <ul className="rounded-xl bg-[#252532] px-4 py-3 text-base text-white">
        <li className="list-inside list-disc">Ingredients: {ingredients || '--'}</li>
        <li className="list-inside list-disc">Cooking Method: {cookingMethod || '--'}</li>
        <li className="list-inside list-disc">Category: {category || '--'}</li>
        <li className="list-inside list-disc">Estimated Calories: {estimatedCalories || '--'}</li>
      </ul>
    </div>
  )
}

function Form({
  taskId,
  templateId,
  onSubmitted,
  model,
  num
}: {
  taskId: string
  templateId: string
  onSubmitted: () => void
  model: string
  num: string
}) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<'correct' | 'incorrect' | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        num: num,
        data: {
          result: selected,
          models: [model]
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

// http://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-5-food7days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-5-food5days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-5-food1time
// http://localhost:8080/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-5-food7days
