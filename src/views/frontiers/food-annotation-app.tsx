import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { message, Spin } from 'antd'
import { ChevronsUpDown, X } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import FoodAnnotationUpload from '@/components/frontier/food-annotation/upload'
import type { UploadedImage } from '@/components/frontier/food-annotation/upload'
import frontiterApi from '@/apis/frontiter.api'
import SuccessModal from '@/components/mobile-app/success-modal'
import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'
import BottomDrawer from '@/components/mobile-app/bottom-drawer'
import ExampleMeasurement from '@/assets/frontier/food-annotation-app/example-2.png'
import ExampleRuler from '@/assets/frontier/food-annotation-app/example-1.png'

interface FoodAnnotationFormData {
  foodImage: UploadedImage[]
  foodComponents: string
  foodWeight: string
  measurementToolPhotos: UploadedImage[]
  containerType: string
  containerDimension1: string
  containerDimension2: string
  containerDimension3: string
  rulerPhoto: UploadedImage[]
  cookingMethod: string
}

const containerTypeOptions = [
  { label: 'Rectangle/Square', value: 'Rectangle/Square' },
  { label: 'Round/Oval', value: 'Round/Oval' },
  { label: 'Other', value: 'Other' }
]

const cookingMethodOptions = [
  { label: 'Steaming', value: 'steaming' },
  { label: 'Boiling', value: 'boiling' },
  { label: 'Frying', value: 'frying' },
  { label: 'Baking', value: 'baking' },
  { label: 'Grilling', value: 'grilling' },
  { label: 'Roasting', value: 'roasting' },
  { label: 'Stir-frying', value: 'stir_frying' },
  { label: 'Deep-frying', value: 'deep_frying' },
  { label: 'Eat saving', value: 'eat_saving' },
  { label: 'Raw', value: 'raw' },
  { label: 'Other', value: 'other' }
]

