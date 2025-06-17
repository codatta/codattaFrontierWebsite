import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, X } from 'lucide-react'
import MobileSelect, { SelectOption } from '@/components/mobile-ui/select'
import { countryList } from '@/components/frontier/country-list'
import frontiterApi, { TaskDetail } from '@/apis/frontiter.api'
import { message, Spin } from 'antd'
import TaskPendingImg from '@/assets/images/task-pending.svg'
import TaskRefusedImg from '@/assets/images/task-reject.svg'
import { useParams } from 'react-router-dom'
import commonApi from '@/api-v1/common.api'

interface FoodFormData {
  images: File[]
  foodName: string
  foodCategory: string
  brand: string
  region: string
  quantity: string
  isHighCalories: boolean
}

const FoodForm: React.FC<{
  templateId: string
}> = ({ templateId }) => {
  const [formData, setFormData] = useState<FoodFormData>({
    images: [],
    foodName: '',
    foodCategory: '',
    brand: '',
    region: '',
    quantity: '',
    isHighCalories: true
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [lastSubmission, setLastSubmission] = useState<TaskDetail>()
  const [uploading, setUploading] = useState(false)
  const { taskId } = useParams()
  const [showView, setShowView] = useState<'PENDING' | 'FORM' | 'REJECT'>('FORM')

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

    const isUserClose = localStorage.getItem('bn_user_close')
    if (isUserClose === 'true') {
      setShowView('FORM')
      return
    }

    if (['PENDING', 'SUBMITTED'].includes(lastSubmission?.status)) {
      setShowView('PENDING')
    } else if (lastSubmission?.status === 'REFUSED') {
      setShowView('REJECT')
    } else if (lastSubmission?.status === 'ADOPT') {
      setShowView('FORM')
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
        quantity: '',
        isHighCalories: true
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      localStorage.removeItem('bn_user_close')
      setShowView('PENDING')
    } catch (error) {
      message.error(error.message)
    }
    setIsSubmitting(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    const files = e.target.files
    if (files && files.length > 0) {
      const imageFile = Array.from(files)[0]
      const res = await commonApi.uploadFile(imageFile)
      updateFormData('images', [res.file_path])
      setImageFile(imageFile)
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

  async function getLastSubmission() {
    const res = await frontiterApi.getSubmissionList({ page_num: 1, page_size: 1, frontier_id: 'ROBSTIC001' })
    const lastSubmission = res.data[0]
    setLastSubmission(lastSubmission)
  }

  async function checkTaskBasicInfo(taskId: string, templateId: string) {
    const res = await frontiterApi.getTaskDetail(taskId)
    const { data_display } = res.data
    if (data_display.template_id !== templateId) {
      throw new Error('Template not match!')
    }
  }

  async function activeUserAction() {
    localStorage.setItem('bn_user_close', 'true')
    window.location.reload()
  }

  async function handleBack() {
    window.close()
  }

  async function checkTaskStatus() {
    setLoading(true)
    try {
      if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
      await Promise.all([checkTaskBasicInfo(taskId, templateId), getLastSubmission()])
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [])

  return (
    <Spin spinning={loading} className="min-h-screen">
      {showView === 'FORM' && (
        <div className="min-h-screen p-4 pb-8 text-white">
          <div className="mx-auto max-w-md space-y-6">
            {/* Images Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                Images<span className="text-red-400">*</span>
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
                    <div className="flex-1 text-sm leading-relaxed text-gray-400">
                      Upload clear food-related images (up to 1).
                      <br />
                      Ensure subjects are prominent and well-lit.
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
                onChange={(value) => {
                  updateFormData('foodCategory', value)
                }}
                height={300}
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
                options={countryList}
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
                  onChange={(value) => {
                    updateFormData('quantity', value)
                  }}
                  height={300}
                />
              </div>
              {errors.quantity && <p className="text-sm text-red-400">{errors.quantity}</p>}
            </div>

            {/* Is it high in calories */}
            <div className="space-y-3">
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
      )}

      {showView === 'PENDING' && (
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[80px]">
          <object data={TaskPendingImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
          <div className="mb-6 text-center text-2xl font-bold">Under review</div>
          <p className="mb-8 text-center text-base text-white/60">
            The data you submitted is under review. The result will be available in approximately 15 minutes. Once
            approved, you can claim your event reward
          </p>
          <button className="mb-3 block h-[44px] w-full rounded-full bg-primary" onClick={activeUserAction}>
            Submit another
          </button>
          <button className="block h-[44px] w-full rounded-full bg-white text-black" onClick={handleBack}>
            Back
          </button>
        </div>
      )}

      {showView === 'REJECT' && (
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pt-[80px]">
          <object data={TaskRefusedImg} className="mb-8 size-[120px]" type="image/svg+xml"></object>
          <div className="mb-6 text-center text-2xl font-bold text-[#D92B2B]">Audit failed</div>
          <p className="mb-8 text-center text-base text-white/60">So close! Tweak it and resubmit—you’ve got this!</p>
          <button className="block h-[44px] w-full rounded-full bg-white text-black" onClick={activeUserAction}>
            Resubmit
          </button>
        </div>
      )}
    </Spin>
  )
}

export default FoodForm
