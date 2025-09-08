import { useEffect, useState, useMemo } from 'react'
import { cn } from '@udecode/cn'

import Input from './input'
import Upload from './upload'
import { Button } from '@/components/booster/button'

import type { FormData } from './types'

export default function ArenaForm({
  isMobile,
  resultType,
  onSubmit
}: {
  isMobile: boolean
  resultType?: 'ADOPT' | 'PENDING' | 'REJECT' | null
  onSubmit: (data: FormData) => Promise<boolean>
}) {
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    question: '',
    chatGPT4oImage: [],
    qwen3Image: []
  })
  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.question &&
      formData.chatGPT4oImage?.length > 0 &&
      formData.qwen3Image?.length > 0
    )
  }, [errors, formData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.question) {
      newErrors.question = 'Question is required'
    }
    if (formData.chatGPT4oImage.length === 0) {
      newErrors.chatGPT4oImage = 'Please upload an image for ChatGPT-4o'
    }
    if (formData.qwen3Image.length === 0) {
      newErrors.qwen3Image = 'Please upload an image for Qwen-3'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const resetForm = () => {
    setFormData({
      question: '',
      chatGPT4oImage: [],
      qwen3Image: []
    })
  }
  const handleFormChange = (field: keyof FormData, value: string | { url: string; hash: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  useEffect(() => {
    resetForm()
  }, [resultType])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    const res = await onSubmit(formData)
    if (res) {
      resetForm()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="mt-4 text-sm leading-[22px] text-[#BBBBBE] md:mt-12">
        <div>
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            Question<span className="text-red-400">*</span>
          </h3>
          <Input
            isMobile={isMobile}
            placeholder="Enter Text"
            value={formData.question}
            maxLength={255}
            onChange={(value) => handleFormChange('question', value)}
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.question}</p>
        </div>
        <div className="mt-4 md:mt-8">
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            ChatGPT-4o Image<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.chatGPT4oImage}
            onChange={(images) => handleFormChange('chatGPT4oImage', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Submit a screenshot of the model's response</p>
              </div>
            }
            className="border-none bg-[#252532]"
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.chatGPT4oImage}</p>
        </div>
        <div className="mt-4 md:mt-8">
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            Qwen-3 Image<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.qwen3Image}
            onChange={(images) => handleFormChange('qwen3Image', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Submit a screenshot of the model's response</p>
              </div>
            }
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.qwen3Image}</p>
        </div>
      </div>
      <Button
        text={`Task Completed`}
        onClick={handleSubmit}
        className={cn(
          'mt-5 w-full rounded-full bg-primary px-4 text-base font-bold leading-[44px] text-white md:mx-auto md:mt-[60px] md:w-[240px] md:text-sm md:font-normal',
          !canSubmit ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        disabled={!canSubmit}
        loading={loading}
      />
    </>
  )
}
