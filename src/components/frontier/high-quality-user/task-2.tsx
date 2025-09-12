import { useEffect, useState, useMemo, useCallback } from 'react'
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
  const [chat_gpt_4o_hash, qwen_3_hash] = useMemo(() => {
    return [formData.chat_gpt_4o[0]?.hash, formData.qwen_3[0]?.hash]
  }, [formData])

  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.question &&
      formData.chat_gpt_4o?.length > 0 &&
      formData.qwen_3?.length > 0
    )
  }, [errors, formData])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.question) {
      newErrors.question = 'Question is required'
    } else {
      const validCharsRegex = /^[a-zA-Z0-9\s.,?!;:'"()[\]{}\-_+=@#$%^&*<>/\\]+$/
      if (!validCharsRegex.test(formData.question)) {
        newErrors.question = 'Only English characters are allowed'
      }
    }
    if (formData.chat_gpt_4o.length === 0) {
      newErrors.chat_gpt_4o = 'Please upload an image for ChatGPT-4o'
    }
    if (formData.qwen_3.length === 0) {
      newErrors.qwen_3 = 'Please upload an image for Qwen-3'
    } else if (chat_gpt_4o_hash === qwen_3_hash) {
      newErrors.qwen_3 = 'Qwen-3 image must be different from ChatGPT-4o image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, chat_gpt_4o_hash, qwen_3_hash])
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

  useEffect(() => {
    if (qwen_3_hash) {
      if (chat_gpt_4o_hash === qwen_3_hash) {
        setErrors((prev) => ({ ...prev, qwen_3: 'Qwen-3 image must be different from ChatGPT-4o image' }))
      } else {
        setErrors((prev) => ({ ...prev, qwen_3: undefined }))
      }
    }

    if (formData.question && typeof formData.question === 'string') {
      const validCharsRegex = /^[a-zA-Z0-9\s.,?!;:'"()[\]{}\-_+=@#$%^&*<>/\\]+$/
      if (!validCharsRegex.test(formData.question)) {
        setErrors((prev) => ({
          ...prev,
          question: 'Only English characters are allowed'
        }))
      }
    }
  }, [chat_gpt_4o_hash, qwen_3_hash, formData.question])

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
                <p>Submit a screenshot that includes both the question and the model's answer.</p>
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
                <p>Submit a screenshot that includes both the question and the model's answer.</p>
              </div>
            }
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.qwen_3}</p>
        </div>
      </div>
      <Button
        text={`Submit`}
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
