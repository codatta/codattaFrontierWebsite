import { useCallback, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message, Checkbox } from 'antd'
import { ChevronDown, Camera } from 'lucide-react'
import { cn } from '@udecode/cn'

import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/mobile-app/frontier-header'
import HelpDrawer from '@/components/mobile-app/help-drawer'
import BottomDrawer from '@/components/mobile-app/bottom-drawer'
import SuccessModal from '@/components/mobile-app/success-modal'
import Upload from '@/components/frontier/airdrop/UploadImg'

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

export default function RealWorldPhotoCollectionApp({ templateId, isFeed }: { templateId?: string; isFeed?: boolean }) {
  const { taskId, uid } = useParams()
  const [loading, setLoading] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showThemeDrawer, setShowThemeDrawer] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const [formData, setFormData] = useState<PhotoCollectionFormData>({
    themeCategory: '',
    images: [],
    subjectDescription: '',
    cameraDevice: '',
    confirmAccuracy: false,
    confirmOriginal: false
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PhotoCollectionFormData, string>>>({})

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

  const fetchTaskDetail = useCallback(async () => {
    if (!taskId && !uid) return
    setLoading(true)
    try {
      const res = isFeed && uid ? await frontiterApi.getFeedTaskDetail(uid) : await frontiterApi.getTaskDetail(taskId!)

      if (templateId && !templateId.includes(res.data.data_display.template_id)) {
        throw new Error('Template not match!')
      }

      const totalRewards = res.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)

      setRewardPoints(totalRewards)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load task detail.'
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }, [taskId, uid, isFeed, templateId])

  useEffect(() => {
    fetchTaskDetail()
  }, [fetchTaskDetail])

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
      newErrors.confirmAccuracy = 'Required'
    }
    if (!formData.confirmOriginal) {
      newErrors.confirmOriginal = 'Required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields.')
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
        templateId: templateId!,
        taskId: taskId!
      })

      setShowSuccessModal(true)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to submit!')
    } finally {
      setLoading(false)
    }
  }

  const selectedThemeLabel = useMemo(() => {
    return themeCategories.find((c) => c.value === formData.themeCategory)?.label || 'Select theme category'
  }, [formData.themeCategory])

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="min-h-screen bg-[#F5F5F5] pb-10">
          <FrontierHeader title="Real-World Photo" onHelp={() => setShowInfoModal(true)} />

          <div className="space-y-6 px-5 pt-4">
            {/* Theme Category */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-[#A0A0A0]">Theme Category</label>
              <div
                onClick={() => setShowThemeDrawer(true)}
                className={cn(
                  'flex h-[56px] items-center justify-between rounded-[28px] bg-white px-6 transition-all',
                  errors.themeCategory && 'border border-red-500'
                )}
              >
                <span className={cn('text-[15px]', formData.themeCategory ? 'text-black' : 'text-[#CBCBCB]')}>
                  {selectedThemeLabel}
                </span>
                <ChevronDown className="size-5 text-[#CBCBCB]" />
              </div>
            </div>

            {/* Upload Original Photo */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-[#A0A0A0]">Upload Original Photo</label>
              <div className={cn('rounded-[28px] bg-white p-4', errors.images && 'border border-red-500')}>
                <div className="flex justify-center">
                  <Upload
                    value={formData.images}
                    allUploadedImages={[...formData.images]}
                    onChange={(images) => updateFormData('images', images)}
                    maxCount={1}
                    itemClassName="h-[140px] w-[140px] rounded-[24px]"
                    description={
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex size-[100px] items-center justify-center rounded-[24px] bg-[#F5F5F5]">
                          <Camera className="size-8 text-[#A0A0A0]" />
                        </div>
                      </div>
                    }
                  />
                </div>
                <p className="mt-4 text-[12px] leading-[18px] text-[#A0A0A0]">
                  Upload a photo of an original photo(Supports JPG, PNG. Recommended resolution 1920x1080)
                </p>
              </div>
            </div>

            {/* Subject Description */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-[#A0A0A0]">Subject Description</label>
              <textarea
                value={formData.subjectDescription}
                onChange={(e) => updateFormData('subjectDescription', e.target.value)}
                placeholder="Enter subject description"
                className={cn(
                  'h-[120px] w-full rounded-[28px] bg-white px-6 py-4 text-[15px] outline-none transition-all placeholder:text-[#CBCBCB]',
                  errors.subjectDescription && 'border border-red-500'
                )}
              />
            </div>

            {/* Camera/Device */}
            <div className="space-y-2">
              <label className="text-[15px] font-medium text-[#A0A0A0]">Camera/Device</label>
              <input
                type="text"
                value={formData.cameraDevice}
                onChange={(e) => updateFormData('cameraDevice', e.target.value)}
                placeholder="Enter camera/device"
                className={cn(
                  'h-[56px] w-full rounded-[28px] bg-white px-6 text-[15px] outline-none transition-all placeholder:text-[#CBCBCB]',
                  errors.cameraDevice && 'border border-red-500'
                )}
              />
            </div>

            {/* Confirmations */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData.confirmAccuracy}
                  onChange={(e) => updateFormData('confirmAccuracy', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-[13px] leading-[18px] text-[#A0A0A0]">
                  I confirm: The photo matches the selected theme category, and the description is objective and
                  accurate.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData.confirmOriginal}
                  onChange={(e) => updateFormData('confirmOriginal', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-[13px] leading-[18px] text-[#A0A0A0]">
                  I confirm: This photo is my original work, contains no faces or privacy information, and I agree to
                  grant the copyright to the platform for commercial purposes.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!allFieldsFilled || loading}
              className={cn(
                'mt-4 h-[56px] w-full rounded-full text-[17px] font-bold transition-all',
                allFieldsFilled ? 'shadow-lg bg-black text-white' : 'bg-[#A0A0A0] text-white opacity-50'
              )}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        <BottomDrawer open={showThemeDrawer} onClose={() => setShowThemeDrawer(false)} title="Select Theme Category">
          <div className="space-y-1 pb-6">
            {themeCategories.map((item) => (
              <div
                key={item.value}
                onClick={() => {
                  updateFormData('themeCategory', item.value)
                  setShowThemeDrawer(false)
                }}
                className={cn(
                  'flex h-[56px] items-center px-6 text-[16px] transition-colors active:bg-gray-100',
                  formData.themeCategory === item.value ? 'font-bold text-black' : 'text-[#444]'
                )}
              >
                {item.label}
              </div>
            ))}
          </div>
        </BottomDrawer>

        <HelpDrawer
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="More About Frontier"
          cards={[
            {
              preset: 'about',
              title: 'Real-world Photo',
              content: [
                {
                  type: 'p',
                  text: 'This task asks you to submit authentic, diverse, high-resolution photographs from your daily life - meals, workspaces, public scenes, tools, etc. - with basic descriptions and metadata.'
                }
              ]
            },
            {
              preset: 'guidelines',
              content: [
                {
                  type: 'h3',
                  text: 'Task Description'
                },
                {
                  type: 'p',
                  text: 'We are building a real-world photo collection for AI training and computer vision research. Your goal is to help us collect real-life photos from 8 core themes. Each photo must be your original work, and approved submissions will receive rewards.'
                },
                {
                  type: 'list',
                  title: 'Audit Standards (Must Read)',
                  items: [
                    "Uniqueness: Photos must be your original work. Uploading downloaded or others' photos is strictly prohibited.",
                    'Accuracy: Theme category and subject description must exactly match the photo content.',
                    'Quality: Photos must be clear and recognizable, without severe blur or exposure issues. Recommended resolution >= 1920x1080, format JPG or PNG.',
                    'Safety: Photos must not contain faces, personal identification information, privacy information, or any illegal content.'
                  ]
                }
              ]
            }
          ]}
        />

        <SuccessModal
          open={showSuccessModal}
          onClose={() => window.history.back()}
          points={rewardPoints}
          title="Submitted!"
          message="Your photo collection has been submitted for review."
        />
      </Spin>
    </AuthChecker>
  )
}
