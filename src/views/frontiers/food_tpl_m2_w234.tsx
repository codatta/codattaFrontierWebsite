/**
 *  Month2 Week1
 */

import { Spin } from 'antd'
import { cn } from '@udecode/cn'
import { useEffect, useMemo, useState } from 'react'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/food_tpl_m2/submission-progress'
import Result from '@/components/frontier/food_tpl_m2/result'

import { Button } from '@/components/booster/button'
import { FoodFormData, FoodFormItem, ModelInfo, SelectOption } from '@/components/frontier/food_tpl_m2/types'

import boosterApi from '@/apis/booster.api'
import { useParams } from 'react-router-dom'

const MockModelInfo: ModelInfo = {
  modelA: {
    name: 'GPT-4V',
    'fine-tuning': 'Before Fine-tuning'
  },
  modelB: {
    name: 'Gemini 1.5 Pro',
    'fine-tuning': 'After Fine-tuning'
  }
}

const MockData = {
  imgUrl: '/food-example.jpg',
  ingredients: {
    modelA: 'Lettuce, cherry tomatoes,cucumber, boiled egg,olive oil',
    modelB: 'Lettuce, tomato, cucumber, grilled chicken,feta cheese',
    other: "It's a tie"
  },
  cookingMethod: {
    modelA: 'Raw, ingredients are washed and mixed, egg is boiled',
    modelB: 'Grilled chicken, vegetables are fresh and mixed',
    other: "It's a tie"
  },
  category: {
    modelA: 'Salad (Vegetable-based)',
    modelB: 'Salad (With protein)',
    other: "It's a tie"
  },
  estimatedCalories: {
    modelA: '120 kcal (per serving)',
    modelB: '210 kcal (per serving)',
    other: "It's a tie"
  }
}

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [modelInfo, setModelInfo] = useState<ModelInfo>(MockModelInfo)
  const [data, setData] = useState<FoodFormData>(MockData)

  useEffect(() => {
    boosterApi.getTaskInfo(templateId).then((res) => {
      console.log(res)
    })
    console.log(templateId, 'templateId')
    // setLoading(true)
  }, [templateId])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Model Comparison Review</h1>
        {submitted ? (
          <Result modelInfo={modelInfo} templateId={templateId} />
        ) : (
          <main className="mb-5">
            <SubmissionProgress questId={questId!} />
            <Form {...data} />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm

function Form({
  imgUrl,
  ingredients,
  cookingMethod,
  category,
  estimatedCalories
}: {
  imgUrl: string
  ingredients: FoodFormItem
  cookingMethod: FoodFormItem
  category: FoodFormItem
  estimatedCalories: FoodFormItem
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

  const handleSubmit = () => {}

  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className="mb-[22px] overflow-hidden rounded-xl">
        <img src={imgUrl} alt="" className="h-auto w-full" />
      </div>
      <FormSection
        title="Ingredients"
        {...ingredients}
        onSelect={(value: SelectOption) => handleSelect('ingredients', value)}
      />
      <FormSection
        title="Cooking Method"
        {...cookingMethod}
        onSelect={(value: SelectOption) => handleSelect('cookingMethod', value)}
      />
      <FormSection title="Category" {...category} onSelect={(value: SelectOption) => handleSelect('category', value)} />
      <FormSection
        title="Estimated Calories"
        {...estimatedCalories}
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
