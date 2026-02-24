import { useEffect, useState, useRef } from 'react'
import { Button, Input, message, Spin, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, HelpCircle, Camera, X } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import frontiterApi from '@/apis/frontiter.api'
import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'

interface UploadedImage {
  url: string
  hash: string
}

interface FormData {
  foodImages: UploadedImage[]
  foodComponents: string
  foodWeight: string
  measurementToolPhotos: UploadedImage[]
  containerType: string
  rulerPhotos: UploadedImage[]
  cookingMethod: string
}

export default function TestTpl000001({ templateId }: { templateId: string }) {
  const navigate = useNavigate()
  const { taskId } = useParams()

  const [_loading, _setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const [formData, setFormData] = useState<FormData>({
    foodImages: [],
    foodComponents: '',
    foodWeight: '',
    measurementToolPhotos: [],
    containerType: '',
    rulerPhotos: [],
    cookingMethod: ''
  })

  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({})
  const foodImageInputRef = useRef<HTMLInputElement>(null)
  const measurementToolInputRef = useRef<HTMLInputElement>(null)
  const rulerPhotoInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Load task detail
  async function loadTaskDetail() {
    if (!taskId) {
      message.error('Task ID is missing')
      navigate('/app')
      return
    }

    setPageLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      const taskData = res.data

      // if (taskData.data_display?.template_id !== templateId) {
      //   message.error('Template mismatch')
      //   navigate('/app')
      //   return
      // }

      const rewardInfo = taskData.reward_info?.[0]
      const baseReward = rewardInfo?.reward_value || 0
      setRewardPoints(baseReward)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load task'
      message.error(errorMessage)
      navigate('/app')
    } finally {
      setPageLoading(false)
    }
  }

  // Update form field
  function updateFormData(field: keyof FormData, value: string | UploadedImage[]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle image upload
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'foodImages' | 'measurementToolPhotos' | 'rulerPhotos'
  ) {
    const files = e.target.files
    if (!files?.length) return

    const file = files[0]
    if (file.size > 20 * 1024 * 1024) {
      message.error('Image size must be less than 20MB')
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      message.error('Please upload PNG, JPEG, or JPG format')
      return
    }

    setUploadingFields((prev) => ({ ...prev, [field]: true }))
    try {
      const hash = await calculateFileHash(file)
      const res = await commonApi.uploadFile(file)
      const currentImages = formData[field] as UploadedImage[]
      updateFormData(field, [...currentImages, { url: res.file_path, hash }])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      message.error(errorMessage)
    } finally {
      setUploadingFields((prev) => ({ ...prev, [field]: false }))
    }
  }

  // Remove image
  function removeImage(field: 'foodImages' | 'measurementToolPhotos' | 'rulerPhotos', index: number) {
    const currentImages = formData[field] as UploadedImage[]
    updateFormData(
      field,
      currentImages.filter((_, i) => i !== index)
    )
  }

  // Validate form
  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (formData.foodImages.length === 0) {
      newErrors.foodImages = 'Food image is required'
    }

    if (!formData.foodComponents.trim()) {
      newErrors.foodComponents = 'Food components are required'
    }

    if (!formData.foodWeight.trim()) {
      newErrors.foodWeight = 'Food weight is required'
    } else if (isNaN(Number(formData.foodWeight))) {
      newErrors.foodWeight = 'Food weight must be a number'
    }

    if (formData.measurementToolPhotos.length === 0) {
      newErrors.measurementToolPhotos = 'Measurement tool photo is required'
    }

    if (!formData.containerType) {
      newErrors.containerType = 'Container type is required'
    }

    if (formData.rulerPhotos.length === 0) {
      newErrors.rulerPhotos = 'Ruler photo is required'
    }

    if (!formData.cookingMethod) {
      newErrors.cookingMethod = 'Cooking method is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  async function handleSubmit() {
    if (!validateForm()) {
      message.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: {
          food_images: formData.foodImages,
          food_components: formData.foodComponents,
          food_weight: formData.foodWeight,
          measurement_tool_photos: formData.measurementToolPhotos,
          container_type: formData.containerType,
          ruler_photos: formData.rulerPhotos,
          cooking_method: formData.cookingMethod
        }
      })
      setShowSuccessModal(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed'
      message.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle success modal close
  function handleSuccessModalClose() {
    setShowSuccessModal(false)
    navigate('/app')
  }

  useEffect(() => {
    loadTaskDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <AuthChecker>
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* iOS-style Header with Glass Effect */}
        <div className="sticky top-0 z-10 bg-[#f5f5f5]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 pb-2.5 pt-3">
            {/* Back Button with Glass Effect */}
            <button
              onClick={() => navigate(-1)}
              className="relative flex h-11 items-center gap-3 overflow-hidden rounded-full bg-white/90 px-2 backdrop-blur-sm"
            >
              <div className="flex size-9 items-center justify-center">
                <ChevronLeft size={24} className="text-[#404040]" strokeWidth={2.5} />
              </div>
              <span className="pr-2 text-[17px] font-medium leading-none text-[#404040]">Label</span>
            </button>

            {/* Title */}
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-semibold capitalize leading-[22px] tracking-[-0.43px] text-[#333]">
              Food Image Annotation
            </h1>

            {/* Help Button with Glass Effect */}
            <button className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-white/90 backdrop-blur-sm">
              <HelpCircle size={24} className="text-[#404040]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-8 px-4 pb-24 pt-4">
          {/* Food Image */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Food Image
            </label>
            <Spin spinning={uploadingFields.foodImages || false}>
              <div className="rounded-[26px] bg-white p-4">
                <input
                  ref={foodImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'foodImages')}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.foodImages.map((img, index) => (
                    <div key={index} className="relative size-[107px] overflow-hidden rounded-[21.4px] bg-[#f5f5f5]">
                      <img src={img.url} className="size-full object-cover" alt="Food" />
                      <button
                        onClick={() => removeImage('foodImages', index)}
                        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60"
                      >
                        <X className="size-3.5 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                  {formData.foodImages.length < 1 && (
                    <button
                      onClick={() => foodImageInputRef.current?.click()}
                      className="flex size-[107px] items-center justify-center rounded-[21.4px] bg-[#f5f5f5]"
                    >
                      <Camera size={32} className="text-[#999]" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[17px] tracking-[-0.43px] text-[#999]">
                  Upload a clear photo of a single food item(e.g., an apple, a bowl of rice)
                </p>
              </div>
            </Spin>
            {errors.foodImages && <p className="mt-1 pl-4 text-sm text-red-500">{errors.foodImages}</p>}
          </div>

          {/* Food Components */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Food Components
            </label>
            <div className="rounded-[26px] bg-white px-4 py-3.5">
              <Input
                value={formData.foodComponents}
                onChange={(e) => updateFormData('foodComponents', e.target.value)}
                placeholder="e.g., Rice, Scrambled eggs, Broccoli..."
                className="border-0 p-0 text-[15px] text-[#333] placeholder:text-[#999]"
                style={{ boxShadow: 'none' }}
                status={errors.foodComponents ? 'error' : undefined}
              />
            </div>
            {errors.foodComponents && <p className="mt-1 pl-4 text-sm text-red-500">{errors.foodComponents}</p>}
          </div>

          {/* Food Weight */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Food Weight
            </label>
            <div className="flex items-center justify-between rounded-[26px] bg-white px-4 py-3.5">
              <Input
                value={formData.foodWeight}
                onChange={(e) => updateFormData('foodWeight', e.target.value)}
                placeholder="e.g., 300"
                className="flex-1 border-0 p-0 text-[15px] text-[#333] placeholder:text-[#999]"
                style={{ boxShadow: 'none' }}
                status={errors.foodWeight ? 'error' : undefined}
              />
              <span className="ml-2 text-[15px] font-medium text-[#333]">Gram(g)</span>
            </div>
            {errors.foodWeight && <p className="mt-1 pl-4 text-sm text-red-500">{errors.foodWeight}</p>}
          </div>

          {/* Measurement Tool Photo */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Measurement Tool Photo
            </label>
            <Spin spinning={uploadingFields.measurementToolPhotos || false}>
              <div className="rounded-[26px] bg-white p-4">
                <input
                  ref={measurementToolInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'measurementToolPhotos')}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.measurementToolPhotos.map((img, index) => (
                    <div key={index} className="relative size-[107px] overflow-hidden rounded-[21.4px] bg-[#f5f5f5]">
                      <img src={img.url} className="size-full object-cover" alt="Tool" />
                      <button
                        onClick={() => removeImage('measurementToolPhotos', index)}
                        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60"
                      >
                        <X className="size-3.5 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                  {formData.measurementToolPhotos.length < 1 && (
                    <button
                      onClick={() => measurementToolInputRef.current?.click()}
                      className="flex size-[107px] items-center justify-center rounded-[21.4px] bg-[#f5f5f5]"
                    >
                      <Camera size={32} className="text-[#999]" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[17px] tracking-[-0.43px] text-[#999]">
                  Upload photos of the measuring tool(Ensure reading is clear){' '}
                  <span className="text-[#40e1ef]">example</span>
                </p>
              </div>
            </Spin>
            {errors.measurementToolPhotos && (
              <p className="mt-1 pl-4 text-sm text-red-500">{errors.measurementToolPhotos}</p>
            )}
          </div>

          {/* Container Type & Dimensions */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Container Type & Dimensions
            </label>
            <div className="rounded-[26px] bg-white">
              <Select
                value={formData.containerType || undefined}
                onChange={(value) => updateFormData('containerType', value)}
                placeholder="Select containerstype"
                className="w-full"
                bordered={false}
                status={errors.containerType ? 'error' : undefined}
                style={{ padding: '14px 16px' }}
                suffixIcon={<span className="text-[#0088ff]">􀆏</span>}
                options={[
                  { label: 'Rectangular (Length × Width × Height)', value: 'rectangular' },
                  { label: 'Cylindrical (Diameter × Height/Depth)', value: 'cylindrical' },
                  { label: 'Random Shape (15×20cm)', value: 'random' }
                ]}
              />
            </div>
            {errors.containerType && <p className="mt-1 pl-4 text-sm text-red-500">{errors.containerType}</p>}
          </div>

          {/* Ruler Photo */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Ruler Photo
            </label>
            <Spin spinning={uploadingFields.rulerPhotos || false}>
              <div className="rounded-[26px] bg-white p-4">
                <input
                  ref={rulerPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'rulerPhotos')}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.rulerPhotos.map((img, index) => (
                    <div key={index} className="relative size-[107px] overflow-hidden rounded-[21.4px] bg-[#f5f5f5]">
                      <img src={img.url} className="size-full object-cover" alt="Ruler" />
                      <button
                        onClick={() => removeImage('rulerPhotos', index)}
                        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60"
                      >
                        <X className="size-3.5 text-white" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                  {formData.rulerPhotos.length < 1 && (
                    <button
                      onClick={() => rulerPhotoInputRef.current?.click()}
                      className="flex size-[107px] items-center justify-center rounded-[21.4px] bg-[#f5f5f5]"
                    >
                      <Camera size={32} className="text-[#999]" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[17px] tracking-[-0.43px] text-[#999]">
                  Upload photos of containe with rule(Ensure markings are clear){' '}
                  <span className="text-[#40e1ef]">example</span>
                </p>
              </div>
            </Spin>
            {errors.rulerPhotos && <p className="mt-1 pl-4 text-sm text-red-500">{errors.rulerPhotos}</p>}
          </div>

          {/* Cooking Method */}
          <div>
            <label className="mb-2 block pl-4 text-[17px] font-medium leading-5 tracking-[-0.43px] text-[#999]">
              Cooking method
            </label>
            <div className="rounded-[26px] bg-white">
              <Select
                value={formData.cookingMethod || undefined}
                onChange={(value) => updateFormData('cookingMethod', value)}
                placeholder="Select cooking method"
                className="w-full"
                bordered={false}
                status={errors.cookingMethod ? 'error' : undefined}
                style={{ padding: '14px 16px' }}
                suffixIcon={<span className="text-[#0088ff]">􀆏</span>}
                options={[
                  { label: 'Boiled', value: 'boiled' },
                  { label: 'Steamed', value: 'steamed' },
                  { label: 'Fried', value: 'fried' },
                  { label: 'Baked', value: 'baked' },
                  { label: 'Grilled', value: 'grilled' },
                  { label: 'Raw', value: 'raw' },
                  { label: 'Other', value: 'other' }
                ]}
              />
            </div>
            {errors.cookingMethod && <p className="mt-1 pl-4 text-sm text-red-500">{errors.cookingMethod}</p>}
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div className="fixed inset-x-0 bottom-0 bg-[#f5f5f5] px-4 pb-8 pt-4">
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            className="h-14 w-full rounded-full bg-black text-[17px] font-medium leading-none text-white opacity-40 hover:opacity-40 disabled:opacity-40"
          >
            Submit
          </Button>
        </div>

        {/* Success Modal */}
        <SubmitSuccessModal open={showSuccessModal} onClose={handleSuccessModalClose} points={rewardPoints} />
      </div>
    </AuthChecker>
  )
}
