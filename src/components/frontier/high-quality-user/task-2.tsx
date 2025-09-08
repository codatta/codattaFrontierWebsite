import { useEffect, useState, useMemo } from 'react'
import { cn } from '@udecode/cn'

import Input from './input'
import Upload from './upload'
import { Button } from '@/components/booster/button'

import type { FormData } from './types'

export default function ArenaForm({
  isMobile,
  resultType,
  onNext
}: {
  isMobile: boolean
  resultType?: 'ADOPT' | 'PENDING' | 'REJECT' | null
  onNext: (data: unknown) => Promise<boolean>
}) {
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    question: '',
    chat_gpt_4o: [],
    qwen_3: []
  })
  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.question &&
      formData.chat_gpt_4o?.length > 0 &&
      formData.qwen_3?.length > 0
    )
  }, [errors, formData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.question) {
      newErrors.question = 'Question is required'
    }
    if (formData.chat_gpt_4o.length === 0) {
      newErrors.chat_gpt_4o = 'Please upload an image for ChatGPT-4o'
    }
    if (formData.qwen_3.length === 0) {
      newErrors.qwen_3 = 'Please upload an image for Qwen-3'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const resetForm = () => {
    setFormData({
      question: '',
      chat_gpt_4o: [],
      qwen_3: []
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
    const res = await onNext({
      question: formData.question,
      answer: {
        chat_gpt_4o: formData.chat_gpt_4o,
        qwen_3: formData.qwen_3
      }
    })
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
            value={formData.chat_gpt_4o}
            onChange={(images) => handleFormChange('chat_gpt_4o', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Submit a screenshot of the model's response</p>
              </div>
            }
            className="border-none bg-[#252532]"
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.chat_gpt_4o}</p>
        </div>
        <div className="mt-4 md:mt-8">
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            Qwen-3 Image<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.qwen_3}
            onChange={(images) => handleFormChange('qwen_3', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Submit a screenshot of the model's response</p>
              </div>
            }
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.qwen_3}</p>
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
