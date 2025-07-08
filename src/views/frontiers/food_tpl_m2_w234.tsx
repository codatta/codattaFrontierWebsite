/**
 *  Month2 Week1
 */

import { message, Spin } from 'antd'
import { cn } from '@udecode/cn'
import { useCallback, useEffect, useMemo, useState } from 'react'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/food_tpl_m2/submission-progress'
import Result from '@/components/frontier/food_tpl_m2/result'
import { Button } from '@/components/booster/button'

import { FoodFormData, ModelInfo, SelectOption } from '@/components/frontier/food_tpl_m2/types'

import boosterApi from '@/apis/booster.api'
import { useParams } from 'react-router-dom'
import { w234_mock_data, w234_mock_model_info } from '@/components/frontier/food_tpl_m2/mock'
import frontiterApi from '@/apis/frontiter.api'

const extractDaysFromString = (str?: string): number => {
  const match = str?.match(/-food(\d+)/)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 1
}

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()

  const [pageLoading, setPageLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validatedDays, setValidatedDays] = useState(0)
  const [modelInfo] = useState<ModelInfo>(w234_mock_model_info)
  const [data] = useState<FoodFormData>(w234_mock_data)
  // const [modelInfo, _setModelInfo] = useState<ModelInfo>()
  // const [data, _setData] = useState<FoodFormData>()
  const maxValidateDays = useMemo(() => extractDaysFromString(questId), [questId])

  const checkTaskStatus = useCallback(() => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)
    boosterApi
      .getFoodAnnotationDays(questId!)
      .then((annotationDays) => {
        setSubmitted(annotationDays.data.has_current_date || maxValidateDays <= annotationDays.data.day_count)
        setValidatedDays(annotationDays.data.day_count)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }, [questId, taskId, templateId, maxValidateDays])

  useEffect(() => {
    checkTaskStatus()
  }, [questId, checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Model Comparison Review</h1>
        {submitted ? (
          <Result modelInfo={modelInfo} templateId={templateId} />
        ) : (
          <main className="mb-5">
            <SubmissionProgress maxValidateDays={maxValidateDays} validatedDays={validatedDays} />
            <Form data={data} taskId={taskId!} templateId={templateId} onSubmitted={() => setSubmitted(true)} />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm

function Form({
  data,
  taskId,
  templateId,
  onSubmitted
}: {
  data: FoodFormData
  taskId: string
  templateId: string
  onSubmitted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    ingredients: SelectOption
    cookingMethod: SelectOption
    category: SelectOption
    estimatedCalories: SelectOption
  }>({
    ingredients: null,
    cookingMethod: null,
    category: null,
    estimatedCalories: null
  })
  const selected = useMemo(() => {
    return !Object.values(formData).includes(null)
  }, [formData])

  const handleSelect = (type: string, value: SelectOption) => {
    setFormData({
      ...formData,
      [type]: value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: Object.assign({}, formData)
      })
      onSubmitted()
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className="mb-[22px] overflow-hidden rounded-xl">
        <img src={data.imgUrl} alt="" className="h-auto w-full" />
      </div>
      <FormSection
        title="Ingredients"
        {...data.ingredients}
        onSelect={(value: SelectOption) => handleSelect('ingredients', value)}
      />
      <FormSection
        title="Cooking Method"
        {...data.cookingMethod}
        onSelect={(value: SelectOption) => handleSelect('cookingMethod', value)}
      />
      <FormSection
        title="Category"
        {...data.category}
        onSelect={(value: SelectOption) => handleSelect('category', value)}
      />
      <FormSection
        title="Estimated Calories"
        {...data.estimatedCalories}
        onSelect={(value: SelectOption) => handleSelect('estimatedCalories', value)}
      />

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

function FormSection({
  title,
  modelA,
  modelB,
  other,
  onSelect
}: {
  title: string
  modelA: string
  modelB: string
  other: string
  onSelect: (value: SelectOption) => void
}) {
  const [selected, setSelected] = useState<SelectOption>(null)

  const handleSelect = (value: SelectOption) => {
    if (selected === value) {
      setSelected(null)
      onSelect(null)
    } else {
      setSelected(value)
      onSelect(value)
    }
  }

  return (
    <div className="mb-[22px]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">{title}</h3>
      <div className="space-y-3 text-base text-white">
        <div
          className={cn(
            'flex items-center justify-between gap-[10px] rounded-xl border bg-[#252532] py-[10px] pl-4 pr-3',
            selected === 'modelA' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('modelA')}
        >
          {modelA} <span className="rounded-md bg-[#875DFF3D] px-[6px] py-1 text-xs">ModelA</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between gap-[10px] rounded-xl border bg-[#252532] py-[10px] pl-4 pr-3',
            selected === 'modelB' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('modelB')}
        >
          {modelB} <span className="rounded-md bg-[#875DFF3D] px-[6px] py-1 text-xs">ModelB</span>
        </div>
        <div
          className={cn(
            'rounded-xl border bg-[#252532] py-[10px] pl-4 pr-3',
            selected === 'other' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('other')}
        >
          {other}
        </div>
      </div>
    </div>
  )
}

// http://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food5days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food1time
// http://localhost:8080/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
