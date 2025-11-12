import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Input, Radio, Checkbox, message, Spin } from 'antd'

import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import Upload from '@/components/frontier/airdrop/UploadImg'

import frontiterApi from '@/apis/frontiter.api'

interface PhotoCollectionFormData {
  themeCategory: string
  images: { url: string; hash: string }[]
  subjectDescription: string
  cameraDevice: string
  confirmAccuracy: boolean
  confirmOriginal: boolean
}

const themeCategories = [
  { value: 'pets_animals', label: 'Pets & Animals' },
  { value: 'home_interior', label: 'Home & Interior' },
  { value: 'streets_buildings', label: 'Streets & Buildings' },
  { value: 'supermarket_products', label: 'Supermarket Products' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'fashion_outfits', label: 'Fashion & Outfits' },
  { value: 'scenery', label: 'Scenery' },
  { value: 'hand_actions', label: 'Hand Actions' }
]

const RealWorldPhotoCollection: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<PhotoCollectionFormData>({
    themeCategory: '',
    images: [],
    subjectDescription: '',
    cameraDevice: '',
    confirmAccuracy: false,
    confirmOriginal: false
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PhotoCollectionFormData, string>>>({})
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const allFieldsFilled = useMemo(() => {
    return (
      formData.themeCategory.trim() !== '' &&
      formData.images.length > 0 &&
      formData.subjectDescription.trim() !== '' &&
      formData.cameraDevice.trim() !== '' &&
      formData.confirmAccuracy &&
      formData.confirmOriginal
    )
  }, [formData])

  const updateFormData = (field: keyof PhotoCollectionFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const clearFormData = () => {
    setFormData({
      themeCategory: '',
      images: [],
      subjectDescription: '',
      cameraDevice: '',
      confirmAccuracy: false,
      confirmOriginal: false
    })
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PhotoCollectionFormData, string>> = {}

    if (!formData.themeCategory.trim()) {
      newErrors.themeCategory = 'Theme Category is required'
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Please upload one photo'
    }
    if (!formData.subjectDescription.trim()) {
      newErrors.subjectDescription = 'Subject Description is required'
    }
    if (!formData.cameraDevice.trim()) {
      newErrors.cameraDevice = 'Camera/Device is required'
    }
    if (!formData.confirmAccuracy) {
      newErrors.confirmAccuracy = 'Please confirm the accuracy statement'
    }
    if (!formData.confirmOriginal) {
      newErrors.confirmOriginal = 'Please confirm the original work statement'
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
        data: {
          themeCategory: formData.themeCategory,
          images: formData.images,
          subjectDescription: formData.subjectDescription,
          cameraDevice: formData.cameraDevice,
          confirmAccuracy: formData.confirmAccuracy,
          confirmOriginal: formData.confirmOriginal
        },
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
              Real-World Photo Collection (Phase 1: 8 Core Themes)
              <span></span>
            </h1>
          </div>

          {/* Guidelines Section */}
          <div className="mt-12 bg-[#FFFFFF0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
                <h2 className="text-lg font-bold text-white">
                  <span>📋 Guidelines</span>
                </h2>

                <h3 className="mb-2 mt-4 font-semibold text-white">📋 Task Description</h3>
                <p className="mt-2 leading-[22px]">
                  We are building a real-world photo collection for AI training and computer vision research. Your goal
                  is to help us collect real-life photos from 8 core themes. Each photo must be your original work, and
                  approved submissions will receive rewards.
                </p>

                <h3 className="mb-2 mt-6 font-semibold text-white">📝 Audit Standards (Must Read)</h3>
                <ul className="mt-2 space-y-2 leading-[22px]">
                  <li>
                    <span className="font-semibold text-white">Uniqueness:</span> Photos must be your original work.
                    Uploading downloaded or others' photos is strictly prohibited.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Accuracy:</span> Theme category and subject description
                    must exactly match the photo content.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Quality:</span> Photos must be clear and recognizable,
                    without severe blur or exposure issues. Recommended resolution ≥ 1920×1080, format JPG or PNG.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Safety:</span> Photos must not contain faces, personal
                    identification information, privacy information, or any illegal content.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
            {/* Theme Category */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Theme Category<span className="text-red-400">*</span>
              </label>
              <Radio.Group
                value={formData.themeCategory}
                onChange={(e) => updateFormData('themeCategory', e.target.value)}
                className={`w-full ${errors.themeCategory ? '[&_.ant-radio-wrapper]:!text-red-500' : ''}`}
              >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {themeCategories.map((category) => (
                    <Radio key={category.value} value={category.value} className="text-white">
                      {category.label}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
              {errors.themeCategory && <p className="text-sm text-red-400">{errors.themeCategory}</p>}
            </div>

            {/* Upload Original Photo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Upload Original Photo<span className="text-red-400">*</span>
              </label>
              <Upload
                className="rounded-2xl border border-[#FFFFFF1F] p-4"
                value={formData.images}
                allUploadedImages={[...formData.images]}
                onChange={(images) => updateFormData('images', images)}
                description={
                  <div className="text-center text-xs text-[#606067] md:text-sm">
                    <p className="mb-1">Click to upload or drag images here</p>
                    <p>Supports JPG, PNG. Recommended resolution ≥1920×1080</p>
                  </div>
                }
                maxCount={1}
                error={errors.images}
              />
            </div>

            {/* Subject Description */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Subject Description<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.subjectDescription}
                onChange={(e) => updateFormData('subjectDescription', e.target.value)}
                placeholder="Enter Subject Description"
                className={`w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${
                  errors.subjectDescription ? 'border-red-500' : ''
                }`}
                size="large"
              />
              {errors.subjectDescription && <p className="text-sm text-red-400">{errors.subjectDescription}</p>}
            </div>

            {/* Camera/Device */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Camera/Device<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.cameraDevice}
                onChange={(e) => updateFormData('cameraDevice', e.target.value)}
                placeholder="Enter Camera/Device"
                className={`w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${
                  errors.cameraDevice ? 'border-red-500' : ''
                }`}
                size="large"
              />
              {errors.cameraDevice && <p className="text-sm text-red-400">{errors.cameraDevice}</p>}
            </div>

            {/* Confirmation Checkboxes */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Checkbox
                  checked={formData.confirmAccuracy}
                  onChange={(e) => updateFormData('confirmAccuracy', e.target.checked)}
                  className={`text-white ${errors.confirmAccuracy ? 'text-red-400' : ''}`}
                >
                  I confirm: The photo matches the selected theme category, and the description is objective and
                  accurate.
                </Checkbox>
                {errors.confirmAccuracy && <p className="ml-6 text-sm text-red-400">{errors.confirmAccuracy}</p>}
              </div>

              <div className="space-y-2">
                <Checkbox
                  checked={formData.confirmOriginal}
                  onChange={(e) => updateFormData('confirmOriginal', e.target.checked)}
                  className={`text-white ${errors.confirmOriginal ? 'text-red-400' : ''}`}
                >
                  I confirm: This photo is my original work, contains no faces or privacy information, and I agree to
                  grant the copyright to the platform for commercial purposes.
                </Checkbox>
                {errors.confirmOriginal && <p className="ml-6 text-sm text-red-400">{errors.confirmOriginal}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mx-auto mt-12 max-w-[1320px] px-6">
            <Button
              text="Submit"
              className={`h-[44px] w-full rounded-full text-base font-bold ${!allFieldsFilled && 'opacity-50'} md:mx-auto md:w-[240px]`}
              onClick={handleSubmit}
              disabled={!allFieldsFilled}
              loading={loading}
            />
          </div>

          <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default RealWorldPhotoCollection
