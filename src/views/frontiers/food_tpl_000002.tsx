import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import MobileSelect, { SelectOption } from '@/components/mobile-ui/select'
import { regionList } from '@/components/frontier/region-list'
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
  region: string
  quantity: string
}

const FOOD_ANNOTATION_VALIDATION_DAYS_MAP = new Map([
  ['task-food1time', 1],
  ['task-food5days', 5],
  ['task-food7days', 7]
])

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

const FoodForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<FoodFormData>({
    images: [],
    foodName: '',
    foodCategory: '',
    brand: '',
    region: '',
    quantity: ''
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
  const [validationDays, setValidationDays] = useState(FOOD_ANNOTATION_VALIDATION_DAYS_MAP.get(questId!))

  const foodCategories: SelectOption[] = [
    { label: 'Homemade food or snacks', value: 'Homemade food or snacks' },
    { label: 'Dine-out meals', value: 'Dine-out meals' },
    { label: 'Packaged food', value: 'Packaged food' }
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
      setShowView('ADOPT')
    }
  }, [lastSubmission])

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
    if (!formData.region) {
      newErrors.region = 'Region is required'
    }
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required'
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
        region: '',
        quantity: ''
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
    setLastSubmission(lastSubmission)
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

  // async function handleBack() {
  //   window.close()
  // }

  async function checkTaskStatus() {
    setLoading(true)
    try {
      if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
      const taskDetail = await checkTaskBasicInfo(taskId, templateId)
      await getLastSubmission(taskDetail.frontier_id)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function getFoodAnnotationDays() {
    const res = await boosterApi.getFoodAnnotationDays()
    setFoodAnnotationDays(res.data.day_count)
  }

  const MaxValidateDays = useMemo(() => {
    console.log('days chagne, ', foodAnnotationDays, validationDays)
    return Math.min(foodAnnotationDays!, validationDays!)
  }, [foodAnnotationDays, validationDays])

  useEffect(() => {
    checkTaskStatus()
    getFoodAnnotationDays()
  }, [])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="mb-4 px-6 py-4 text-center text-base font-bold">Food Image Data Collection & Annotation</div>
        {showView === 'FORM' && (
          <div className="min-h-screen p-4 pb-8 text-white">
            <div className="mx-auto max-w-md space-y-6">
              {/* Images Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
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
                      <div className="flex-1 text-sm leading-relaxed">
                        Please upload a high-quality food image with clear visibility and optimal lighting conditions.
                        <br />
                        <span className="text-xs text-gray-500">
                          Supported formats: JPEG, PNG, WEBP, GIF • Maximum file size: 20MB
                        </span>
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
                />
                {errors.foodName && <p className="text-sm text-red-400">{errors.foodName}</p>}
              </div>

              {/* Food Category */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
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
                />
              </div>

              {/* Region */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Region<span className="text-red-400">*</span>
                </label>
                <MobileSelect
                  options={regionList}
                  value={formData.region}
                  placeholder="Select"
                  title="Region"
                  searchable
                  height={500}
                  onChange={(value) => {
                    updateFormData('region', value)
                  }}
                />
                {errors.region && <p className="text-sm text-red-400">{errors.region}</p>}
              </div>

              {/* Quantity of food */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
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

              {/* Is it high in calories */}
              {/* <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Is it high in calories?</label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => updateFormData('isHighCalories', true)}
                  className={`flex flex-1 rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                    formData.isHighCalories ? 'border-primary' : 'border-white/5'
                  }`}
                >
                  <div className="flex w-full items-center">
                    <span>Yes</span>
                    {formData.isHighCalories && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary"
                      >
                        <Check className="size-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateFormData('isHighCalories', false)}
                  className={`flex flex-1 rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                    !formData.isHighCalories ? 'border-primary' : 'border-white/5'
                  }`}
                >
                  <div className="flex w-full items-center">
                    <span>No</span>
                    {!formData.isHighCalories && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary"
                      >
                        <Check className="size-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </button>
              </div>
            </div> */}

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
        )}

        {showView === 'ADOPT' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[80px]">
            <object data={TaskApproved} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold">Submission approved!</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <p className="mb-8 text-center text-base text-white/60">
              To receive your reward, please verify the task on the Binance Wallet campaign page.
            </p>
            <button className="block h-[44px] w-full rounded-full bg-white text-black" onClick={activeUserAction}>
              Submit again
            </button>
          </div>
        )}

        {showView === 'PENDING' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[80px]">
            <object data={TaskPendingImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold">Under review</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <p className="mb-3 text-center text-base text-white/60">
              We’re reviewing your submission now. You’ll receive the result in about 15 minutes.
            </p>
            <p className="mb-8 text-center text-base text-white/60">
              To ensure you receive your rewards, verify the task on the Binance Wallet campaign page once your
              submission is approved.
            </p>
          </div>
        )}

        {showView === 'REJECT' && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[80px]">
            <object data={TaskRefusedImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
            <div className="mb-6 text-center text-2xl font-bold text-[#D92B2B]">Audit failed</div>
            <div className="mb-6 w-full">
              <SubmissionProgress current={MaxValidateDays} target={validationDays || 0} />
            </div>
            <p className="mb-8 text-center text-base text-white/60">So close! Tweak it and resubmit—you’ve got this!</p>
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
