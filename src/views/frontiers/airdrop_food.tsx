import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Input, InputNumber, message, Spin } from 'antd'

import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import frontiterApi from '@/apis/frontiter.api'
import Guideline, { ExpertRedline } from '@/components/frontier/airdrop/food/guideline'
import Upload from '@/components/frontier/airdrop/UploadImg'

interface FoodFormData {
  images: { url: string; hash: string }[]
  foodName: string
  foodWeight?: number
  cookingMethod: string
  calories?: number
}

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<FoodFormData>({
    images: [],
    foodName: '',
    foodWeight: undefined,
    cookingMethod: '',
    calories: undefined
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({})
  const { taskId } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const allFieldsFilled = useMemo(() => {
    return (
      formData.images.length > 0 &&
      formData.foodName.trim() !== '' &&
      formData.foodWeight !== undefined &&
      formData.cookingMethod.trim() !== '' &&
      formData.calories !== undefined
    )
  }, [formData])

  const updateFormData = (field: keyof FoodFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const clearFormData = () => {
    setFormData({
      images: [],
      foodName: '',
      foodWeight: undefined,
      cookingMethod: '',
      calories: undefined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FoodFormData, string>> = {}

    if (formData.images.length === 0) {
      newErrors.images = 'Please upload one image'
    }
    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required'
    }
    if (!formData.foodWeight) {
      // restrict to number
      if (formData.foodWeight && isNaN(formData.foodWeight)) {
        newErrors.foodWeight = 'Food weight must be a number'
      }
      newErrors.foodWeight = 'Food weight is required'
    }
    if (!formData.cookingMethod.trim()) {
      newErrors.cookingMethod = 'Cooking method is required'
    }
    if (!formData.calories) {
      // restrict to number
      if (formData.calories && isNaN(formData.calories)) {
        newErrors.calories = 'Calories must be a number'
      }
      newErrors.calories = 'Calories is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }

    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        data: formData,
        templateId: templateId,
        taskId: taskId
      })

      clearFormData()

      setModalShow(true)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
    } finally {
      setLoading(false)
    }
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }
      const totalRewards = taskDetail.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      setRewardPoints(totalRewards)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get task detail!')
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  const onBack = () => {
    window.history.back()
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen py-3 md:py-8">
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} /> Back
              </div>
              Food Image Data Collection & Annotation
              <span></span>
            </h1>
          </div>
          <div className="mt-12 bg-[#FFFFFF0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <Guideline />
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
            {/* Images Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Food Image<span className="text-red-400">*</span>
              </label>
              <Upload
                className="rounded-2xl border border-[#FFFFFF1F] p-4"
                value={formData.images}
                allUploadedImages={[...formData.images]}
                onChange={(images) => updateFormData('images', images)}
                description={
                  <div className="text-left text-xs text-[#606067] md:text-center md:text-sm">
                    <p>Photos of ready-to-eat dishes (homemade or restaurant-made)</p>
                    <p>Excludes: Raw ingredients & packaged products</p>
                  </div>
                }
                maxCount={1}
                error={errors.images}
              />
            </div>

            {/* Food Name */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Food Name<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.foodName}
                onChange={(e) => updateFormData('foodName', e.target.value)}
                placeholder="Enter Food name"
                className={`w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${
                  errors.foodName ? 'border-red-500' : ''
                }`}
                maxLength={64}
              />
              {errors.foodName && <p className="text-sm text-red-400">{errors.foodName}</p>}
            </div>

            {/* Food weight */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Food Weight (in grams)<span className="text-red-400">*</span>
              </label>
              <InputNumber
                value={formData.foodWeight}
                onChange={(e) => updateFormData('foodWeight', e)}
                placeholder="Enter weight in grams"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                maxLength={64}
              />
              {errors.foodWeight && <p className="text-sm text-red-400">{errors.foodWeight}</p>}
            </div>

            {/* Cooking method */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Cooking Method<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.cookingMethod}
                onChange={(e) => updateFormData('cookingMethod', e.target.value)}
                placeholder="Describe the cooking method"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                maxLength={128}
              />
              {errors.cookingMethod && <p className="text-sm text-red-400">{errors.cookingMethod}</p>}
            </div>

            {/* Calories */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Calories (kcal)<span className="text-red-400">*</span>
              </label>
              <InputNumber
                value={formData.calories}
                onChange={(e) => updateFormData('calories', e)}
                placeholder="Enter calories (kcal)"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                maxLength={64}
              />
              {errors.calories && <p className="text-sm text-red-400">{errors.calories}</p>}
            </div>
          </div>
          <div className="mt-12 bg-[#D92B2B0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <ExpertRedline />
            </div>
          </div>
          <Button
            text="Submit"
            className={`h-[44px] w-full rounded-full text-base font-bold ${!allFieldsFilled && 'opacity-50'} md:mx-auto md:w-[240px]`}
            onClick={handleSubmit}
          />
          <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm

// http://localhost:5175/frontier/project/AIRDROP_FOOD/8753818682700102523
