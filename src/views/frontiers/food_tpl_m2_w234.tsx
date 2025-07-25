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

import { FoodFormData, ModelInfo, ResultType, SelectOption } from '@/components/frontier/food_tpl_m2/types'

import boosterApi from '@/apis/booster.api'
import { useParams } from 'react-router-dom'
// import { w234_mock_model_info } from '@/components/frontier/food_tpl_m2/mock'
import frontiterApi from '@/apis/frontiter.api'

type Result = [{ model_name: string; model_type: string }, { model_name: string; model_type: string }]

const extractDaysFromString = (str?: string): number => {
  const match = str?.match(/-food(\d+)/)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 1
}

async function getLastSubmission(frontierId: string) {
  const res = await frontiterApi.getSubmissionList({ page_num: 1, page_size: 1, frontier_id: frontierId })
  const lastSubmission = res.data[0]
  return lastSubmission
}

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()

  const [pageLoading, setPageLoading] = useState(false)
  const [resultType, setResultType] = useState<'PENDING' | 'REJECT' | 'ADOPT' | null>(null)
  const [validatedDays, setValidatedDays] = useState(0)
  const [modelInfo, setModelInfo] = useState<ModelInfo>()
  const [data, setData] = useState<FoodFormData>()

  const maxValidateDays = useMemo(() => extractDaysFromString(questId), [questId])

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }
    let adopt = false

    try {
      setPageLoading(true)

      const [annotationDays, displayData] = await Promise.all([
        boosterApi.getFoodAnnotationDays(questId!),
        frontiterApi.getTaskDetail(taskId!)
      ])

      const lastSubmission = await getLastSubmission(displayData.data.frontier_id)

      if (lastSubmission) {
        if (['PENDING', 'SUBMITTED'].includes(lastSubmission.status)) {
          setResultType('PENDING')
        } else if (lastSubmission.status === 'REFUSED') {
          setResultType('REJECT')
        } else if (lastSubmission.status === 'ADOPT') {
          if (annotationDays.data.has_current_date || maxValidateDays <= annotationDays.data.day_count) {
            setResultType('ADOPT')
            adopt = true
          }
        }
      }

      setValidatedDays(annotationDays.data.day_count)

      if (adopt && annotationDays.data.question_result) {
        const result = annotationDays.data.question_result.items
        setModelInfo({
          modelA: {
            displayName: result[0].model_name,
            type: result[0].model_type
          },
          modelB: {
            displayName: result[1].model_name,
            type: result[1].model_type
          }
        })
      }

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
      const modelAData = question.items![0]
      const modelBData = question.items![1]

      if (!modelAData || !modelBData) {
        message.error('Model data is required!')
        return
      }

      setData({
        imgUrl: question.image_url,
        num: question.num,
        modelA: {
          name: modelAData.model,
          ingredients: modelAData.ingredients,
          cookingMethod: modelAData.cooking_method,
          category: modelAData.category,
          estimatedCalories: modelAData.estimated_calories
        },
        modelB: {
          name: modelBData.model,
          ingredients: modelBData.ingredients,
          cookingMethod: modelBData.cooking_method,
          category: modelBData.category,
          estimatedCalories: modelBData.estimated_calories
        }
      })

      console.log('displayData', displayData)
    } catch (error) {
      console.error(error)
    } finally {
      setPageLoading(false)
    }
  }, [questId, taskId, templateId, maxValidateDays])

  const onSubmitted = ({ result, status }: { result: Result; status: ResultType }) => {
    console.log('onSubmitted', result)
    setModelInfo({
      modelA: {
        displayName: result[0].model_name,
        type: result[0].model_type
      },
      modelB: {
        displayName: result[1].model_name,
        type: result[1].model_type
      }
    })
    if (status === 'ADOPT') {
      setValidatedDays(validatedDays + 1)
    }
    setResultType(status)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [questId, checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Model Comparison Review</h1>
        {resultType ? (
          <Result
            modelInfo={modelInfo}
            templateId={templateId}
            type={resultType}
            maxValidateDays={maxValidateDays}
            validatedDays={validatedDays}
            onSubmitAgain={() => setResultType(null)}
          />
        ) : (
          <main className="mb-5">
            {maxValidateDays > 1 && (
              <SubmissionProgress maxValidateDays={maxValidateDays} validatedDays={validatedDays} />
            )}
            <Form data={data} taskId={taskId!} templateId={templateId} onSubmitted={onSubmitted} />
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
  data?: FoodFormData
  taskId: string
  templateId: string
  onSubmitted: (result: { result: Result; status: ResultType }) => void
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
      const res = await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        num: data!.num,
        data: Object.assign(
          {
            models: [data!.modelA.name, data!.modelB.name]
          },
          formData
        )
      })
      const resultData = res.data as unknown as {
        data_submission: {
          question_result: {
            items: Result
          }
        }
        status: ResultType
      }
      const result = resultData.data_submission.question_result.items
      console.log('result', result)
      onSubmitted({
        result: result,
        status: resultData.status
      })
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div className={cn('mb-[22px] overflow-hidden rounded-xl', data?.imgUrl ? '' : 'h-[200px] bg-[#252532]')}>
        <img src={data?.imgUrl || ''} alt="" className="h-auto w-full" />
      </div>
      <FormSection
        title="Ingredients"
        modelAVal={data?.modelA.ingredients || '--'}
        modelBVal={data?.modelB.ingredients || '--'}
        onSelect={(value: SelectOption) => handleSelect('ingredients', value)}
      />
      <FormSection
        title="Cooking Method"
        modelAVal={data?.modelA.cookingMethod || '--'}
        modelBVal={data?.modelB.cookingMethod || '--'}
        onSelect={(value: SelectOption) => handleSelect('cookingMethod', value)}
      />
      <FormSection
        title="Category"
        modelAVal={data?.modelA.category || '--'}
        modelBVal={data?.modelB.category || '--'}
        onSelect={(value: SelectOption) => handleSelect('category', value)}
      />
      <FormSection
        title="Estimated Calories"
        modelAVal={data?.modelA.estimatedCalories || '--'}
        modelBVal={data?.modelB.estimatedCalories || '--'}
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
  modelAVal,
  modelBVal,
  onSelect
}: {
  title: string
  modelAVal: string
  modelBVal: string
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
            selected === 'a_better' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('a_better')}
        >
          {modelAVal} <span className="rounded-md bg-[#875DFF3D] px-[6px] py-1 text-xs">ModelA</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between gap-[10px] rounded-xl border bg-[#252532] py-[10px] pl-4 pr-3',
            selected === 'b_better' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('b_better')}
        >
          {modelBVal} <span className="rounded-md bg-[#875DFF3D] px-[6px] py-1 text-xs">ModelB</span>
        </div>
        <div
          className={cn(
            'rounded-xl border bg-[#252532] py-[10px] pl-4 pr-3',
            selected === 'tie' ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => handleSelect('tie')}
        >
          It‘s a tie
        </div>
      </div>
    </div>
  )
}

// http://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food5days
// https://app-test.b18a.io/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food1time
// http://localhost:8080/frontier/project/FOOD_TPL_M2_W1/7890645093800107259/task-food7days
