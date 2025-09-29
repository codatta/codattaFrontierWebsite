import { useState, useCallback } from 'react'
import { message } from 'antd'

import { Button } from '@/components/booster/button'
import TextField from '../TextField'
import SelectField from '../SelectField'
import InputField from '../input'
import { ExpertRedline } from './guideline'
import { categoryList, modelList } from '../const'
import Upload, { type UploadedImage } from '../UploadImg'

const QUESTION_MAX_LENGTH = 2000
const MODEL_ANSWER_MAX_LENGTH = 5000
const CORRECT_ANSWER_MAX_LENGTH = 3000

interface ExpertAnswerFormData {
  question?: string
  domain?: string
  other_domain?: string
  model?: string
  model_answer?: string
  model_answer_screenshots: UploadedImage[]
  correct_answer?: string
}

export default function MyForm({ onSubmit }: { onSubmit: (data: ExpertAnswerFormData) => Promise<void> }) {
  const [formData, setFormData] = useState<ExpertAnswerFormData>({
    domain: undefined,
    other_domain: undefined,
    question: undefined,
    model_answer: undefined,
    model: undefined,
    model_answer_screenshots: [],
    correct_answer: undefined
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ExpertAnswerFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof ExpertAnswerFormData, value: string | UploadedImage[]) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }

      if (field === 'domain' && value !== 'other') {
        newFormData.other_domain = undefined
      }

      return newFormData
    })

    // Clear the error for the current field as a default action
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = useCallback(
    (updateErrors = true) => {
      const newErrors: Partial<Record<keyof ExpertAnswerFormData, string>> = {}
      let isValid = true

      const fieldsToValidate: (keyof ExpertAnswerFormData)[] = [
        'domain',
        'question',
        'model_answer',
        'correct_answer',
        'model'
      ]

      for (const key of fieldsToValidate) {
        if (!formData[key]) {
          newErrors[key] = 'This field is required.'
          isValid = false
        }
      }

      if (formData.domain === 'other' && !formData.other_domain) {
        newErrors.other_domain = 'This field is required.'
        isValid = false
      }

      if (formData.question && formData.question.length > QUESTION_MAX_LENGTH) {
        newErrors.question = `Question cannot exceed ${QUESTION_MAX_LENGTH} characters.`
        isValid = false
      }

      if (formData.model_answer && formData.model_answer.length > MODEL_ANSWER_MAX_LENGTH) {
        newErrors.model_answer = `Answer cannot exceed ${MODEL_ANSWER_MAX_LENGTH} characters.`
        isValid = false
      }

      if (formData.correct_answer && formData.correct_answer.length > CORRECT_ANSWER_MAX_LENGTH) {
        newErrors.correct_answer = `Correct answer cannot exceed ${CORRECT_ANSWER_MAX_LENGTH} characters.`
        isValid = false
      }

      if (formData.model_answer_screenshots.length === 0) {
        newErrors.model_answer_screenshots = 'Please upload at least one screenshot.'
        isValid = false
      }

      if (updateErrors) {
        setErrors(newErrors)
      }
      return isValid
    },
    [formData]
  )

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }
    setIsSubmitting(true)
    await onSubmit({
      ...formData,
      model_answer_screenshots: formData.model_answer_screenshots.map((img) => ({ url: img.url, hash: img.hash }))
    })
    setIsSubmitting(false)
  }

  const renderField = ({
    name,
    label,
    component,
    className,
    required = true
  }: {
    name: keyof ExpertAnswerFormData
    label: string
    component: React.ReactNode
    className?: string
    required?: boolean
  }) => (
    <li className={className}>
      {label && (
        <label className="mb-2 block text-base font-bold text-white">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      {component}
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
    </li>
  )

  return (
    <>
      <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
        <ul className="space-y-6">
          {renderField({
            name: 'question',
            label: 'Question',
            component: (
              <TextField
                placeholder="Please enter the question or problem statement"
                value={formData.question}
                onChange={(value) => updateFormData('question', value)}
                maxLength={QUESTION_MAX_LENGTH}
                showCount
              />
            )
          })}

          {renderField({
            name: 'domain',
            label: 'Domain',
            component: (
              <SelectField
                placeholder="Please select a domain"
                value={formData.domain}
                onChange={(value) => updateFormData('domain', value)}
                options={categoryList}
              />
            )
          })}
          {formData.domain === 'other' &&
            renderField({
              name: 'other_domain',
              label: '',
              component: (
                <InputField
                  placeholder="Enter your custom domain"
                  value={formData.other_domain}
                  onChange={(value) => updateFormData('other_domain', value)}
                />
              )
            })}
          {renderField({
            name: 'model',
            label: 'Model',
            component: (
              <SelectField
                placeholder="Please select an ai model"
                value={formData.model}
                onChange={(value) => updateFormData('model', value)}
                options={modelList}
              />
            )
          })}

          {renderField({
            name: 'model_answer',
            label: 'Model Answer',
            component: (
              <TextField
                placeholder="Please paste the answer provided by the AI model"
                value={formData.model_answer}
                onChange={(value) => updateFormData('model_answer', value)}
                maxLength={MODEL_ANSWER_MAX_LENGTH}
                showCount
              />
            )
          })}
          {renderField({
            name: 'model_answer_screenshots',
            label: 'Model Answer Screenshots',
            component: (
              <Upload
                maxCount={5}
                className="rounded-2xl border border-[#FFFFFF1F] p-4"
                value={formData.model_answer_screenshots}
                allUploadedImages={[...formData.model_answer_screenshots]}
                onChange={(images) => updateFormData('model_answer_screenshots', images)}
                description={
                  <div className="text-left text-xs text-[#606067] md:text-center md:text-sm">
                    <p>Click to upload or drag images here</p>
                    <p>Supports JPG, PNG, GIF formats, up to 5 images</p>
                  </div>
                }
              />
            )
          })}
          {renderField({
            name: 'correct_answer',
            label: 'Correct Answer',
            component: (
              <TextField
                placeholder="Please analyze and identify the specific reasons for the AI's incorrect answer"
                value={formData.correct_answer}
                onChange={(value) => updateFormData('correct_answer', value)}
                maxLength={CORRECT_ANSWER_MAX_LENGTH}
                showCount
              />
            )
          })}
        </ul>
      </div>
      <div className="mt-12 bg-[#FFFFFF0A]">
        <div className="mx-auto max-w-[1320px] px-6">
          <ExpertRedline />
        </div>
      </div>
      <Button
        text="Submit"
        className={`h-[44px] w-full rounded-full text-base font-bold ${!validateForm(false) && 'opacity-50'} md:mx-auto md:w-[240px]`}
        onClick={handleSubmit}
        disabled={isSubmitting}
        loading={isSubmitting}
      />
    </>
  )
}
