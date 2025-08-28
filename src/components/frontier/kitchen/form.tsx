import { useEffect, useState, useMemo, useCallback } from 'react'
import { cn } from '@udecode/cn'

import { Button } from '@/components/booster/button'
import Input from './input'
import Upload from './upload'
import Tips from './tips'

import image1 from '@/assets/frontier/kitchen/image_1.png'
import image2 from '@/assets/frontier/kitchen/image_2.png'
import type { FormData } from './types'
import { message } from 'antd'

export default function Form({
  isMobile,
  resultType,
  onSubmit
}: {
  isBnb?: boolean
  isMobile: boolean
  resultType?: 'ADOPT' | 'PENDING' | 'REJECT' | null

  onSubmit: (data: FormData) => Promise<boolean>
}) {
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    front_view_images: [],
    side_view_images: [],
    app_type: '',
    scale_type: '',
    scale_value: ''
  })
  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.front_view_images.length &&
      !!formData.side_view_images.length &&
      !!formData.app_type &&
      !!formData.scale_type &&
      !!formData.scale_value
    )
  }, [errors, formData])
  const [front_view_image_hash, side_view_image_hash] = useMemo(() => {
    return [formData.front_view_images[0]?.hash, formData.side_view_images[0]?.hash]
  }, [formData])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (formData.front_view_images.length === 0) {
      newErrors.front_view_images = 'Please upload an image'
    }
    if (!formData.side_view_images.length) {
      newErrors.side_view_images = 'Please upload an image'
    } else if (front_view_image_hash === side_view_image_hash) {
      newErrors.side_view_images = 'Side view photo must be different from front view photo'
    }
    if (!formData.app_type) {
      newErrors.app_type = 'Appliance type is required'
    }
    if (!formData.scale_type) {
      newErrors.scale_type = 'Scale type is required'
    }
    if (!formData.scale_value) {
      newErrors.scale_value = 'Scale value is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, front_view_image_hash, side_view_image_hash])

  const resetForm = () => {
    setFormData({
      front_view_images: [],
      side_view_images: [],
      app_type: '',
      scale_type: '',
      scale_value: ''
    })
  }
  const handleFormChange = (field: keyof FormData, value: string | number | { url: string; hash: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  useEffect(() => {
    resetForm()
  }, [resultType])

  useEffect(() => {
    if (!!front_view_image_hash && !!side_view_image_hash && side_view_image_hash === front_view_image_hash) {
      setErrors((prev) => ({ ...prev, side_view_images: 'Side view photo must be different from front view photo' }))
    } else {
      setErrors((prev) => ({ ...prev, side_view_images: undefined }))
    }
  }, [front_view_image_hash, side_view_image_hash])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      console.log('formData', formData)
      const success = await onSubmit(formData)
      if (success) {
        resetForm()
      }
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
    }
    setLoading(false)
  }

  return (
    <>
      <div className="mt-[22px] space-y-[22px] md:mt-[48px] md:space-y-[30px]">
        <div>
          <h3
            className={cn(
              'mb-2 flex items-center text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white',
              isMobile ? 'px-4' : 'px-0'
            )}
          >
            Front View Photo<span className="mr-1 text-red-400">*</span>
            <Tips isMobile={isMobile} />
          </h3>
          <Upload
            value={formData.front_view_images}
            onChange={(images) => handleFormChange('front_view_images', images)}
            isMobile={isMobile}
            icon={image1}
            description={
              <>
                {isMobile ? (
                  <>
                    <p>Click to upload screenshot.</p>
                    <p>
                      Knob face must be clearly visible with legible markings Clear real photo, Only one knob per image.
                    </p>
                  </>
                ) : (
                  <>
                    <p>Click to upload screenshot or drag and drop.</p>
                    <p>
                      Knob face must be clearly visible with legible markings Clear real photo, Only one knob per image.
                    </p>
                  </>
                )}
              </>
            }
          />
          <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.front_view_images}</p>
        </div>
        <div>
          <h3
            className={cn(
              'mb-2 flex items-center text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white',
              isMobile ? 'px-4' : 'px-0'
            )}
          >
            Side View Photo<span className="mr-1 text-red-400">*</span>
            <Tips isMobile={isMobile} />
          </h3>
          <Upload
            value={formData.side_view_images}
            onChange={(images) => handleFormChange('side_view_images', images)}
            isMobile={isMobile}
            icon={image2}
            description={
              <>
                {isMobile ? (
                  <>
                    <p>Click to upload screenshot.</p>
                    <p>
                      Knob face must be clearly visible with legible markings Clear real photo, Only one knob per image.
                    </p>
                  </>
                ) : (
                  <>
                    <p>Click to upload screenshot or drag and drop.</p>
                    <p>
                      Knob face must be clearly visible with legible markings Clear real photo, Only one knob per image.
                    </p>
                  </>
                )}
              </>
            }
          />
          <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.side_view_images}</p>
        </div>
        <div>
          <h3
            className={cn(
              'mb-2 text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white',
              isMobile ? 'px-4' : 'px-0'
            )}
          >
            Appliance type<span className="text-red-400">*</span>
          </h3>
          <Input
            isMobile={isMobile}
            placeholder="For example: Oven, Microwave"
            maxLength={255}
            value={formData.app_type}
            onChange={(value) => handleFormChange('app_type', value)}
          />
          <p
            className={cn(
              'mt-2 text-sm',
              isMobile ? 'px-4' : 'px-0',
              errors.app_type ? 'text-red-400' : 'text-[#BBBBBE]'
            )}
          >
            {errors.app_type ? errors.app_type : ``}
          </p>
        </div>
        <div>
          <h3
            className={cn(
              'mb-2 text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white',
              isMobile ? 'px-4' : 'px-0'
            )}
          >
            Read the exact value/marking indicated by the knob pointer
          </h3>
          <div className="rounded-xl border border-[#252532] px-4 py-2 md:flex md:gap-4 md:border-none md:bg-[#252532] md:p-4">
            <div className="md:flex-1">
              <h4 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white')}>
                Scale Type<span className="text-red-400">*</span>
              </h4>
              <Input
                isMobile={isMobile}
                placeholder="For Example: Temperature, Time"
                maxLength={255}
                value={formData.scale_type}
                onChange={(value) => handleFormChange('scale_type', value)}
              />
              <p
                className={cn(
                  'mt-2 text-sm',
                  isMobile ? 'px-4' : 'px-0',
                  errors.scale_type ? 'text-red-400' : 'text-[#BBBBBE]'
                )}
              >
                {errors.scale_type ? errors.scale_type : ``}
              </p>
            </div>
            <div className="md:flex-1">
              <h4 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:font-bold md:text-white')}>
                Scale Value<span className="text-red-400">*</span>
              </h4>
              <Input
                isMobile={isMobile}
                placeholder="For Example: 200°C, 20 Mins"
                maxLength={255}
                value={formData.scale_value}
                onChange={(value) => handleFormChange('scale_value', value)}
              />
              <p
                className={cn(
                  'mt-2 text-sm',
                  isMobile ? 'px-4' : 'px-0',
                  errors.scale_value ? 'text-red-400' : 'text-[#BBBBBE]'
                )}
              >
                {errors.scale_value ? errors.scale_value : ``}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <Button
          text="Submit"
          className={`w-full rounded-full bg-primary py-4 text-lg font-medium text-white transition-all hover:from-purple-600 hover:to-purple-700 active:scale-[97%] disabled:cursor-not-allowed ${!canSubmit ? 'opacity-50' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
        />
      </div>
    </>
  )
}
