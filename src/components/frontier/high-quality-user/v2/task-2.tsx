import { useEffect, useState, useMemo, useCallback } from 'react'
import { cn } from '@udecode/cn'

import Input from '../input'
import Upload from '../upload'
import { Button } from '@/components/booster/button'

import type { FormData } from './types'
import Select from './select'

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
    model: '',
    question: '',
    ai_wrong_answer: [],
    your_correct_answer: []
  })
  const [ai_wrong_answer_hash, your_correct_answer_hash] = useMemo(() => {
    return [formData.ai_wrong_answer[0]?.hash, formData.your_correct_answer[0]?.hash]
  }, [formData])

  const canSubmit = useMemo(() => {
    console.log(formData, errors)
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.model &&
      !!formData.question &&
      formData.ai_wrong_answer?.length > 0 &&
      formData.your_correct_answer?.length > 0
    )
  }, [errors, formData])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.model) {
      newErrors.model = 'Model is required'
    }

    if (!formData.question) {
      newErrors.question = 'Question is required'
    } else {
      const validCharsRegex = /^[a-zA-Z0-9\s.,?!;:'"()[\]{}\-_+=@#$%^&*<>/\\]+$/
      if (!validCharsRegex.test(formData.question)) {
        newErrors.question = 'Only English characters are allowed'
      }
    }
    if (formData.ai_wrong_answer.length === 0) {
      newErrors.ai_wrong_answer = 'Please upload an image for wrong answer'
    }
    if (formData.your_correct_answer.length === 0) {
      newErrors.your_correct_answer = 'Please upload an image for correct answer'
    } else if (ai_wrong_answer_hash === your_correct_answer_hash) {
      newErrors.your_correct_answer = 'Correct answer image must be different from wrong answer image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, ai_wrong_answer_hash, your_correct_answer_hash])

  const resetForm = () => {
    setFormData({
      model: '',
      question: '',
      ai_wrong_answer: [],
      your_correct_answer: []
    })
  }
  const handleFormChange = (field: keyof FormData, value: string | { url: string; hash: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    console.log(field, value)
  }

  useEffect(() => {
    resetForm()
  }, [resultType])

  useEffect(() => {
    if (your_correct_answer_hash) {
      if (ai_wrong_answer_hash === your_correct_answer_hash) {
        setErrors((prev) => ({
          ...prev,
          your_correct_answer: 'Correct answer image must be different from wrong answer image'
        }))
      } else {
        setErrors((prev) => ({ ...prev, your_correct_answer: undefined }))
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
  }, [ai_wrong_answer_hash, your_correct_answer_hash, formData.question])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    const res = await onNext({
      model: formData.model,
      question: formData.question,
      answer: {
        ai_wrong_answer: formData.ai_wrong_answer,
        your_correct_answer: formData.your_correct_answer
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
            Choose One Model<span className="text-red-400">*</span>
          </h3>
          <Select
            className="rounded-[10px] leading-5 md:rounded-lg md:leading-[22px]"
            options={[
              {
                label: 'ChatGPT-4o',
                value: 'chatgpt-4o'
              },
              {
                label: 'Qwen-3',
                value: 'qwen-3'
              }
            ]}
            value={formData.model}
            onChange={(value: string | number) => handleFormChange('model', String(value))}
            placeholder="Select a model"
            isMobile={isMobile}
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.model}</p>
        </div>
        <div>
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            Your Question<span className="text-red-400">*</span>
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
            Image(Show model's wrong answer)<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.ai_wrong_answer}
            onChange={(images) => handleFormChange('ai_wrong_answer', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Submit screenshot proof from the model you tested</p>
              </div>
            }
            className="border-none bg-[#252532]"
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.ai_wrong_answer}</p>
        </div>
        <div className="mt-4 md:mt-8">
          <h3 className={cn('mb-2', isMobile ? 'px-4' : 'px-0 text-base font-bold text-white')}>
            Correct Answer<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.your_correct_answer}
            onChange={(images) => handleFormChange('your_correct_answer', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-[#606067] md:text-center md:text-sm">
                <p>Your provided answer must differ from the AI's response</p>
              </div>
            }
          />
          <p className={cn('mt-2 text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.your_correct_answer}</p>
        </div>
      </div>
      <Button
        text={`Submit`}
        onClick={handleSubmit}
        className={cn(
          'mt-5 w-full rounded-full bg-primary px-4 text-base font-bold leading-[44px] text-white md:mx-auto md:mt-[60px] md:w-[240px] md:text-sm md:font-normal',
          !canSubmit ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        // disabled={!canSubmit}
        loading={loading}
      />
    </>
  )
}