const FoodDataAnnotation: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<FoodAnnotationFormData>({
    foodImage: [],
    foodComponents: '',
    foodWeight: '',
    measurementToolPhotos: [],
    containerType: '',
    containerDimension1: '',
    containerDimension2: '',
    containerDimension3: '',
    rulerPhoto: [],
    cookingMethod: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FoodAnnotationFormData, string>>>({})
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [showMeasurementToolPhotoDrawer, setShowMeasurementToolPhotoDrawer] = useState(false)
  const [showRulerPhotoDrawer, setShowRulerPhotoDrawer] = useState(false)
  const allFieldsFilled = useMemo(() => {
    // Basic fields validation
    const basicFieldsValid =
      formData.foodImage.length > 0 &&
      formData.foodComponents.trim() !== '' &&
      formData.foodWeight.trim() !== '' &&
      formData.measurementToolPhotos.length > 0 &&
      formData.containerType !== '' &&
      formData.rulerPhoto.length > 0 &&
      formData.cookingMethod !== ''

    if (!basicFieldsValid) return false

    // Container dimensions validation based on type
    if (formData.containerType === 'Rectangle/Square') {
      return (
        formData.containerDimension1.trim() !== '' &&
        formData.containerDimension2.trim() !== '' &&
        formData.containerDimension3.trim() !== ''
      )
    } else if (formData.containerType === 'Round/Oval') {
      return formData.containerDimension1.trim() !== '' && formData.containerDimension2.trim() !== ''
    } else if (formData.containerType === 'Other') {
      return formData.containerDimension1.trim() !== ''
    }

    return false
  }, [formData])

  const updateFormData = <K extends keyof FoodAnnotationFormData>(field: K, value: FoodAnnotationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const clearFormData = () => {
    setFormData({
      foodImage: [],
      foodComponents: '',
      foodWeight: '',
      measurementToolPhotos: [],
      containerType: '',
      containerDimension1: '',
      containerDimension2: '',
      containerDimension3: '',
      rulerPhoto: [],
      cookingMethod: ''
    })
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FoodAnnotationFormData, string>> = {}

    // Basic fields validation
    if (formData.foodImage.length === 0) {
      newErrors.foodImage = 'Please upload a food image'
    }
    if (!formData.foodComponents.trim()) {
      newErrors.foodComponents = 'Food components are required'
    }
    if (!formData.foodWeight.trim()) {
      newErrors.foodWeight = 'Food weight is required'
    }
    if (formData.measurementToolPhotos.length === 0) {
      newErrors.measurementToolPhotos = 'Please upload measurement tool photos'
    }
    if (!formData.containerType) {
      newErrors.containerType = 'Container type is required'
    }

    // Container dimensions validation based on type
    if (formData.containerType === 'Rectangle/Square') {
      if (!formData.containerDimension1.trim()) {
        newErrors.containerDimension1 = 'Length is required'
      }
      if (!formData.containerDimension2.trim()) {
        newErrors.containerDimension2 = 'Width is required'
      }
      if (!formData.containerDimension3.trim()) {
        newErrors.containerDimension3 = 'Height is required'
      }
    } else if (formData.containerType === 'Round/Oval') {
      if (!formData.containerDimension1.trim()) {
        newErrors.containerDimension1 = 'Diameter is required'
      }
      if (!formData.containerDimension2.trim()) {
        newErrors.containerDimension2 = 'Depth is required'
      }
    } else if (formData.containerType === 'Other') {
      if (!formData.containerDimension1.trim()) {
        newErrors.containerDimension1 = 'Container dimensions are required'
      }
    }

    if (formData.rulerPhoto.length === 0) {
      newErrors.rulerPhoto = 'Please upload ruler photo'
    }
    if (!formData.cookingMethod) {
      newErrors.cookingMethod = 'Cooking method is required'
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
        .filter((item) => item.reward_mode === 'REGULAR')
        .reduce((acc, cur) => acc + cur.reward_value, 0)

      setRewardPoints(totalRewards)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get task detail!')
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  const onBack = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isInApp = userAgent.includes('codatta')
    if (isInApp) window.native.call('goBack')
    else window.history.back()
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="min-h-screen bg-[#F8F8F8] pb-20">
          <MobileAppFrontierHeader
            title="Food Data Annotation"
            canSubmit={allFieldsFilled}
            onBack={onBack}
            onSubmit={handleSubmit}
            showSubmitButton={false}
          />

          {/* Form Content */}
          <div className="px-5">
            <div className="mb-8 space-y-6">
              {/* Food Image */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Food Image</label>
                <div className="space-y-2.5 rounded-[26px] bg-white p-4">
                  <FoodAnnotationUpload
                    value={formData.foodImage}
                    onChange={(images) => updateFormData('foodImage', images)}
                    error={errors.foodImage}
                    maxCount={4}
                  />
                  <div className="text-[13px] text-[#999]">
                    Upload a clear photo of a single food item(e.g.:,an apple,a bowl of rice)
                  </div>
                </div>
              </div>

              {/* Food Components */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Food Components</label>
                <textarea
                  value={formData.foodComponents}
                  onChange={(e) => updateFormData('foodComponents', e.target.value)}
                  placeholder="e.g.: Rice, Scrambled eggs, Broccoli..."
                  className="w-full rounded-[26px] p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={500}
                />
                {errors.foodComponents && <p className="text-xs text-red-400">{errors.foodComponents}</p>}
              </div>

              {/* Food Weight */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Food Weight</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.foodWeight}
                    onChange={(e) => updateFormData('foodWeight', e.target.value)}
                    placeholder="e.g.: 300"
                    className="w-full rounded-[26px] bg-white px-4 py-3 pr-20 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Gram(g)</span>
                </div>
                {errors.foodWeight && <p className="text-xs text-red-400">{errors.foodWeight}</p>}
              </div>

              {/* Measurement Tool Photo */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Measurement Tool Photo</label>
                <div className="space-y-2 rounded-[26px] bg-white p-4">
                  <FoodAnnotationUpload
                    value={formData.measurementToolPhotos}
                    onChange={(images) => updateFormData('measurementToolPhotos', images)}
                    error={errors.measurementToolPhotos}
                    maxCount={5}
                  />
                  <div className="text-[13px] text-[#999]">
                    Upload photos of the measuring tool(Ensure reading is clear){' '}
                    <span onClick={() => setShowMeasurementToolPhotoDrawer(true)} className="text-[#40E1EF]">
                      example
                    </span>
                  </div>
                </div>
              </div>

              {/* Container Type & Dimensions */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Container Type & Dimensions</label>
                <div className="relative rounded-[26px] bg-white px-4 py-1 text-black [&>div:last-child]:border-b-0">
                  <div className="relative border-b border-black/5">
                    <select
                      value={formData.containerType}
                      onChange={(e) => updateFormData('containerType', e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-white py-3 outline-none"
                      style={{ color: formData.containerType ? '#1f2937' : '#9ca3af' }}
                    >
                      <option value="" disabled>
                        Select container stype
                      </option>
                      {containerTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Rectangle/Square - Length, Width, Height */}
                  {formData.containerType === 'Rectangle/Square' && (
                    <>
                      <div className="relative border-b border-black/5">
                        <input
                          type="number"
                          value={formData.containerDimension1}
                          onChange={(e) => updateFormData('containerDimension1', e.target.value)}
                          placeholder="Length"
                          className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-900">cm</span>
                      </div>
                      <div className="relative border-b border-black/5">
                        <input
                          type="number"
                          value={formData.containerDimension2}
                          onChange={(e) => updateFormData('containerDimension2', e.target.value)}
                          placeholder="Width"
                          className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-900">cm</span>
                      </div>
                      <div className="relative border-b border-black/5">
                        <input
                          type="number"
                          value={formData.containerDimension3}
                          onChange={(e) => updateFormData('containerDimension3', e.target.value)}
                          placeholder="Height"
                          className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-900">cm</span>
                      </div>
                    </>
                  )}

                  {/* Round/Oval - Diameter, High/Depth */}
                  {formData.containerType === 'Round/Oval' && (
                    <>
                      <div className="relative border-b border-black/5">
                        <input
                          type="number"
                          value={formData.containerDimension1}
                          onChange={(e) => updateFormData('containerDimension1', e.target.value)}
                          placeholder="Diameter"
                          className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-900">cm</span>
                      </div>
                      <div className="relative border-b border-black/5">
                        <input
                          type="number"
                          value={formData.containerDimension2}
                          onChange={(e) => updateFormData('containerDimension2', e.target.value)}
                          placeholder="High/Depth"
                          className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-900">cm</span>
                      </div>
                    </>
                  )}

                  {/* Other - Random input */}
                  {formData.containerType === 'Other' && (
                    <div className="relative border-b border-black/5">
                      <input
                        type="text"
                        value={formData.containerDimension1}
                        onChange={(e) => updateFormData('containerDimension1', e.target.value)}
                        placeholder="Random, 15*12cm"
                        className="w-full py-3 outline-none placeholder:text-[#3C3C434D]"
                      />
                    </div>
                  )}
                </div>
                {errors.containerType && <p className="text-xs text-red-400">{errors.containerType}</p>}
              </div>

              {/* Ruler Photo */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Ruler Photo</label>
                <div className="space-y-2 rounded-[26px] bg-white p-4">
                  <FoodAnnotationUpload
                    value={formData.rulerPhoto}
                    onChange={(images) => updateFormData('rulerPhoto', images)}
                    error={errors.rulerPhoto}
                    maxCount={5}
                  />
                  <div className="text-[13px] text-[#999]">
                    Upload photos of container with ruler(Ensure markings are clear){' '}
                    <span onClick={() => setShowRulerPhotoDrawer(true)} className="text-[#40E1EF]">
                      example
                    </span>
                  </div>
                </div>
              </div>

              {/* Cooking method */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Cooking method</label>
                <div className="relative">
                  <select
                    value={formData.cookingMethod}
                    onChange={(e) => updateFormData('cookingMethod', e.target.value)}
                    className="w-full appearance-none rounded-[26px] bg-white px-4 py-3 text-black outline-none"
                  >
                    <option value="" disabled>
                      Select cooking method
                    </option>
                    {cookingMethodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.cookingMethod && <p className="text-xs text-red-400">{errors.cookingMethod}</p>}
              </div>
            </div>

            <button className="block w-full rounded-full bg-black py-3 text-white" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          <SuccessModal
            open={modalShow}
            onClose={onBack}
            title="Successful"
            message="Other rewards will issue automatically after answer verification."
            points={rewardPoints}
            buttonText="Got it"
          />
        </div>
      </Spin>

      <BottomDrawer open={showMeasurementToolPhotoDrawer} onClose={() => setShowMeasurementToolPhotoDrawer(false)}>
        <div className="text-black">
          <div className="mb-3 flex items-center justify-between">
            <div className="w-[44px]"></div>
            <div className="text-[20px] font-semibold">Example</div>
            <button
              onClick={() => setShowMeasurementToolPhotoDrawer(false)}
              className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
            >
              <X size={24}></X>
            </button>
          </div>

          <div className="p-4">
            <p className="mb-4 text-[17px]">Please refer to the following examples:</p>
            <img src={ExampleMeasurement} alt="example-measurement" className="w-full" />
          </div>
        </div>
      </BottomDrawer>

      <BottomDrawer open={showRulerPhotoDrawer} onClose={() => setShowRulerPhotoDrawer(false)}>
        <div className="text-black">
          <div className="mb-3 flex items-center justify-between">
            <div className="w-[44px]"></div>
            <div className="text-[20px] font-semibold">Example</div>
            <button
              onClick={() => setShowRulerPhotoDrawer(false)}
              className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
            >
              <X size={24}></X>
            </button>
          </div>
          <div className="p-4">
            <p className="mb-4 text-[17px]">Please refer to the following examples:</p>
            <img src={ExampleRuler} alt="example-ruler" className="w-full" />
          </div>
        </div>
      </BottomDrawer>
    </AuthChecker>
  )
}

export default FoodDataAnnotation
