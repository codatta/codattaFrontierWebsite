import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { message, Spin } from 'antd'

import MobileSelect, { SelectOption } from '@/components/mobile-ui/select'
import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import Result from '@/components/frontier/info-survey/result-w12'

import { calculateFileHash } from '@/utils/file-hash'

import frontiterApi from '@/apis/frontiter.api'
import commonApi from '@/api-v1/common.api'

interface FoodFormData {
  images: { url: string; hash: string }[]
  foodName: string
  foodCategory: string
  brand: string
  foodType: string
  quantity: string
  foodWeight?: number
  cookingMethod: string
  calories?: number
}

const foodTypeList = [
  { label: 'Vegetarian', value: 'Vegetarian' },
  { label: 'Non-Vegetarian', value: 'Non-Vegetarian' },
  { label: 'Mixed (contains both)', value: 'Mixed (contains both)' }
]

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<FoodFormData>({
    images: [],
    foodName: '',
    foodCategory: '',
    brand: '',
    foodType: '',
    quantity: '',
    foodWeight: undefined,
    cookingMethod: '',
    calories: undefined
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { taskId } = useParams()
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)

  const allFieldsFilled = useMemo(() => {
    return (
      formData.images.length > 0 &&
      formData.foodName.trim() !== '' &&
      formData.foodCategory !== '' &&
      formData.foodType !== '' &&
      formData.quantity !== '' &&
      formData.foodWeight !== undefined &&
      formData.cookingMethod.trim() !== '' &&
      formData.calories !== undefined
    )
  }, [formData])

  const foodCategories: SelectOption[] = [
    { label: 'Homemade food or snacks', value: 'Homemade food or snacks' },
    { label: 'Dine-out meals', value: 'Dine-out meals' }
    // { label: 'Packaged food', value: 'Packaged food' }
  ]

  const handleResultStatus = (status: string = '') => {
    status = status.toLocaleUpperCase()
    if (['PENDING', 'SUBMITTED'].includes(status)) {
      setResultType('PENDING')
    } else if (status === 'REFUSED') {
      setResultType('REJECT')
    } else if (status === 'ADOPT') {
      setResultType('ADOPT')
    } else {
      setResultType(null)
    }
  }

  const quantities = [
    { value: 'Individual (1 person)', label: 'Individual (1 person)' },
    { value: 'Small group (2–4 people)', label: 'Small group (2–4 people)' },
    { value: 'Large group (4 or more people)', label: 'Large group (4 or more people)' }
  ]

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
      foodCategory: '',
      brand: '',
      foodType: '',
      quantity: '',
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
      newErrors.images = 'Please upload at least one image'
    }
    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required'
    }
    if (!formData.foodCategory) {
      newErrors.foodCategory = 'Food category is required'
    }
    if (!formData.foodType) {
      newErrors.foodType = 'Food type is required'
    }
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required'
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

    setIsSubmitting(true)
    try {
      const res = await frontiterApi.submitTask(taskId!, {
        data: formData,
        templateId: templateId,
        taskId: taskId
      })

      const resultData = res.data as unknown as {
        status: 'ADOPT' | 'PENDING' | 'REJECT'
      }

      clearFormData()

      message.success('Submitted successfully!').then(() => {
        handleResultStatus(resultData?.status)
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    // image file size check
    const imageFile = Array.from(files)[0]
    if (imageFile.size > 20 * 1024 * 1024) {
      message.error('Image size must be less than 20MB')
      return
    }

    // image file type check
    if (!imageFile.type.startsWith('image/')) {
      message.error('Please upload an image file')
      return
    }

    setUploading(true)
    try {
      const hash = await calculateFileHash(imageFile)
      const res = await commonApi.uploadFile(imageFile)
      updateFormData('images', [{ url: res.file_path, hash: hash }])
      setImageFile(imageFile)
    } catch (error) {
      message.error(error.message)
    }
    setUploading(false)
  }

  const removeImage = () => {
    updateFormData('images', [])
    setImageFile(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  async function getLastSubmission(frontierId: string) {
    const res = await frontiterApi.getSubmissionList({
      page_num: 1,
      page_size: 1,
      frontier_id: frontierId,
      task_ids: taskId
    })
    const lastSubmission = res.data[0]
    return lastSubmission
  }

  async function checkTaskBasicInfo(taskId: string, templateId: string) {
    const res = await frontiterApi.getTaskDetail(taskId)
    const { data_display } = res.data
    if (data_display.template_id !== templateId) {
      console.log(data_display.template_id, templateId)
      throw new Error('Template not match!')
    }
    return res.data
  }

  function onSubmitAgain() {
    setResultType(null)
  }

  async function checkTaskStatus() {
    setLoading(true)
    try {
      if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
      const taskDetail = await checkTaskBasicInfo(taskId, templateId)
      const lastSubmission = await getLastSubmission(taskDetail.frontier_id)
      handleResultStatus(lastSubmission?.status)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="px-6 py-4 text-center text-base font-bold">Food Image Data Collection & Annotation</div>
        {!resultType ? (
          <div className="min-h-screen p-6 pb-8 text-white">
            <div className="mx-auto max-w-md space-y-6">
              {/* Images Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Food Image<span className="text-red-400">*</span>
                </label>
                <Spin spinning={uploading}>
                  {formData.images.length === 0 ? (
                    <div className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex size-24 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/15 ${
                          errors.images ? 'border border-red-500' : ''
                        }`}
                      >
                        <Plus className="size-8" />
                      </button>
                      <div className="flex-1 text-sm leading-relaxed text-white/50">
                        Photos of ready-to-eat dishes (homemade or restaurant-made) <br />
                        Excludes: Raw ingredients & packaged products
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* {formData.images.map((file, index) => ( */}
                      <div className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3">
                        <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-white/10">
                          <img src={createImagePreview(imageFile!)} className="size-full object-cover" />
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <div className="w-full text-sm text-white">
                            <div className="mb-1 line-clamp-2 max-w-[180px] font-medium">{imageFile!.name}</div>
                            <div className="text-xs text-gray-400">{(imageFile!.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage()}
                            className="group rounded-full p-2 transition-colors hover:bg-white/10"
                          >
                            <X className="size-5 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                      {/* ))} */}

                      {formData.images.length < 1 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full rounded-lg border-2 border-dashed border-white/20 py-3 text-sm text-gray-400 transition-colors hover:border-white/30"
                        >
                          + Add more images
                        </button>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </Spin>

                {errors.images && <p className="text-sm text-red-400">{errors.images}</p>}
              </div>

              {/* Food Name */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Food Name<span className="text-red-400">*</span>
                </label>
                <input
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

              {/* Food Category */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Food Category<span className="text-red-400">*</span>
                </label>
                <MobileSelect
                  options={foodCategories}
                  value={formData.foodCategory}
                  placeholder="Select"
                  title="Food Category"
                  height={300}
                  onChange={(value) => {
                    updateFormData('foodCategory', value)
                  }}
                />
                {errors.foodCategory && <p className="text-sm text-red-400">{errors.foodCategory}</p>}
              </div>

              {/* Brand */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  maxLength={64}
                />
              </div>

              {/* Region */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Food Type<span className="text-red-400">*</span>
                </label>
                <MobileSelect
                  options={foodTypeList}
                  value={formData.foodType}
                  placeholder="Select"
                  title="Food Type"
                  height={300}
                  onChange={(value) => {
                    updateFormData('foodType', value)
                  }}
                />
                {errors.foodType && <p className="text-sm text-red-400">{errors.foodType}</p>}
              </div>

              {/* Quantity of food */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Quantity of food<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MobileSelect
                    options={quantities}
                    value={formData.quantity}
                    placeholder="Select"
                    title="Quantity of food"
                    height={300}
                    onChange={(value) => {
                      updateFormData('quantity', value)
                    }}
                  />
                </div>
                {errors.quantity && <p className="text-sm text-red-400">{errors.quantity}</p>}
              </div>

              {/* Food weight */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Food Weight (in grams)<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.foodWeight}
                  onChange={(e) => updateFormData('foodWeight', e.target.value)}
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
                <input
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
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => updateFormData('calories', e.target.value)}
                  placeholder="Enter calories (kcal)"
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  maxLength={64}
                />
                {errors.calories && <p className="text-sm text-red-400">{errors.calories}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  text="Submit"
                  className={`w-full rounded-full bg-primary py-4 text-lg font-medium text-white transition-all hover:from-purple-600 hover:to-purple-700 active:scale-[97%] disabled:cursor-not-allowed ${!allFieldsFilled ? 'opacity-50' : ''}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </div>
        ) : (
          <Result type={resultType} onSubmitAgain={onSubmitAgain} />
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm
