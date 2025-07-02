/**
 *  Month2 Week1
 */

import { Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@udecode/cn'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/food_tpl_m2/submission-progress'

import CheckCircle from '@/assets/common/check-circle.svg?react'
import ApprovedIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg?react'

type ModelInfo = {
  modelA: {
    name: string
    'fine-tuning'?: string
  }
  modelB: {
    name: string
    'fine-tuning'?: string
  }
}

type FoodFormItem = {
  modelA: string
  modelB: string
  other: string
}
type FoodFormData = {
  imgUrl: string
  ingredients: FoodFormItem
  cookingMethod: FoodFormItem
  category: FoodFormItem
  estimatedCalories: FoodFormItem
}

type SelectOption = 'modelA' | 'modelB' | 'other' | null

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    modelA: {
      name: 'GPT-4V',
      'fine-tuning': 'Before Fine-tuning'
    },
    modelB: {
      name: 'Gemini 1.5 Pro',
      'fine-tuning': 'After Fine-tuning'
    }
  })
  const [data, setData] = useState<FoodFormData>({
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
  })

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Model Comparison Review</h1>
        {submitted ? (
          <Result modelInfo={modelInfo} templateId={templateId} />
        ) : (
          <main>
            <SubmissionProgress current={1} target={7} />
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
  const [formData, setFormData] = useState<{
    ingredients: SelectOption | null
    cookingMethod: SelectOption | null
    category: SelectOption | null
    estimatedCalories: SelectOption | null
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
    <div className="mt-5 px-6 pb-5 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className="overflow-hidden rounded-xl">
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

      <button
        className={cn(
          'mt-4 w-full rounded-full bg-primary px-4 leading-[44px] text-white',
          !selected ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        onClick={handleSubmit}
      >
        Confirm
      </button>
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

function Result({ modelInfo, templateId }: { modelInfo: ModelInfo; templateId: string }) {
  const [week, setWeek] = useState('1')

  useEffect(() => {
    console.log(templateId, 'templateId')
    const reg = /FOOD_TPL_M2_W(\d)/
    const match = templateId.match(reg)
    if (match) {
      setWeek(match[1])
    }
  }, [templateId])

  return (
    <div className="px-6">
      <ApprovedIcon className="mx-auto mt-[50px]" />
      <h2 className="mt-8 text-center text-2xl font-bold">Submission approved!</h2>
      <div className="mt-6">
        <div className="flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
          <span>Model A</span>
          <div className="flex items-center">
            {modelInfo.modelA.name}
            {modelInfo.modelA['fine-tuning'] && (
              <div className="ml-2 rounded-full bg-[#875DFF1F] px-[6px] text-xs leading-6">
                {modelInfo.modelA['fine-tuning']}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
          <span>Model B</span>
          <div className="flex items-center">
            {modelInfo.modelB.name}
            {modelInfo.modelB['fine-tuning'] && (
              <div className="ml-2 rounded-full bg-[#5DDD221F] px-[6px] text-xs leading-6">
                {modelInfo.modelB['fine-tuning']}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-base text-[#BBBBBE]">
        {week === '4'
          ? 'Thank you for participating in our two-month model iteration journey. Your data submission and annotation contributed to the entire process, from data collection and cleaning to model fine-tuning and deployment. We sincerely appreciate your support in helping us improve our AI models.'
          : 'Thank you for your data annotation. We will use your submission for fine-tuning to improve our model capabilities.'}
      </p>
    </div>
  )
}

// http://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food5days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food1time
// http://localhost:8080/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
