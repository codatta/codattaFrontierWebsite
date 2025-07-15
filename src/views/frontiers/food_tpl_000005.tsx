import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import MobileSelect, { SelectOption } from '@/components/mobile-ui/select'
import frontiterApi, { TaskDetail } from '@/apis/frontiter.api'
import { message, Spin } from 'antd'
import TaskPendingImg from '@/assets/images/task-pending.svg'
import TaskRefusedImg from '@/assets/images/task-reject.svg'
import TaskApproved from '@/assets/images/task-approved.svg'
import { useParams } from 'react-router-dom'
import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'
import AuthChecker from '@/components/app/auth-checker'
import boosterApi from '@/apis/booster.api'

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

const FOOD_ANNOTATION_VALIDATION_DAYS_MAP = new Map([
  ['task-4-food1time', 1],
  ['task-4-food5days', 5],
  ['task-4-food7days', 7]
])

const foodTypeList = [
  { label: 'Vegetarian', value: 'Vegetarian' },
  { label: 'Non-Vegetarian', value: 'Non-Vegetarian' },
  { label: 'Mixed (contains both)', value: 'Mixed (contains both)' }
]

function SubmissionProgress(props: { current: number; target: number }) {
  const { current, target } = props
  return (
    <div className="flex w-full flex-wrap items-center justify-center rounded-full border border-white/10 py-4 text-center">
      <div className="mr-3 text-2xl font-bold">
        <span className="text-[#5DDD22]">{current}</span>
        <span>/{target}</span>
      </div>
      <span>Days Submitted/Required Days</span>
    </div>
  )
}

function PleaseNote(props: { className?: string }) {
  return (
    <div className={`flex w-full items-center gap-3 text-[#BBBBBE] ${props.className}`}>
      <hr className="flex-1 border-[#BBBBBE]" />
      <span className="text-center">Please note</span>
      <hr className="flex-1 border-[#BBBBBE]" />
    </div>
  )
}

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
  const [lastSubmission, setLastSubmission] = useState<TaskDetail>()
  const [uploading, setUploading] = useState(false)
  const { taskId, questId } = useParams()
  const [showView, setShowView] = useState<'PENDING' | 'FORM' | 'REJECT' | 'ADOPT'>('FORM')
  const [foodAnnotationDays, setFoodAnnotationDays] = useState<number>()
  const [validationDays] = useState(FOOD_ANNOTATION_VALIDATION_DAYS_MAP.get(questId!))
  const [hasToday, setHasToday] = useState(false)

  const foodCategories: SelectOption[] = [
    { label: 'Homemade food or snacks', value: 'Homemade food or snacks' },
    { label: 'Dine-out meals', value: 'Dine-out meals' }
    // { label: 'Packaged food', value: 'Packaged food' }
  ]

  useEffect(() => {
    if (!lastSubmission) {
      setShowView('FORM')
      return
    }

    if (['PENDING', 'SUBMITTED'].includes(lastSubmission?.status)) {
      setShowView('PENDING')
    } else if (lastSubmission?.status === 'REFUSED') {
      setShowView('REJECT')
    } else if (lastSubmission?.status === 'ADOPT') {
      if (hasToday) setShowView('ADOPT')
      else setShowView('FORM')
    }
  }, [lastSubmission, hasToday])

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
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: formData
      })

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
      setShowView('PENDING')
    } catch (error) {
      message.error(error.message)
    }
    setIsSubmitting(false)
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
    const res = await frontiterApi.getSubmissionList({ page_num: 1, page_size: 1, frontier_id: frontierId })
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

  async function activeUserAction() {
    setShowView('FORM')
  }

  async function checkTaskStatus() {
    setLoading(true)
    try {
      if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
      const taskDetail = await checkTaskBasicInfo(taskId, templateId)
      const [lastSubmission, annotationDays] = await Promise.all([
        getLastSubmission(taskDetail.frontier_id),
        boosterApi.getFoodAnnotationDays(questId!)
      ])
      setLastSubmission(lastSubmission)
      setFoodAnnotationDays(annotationDays.data.day_count)
      setHasToday(annotationDays.data.has_current_date)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  const MaxValidateDays = useMemo(() => {
    console.log('days chagne, ', foodAnnotationDays, validationDays)
    return Math.min(foodAnnotationDays!, validationDays!)
  }, [foodAnnotationDays, validationDays])

  useEffect(() => {
    checkTaskStatus()
  }, [])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="px-6 py-4 text-center text-base font-bold">Food Image Data Collection & Annotation</div>
        {showView === 'FORM' && (
          <>
            <div className="flex w-full flex-wrap items-center justify-center bg-white/5 py-2 text-center text-sm">
              {!loading ? (
                <>
                  <div className="mr-3 font-bold">
                    <span className="text-[#5DDD22]">{MaxValidateDays}</span>
                    <span>/{validationDays}</span>
                  </div>
                  <span>Days Submitted/Required Days</span>
                </>
              ) : (
                <Loader2 className="size-5 animate-spin"></Loader2>
              )}
            </div>

            <div className="min-h-screen p-4 pb-8 text-white">
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
                              <div className="text-xs text-gray-400">
                                {(imageFile!.size / 1024 / 1024).toFixed(2)} MB
                              </div>
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
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-primary py-4 text-lg font-medium text-white transition-all hover:from-purple-600 hover:to-purple-700 active:scale-[97%] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center py-1">
                        <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {showView === 'ADOPT' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[40px]">
            <object data={TaskApproved} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold">Submission Approved!</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <div className="flex flex-col gap-3 text-[15.5px] text-[#BBBBBE]">
              <p className="text-center text-base font-bold text-[#22DD61]">Today's submission is completed.</p>
              <p className="text-center">
                To receive your reward, please make sure you meet the days requirement and verify the task on the
                Binance Wallet campaign page.
              </p>
              <PleaseNote></PleaseNote>
              <ul className="list-disc pl-4">
                <li>Rewards will be distributed according to Binance campaign rules upon successful verification.</li>
                <li>
                  All submission days are counted based on <span className="font-bold text-[#FFA800]">UTC time</span>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {showView === 'PENDING' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[40px]">
            <object data={TaskPendingImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold text-[#FFA800]">Under Review</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <div className="mb-3 flex flex-col gap-2 text-[15.5px] leading-6 text-white/60">
              <p className="text-center">
                The review results will be available within
                <span className="font-bold text-[#FFA800]"> 15 minutes</span>. Please proceed with verification only
                after your submission has been approved.
              </p>
              <PleaseNote className="my-3" />
              <ul className="list-disc pl-4">
                <li>Rewards will be distributed according to Binance campaign rules upon successful verification. </li>
                <li>
                  All submission days are counted based on <span className="font-bold text-[#FFA800]">UTC time</span>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {showView === 'REJECT' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[40px]">
            <object data={TaskRefusedImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold text-[#D92B2B]">Audit Failed</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <p className="mb-8 text-center text-[15.5px] text-white/60">
              So close! Tweak it and resubmit—you’ve got this!
            </p>
            <button className="block h-[44px] w-full rounded-full bg-white text-black" onClick={activeUserAction}>
              Submit again
            </button>
          </div>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default FoodForm
