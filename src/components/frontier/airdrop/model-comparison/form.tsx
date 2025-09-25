import { useState, useCallback } from 'react'
import { message } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

import { Button } from '@/components/booster/button'
import TextField from './TextField'
import SelectField from './SelectField'
import InputField from './input'
import { ExpertRedline } from './guideline'
import { domainList, modelList } from './const'
import Upload, { type UploadedImage } from './UploadImg'

interface ComparisonFormData {
  domain?: string
  other_domain?: string
  question?: string
  model_a?: string
  model_a_answer?: string
  model_a_screenshots: UploadedImage[]
  model_b?: string
  model_b_answer?: string
  model_b_screenshots: UploadedImage[]
  correct_answer?: string
}

export default function MyForm({ onSubmit }: { onSubmit: (data: ComparisonFormData) => Promise<void> }) {
  const [formData, setFormData] = useState<ComparisonFormData>({
    domain: undefined,
    question: undefined,
    model_a: undefined,
    model_a_answer: undefined,
    model_a_screenshots: [],
    model_b: undefined,
    model_b_answer: undefined,
    model_b_screenshots: [],
    correct_answer: undefined
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ComparisonFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (field: keyof ComparisonFormData, value: string | UploadedImage[]) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }

        // Clear the error for the current field as a default action
        if (newErrors[field]) {
          delete newErrors[field]
        }

        // Specific validation for model_a and model_b on change
        if (field === 'model_a') {
          if (value && value === newFormData.model_b) {
            newErrors.model_a = 'Cannot be the same as Model B.'
          } else if (newFormData.model_b && value !== newFormData.model_b) {
            // If the new value is valid, clear potential error on the other field
            if (newErrors.model_b === 'Cannot be the same as Model A.') {
              delete newErrors.model_b
            }
          }
        } else if (field === 'model_b') {
          if (value && value === newFormData.model_a) {
            newErrors.model_b = 'Cannot be the same as Model A.'
          } else if (newFormData.model_a && value !== newFormData.model_a) {
            // If the new value is valid, clear potential error on the other field
            if (newErrors.model_a === 'Cannot be the same as Model B.') {
              delete newErrors.model_a
            }
          }
        }

        return newErrors
      })

      return newFormData
    })
  }

  const validateForm = useCallback(
    (updateErrors = true) => {
      const newErrors: Partial<Record<keyof ComparisonFormData, string>> = {}
      let isValid = true

      const fieldsToValidate: (keyof ComparisonFormData)[] = [
        'domain',
        'question',
        'model_a',
        'model_a_answer',
        'model_b',
        'model_b_answer'
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

      if (formData.model_a && formData.model_b && formData.model_a === formData.model_b) {
        newErrors.model_a = 'Cannot be the same as Model B.'
        newErrors.model_b = 'Cannot be the same as Model A.'
        isValid = false
      }

      if (formData.question && formData.question.length > 2000) {
        newErrors.question = 'Question cannot exceed 2000 characters.'
        isValid = false
      }

      if (formData.model_a_answer && formData.model_a_answer.length > 5000) {
        newErrors.model_a_answer = 'Answer cannot exceed 5000 characters.'
        isValid = false
      }

      if (formData.model_b_answer && formData.model_b_answer.length > 5000) {
        newErrors.model_b_answer = 'Answer cannot exceed 5000 characters.'
        isValid = false
      }
      if (formData.correct_answer && formData.correct_answer.length > 2000) {
        newErrors.correct_answer = 'Correct answer cannot exceed 2000 characters.'
        isValid = false
      }

      // Special check for uploads if needed, assuming empty array is invalid
      if (formData.model_a_screenshots.length === 0) {
        newErrors.model_a_screenshots = 'Please upload at least one screenshot.'
        isValid = false
      }
      if (formData.model_b_screenshots.length === 0) {
        newErrors.model_b_screenshots = 'Please upload at least one screenshot.'
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
      model_a_screenshots: formData.model_a_screenshots.map((img) => ({ url: img.url, hash: img.hash })),
      model_b_screenshots: formData.model_b_screenshots.map((img) => ({ url: img.url, hash: img.hash }))
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
    name: keyof ComparisonFormData
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
            name: 'domain',
            label: 'Domain',
            component: (
              <SelectField
                placeholder="Please select a domain"
                value={formData.domain}
                onChange={(value) => updateFormData('domain', value)}
                options={domainList}
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
            name: 'question',
            label: 'Question',
            component: (
              <TextField
                placeholder="Please enter the question or problem statement for comparison"
                value={formData.question}
                onChange={(value) => updateFormData('question', value)}
                maxLength={2000}
                showCount
              />
            )
          })}
        </ul>
        <div className="overflow-hidden rounded-2xl bg-[#252532] pb-6">
          <div className="bg-white py-2 text-center font-semibold text-[#1C1C26]">
            <FileTextOutlined className="mr-2" />
            Model A
          </div>

          <ul className="mt-6 space-y-[30px] px-6">
            {renderField({
              name: 'model_a',
              label: 'Model A',
              component: (
                <SelectField
                  placeholder="Please select Model 1"
                  value={formData.model_a}
                  onChange={(value) => updateFormData('model_a', value)}
                  options={modelList.filter((item) => item.value !== formData.model_b)}
                />
              )
            })}
            {renderField({
              name: 'model_a_answer',
              label: 'Answer',
              component: (
                <TextField
                  placeholder="Please paste Model A's text answer"
                  value={formData.model_a_answer}
                  onChange={(value) => updateFormData('model_a_answer', value)}
                  maxLength={5000}
                  showCount
                />
              )
            })}
            {renderField({
              name: 'model_a_screenshots',
              label: 'Answer Screenshots',
              component: (
                <Upload
                  maxCount={5}
                  className="rounded-2xl border border-[#FFFFFF1F] p-4"
                  value={formData.model_a_screenshots}
                  allUploadedImages={[...formData.model_a_screenshots, ...formData.model_b_screenshots]}
                  onChange={(images) => updateFormData('model_a_screenshots', images)}
                  description={
                    <div className="text-left text-xs text-[#606067] md:text-center md:text-sm">
                      <p>Click to upload or drag images here</p>
                      <p>Supports JPG, PNG, GIF formats, up to 5 images</p>
                    </div>
                  }
                />
              )
            })}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#252532] pb-6">
          <div className="bg-white py-2 text-center font-semibold text-[#1C1C26]">
            <FileTextOutlined className="mr-2" />
            Model B
          </div>

          <ul className="mt-6 space-y-[30px] px-6">
            {renderField({
              name: 'model_b',
              label: 'Model B',
              component: (
                <SelectField
                  placeholder="Please select Model 2"
                  value={formData.model_b}
                  onChange={(value) => updateFormData('model_b', value)}
                  options={modelList.filter((item) => item.value !== formData.model_a)}
                />
              )
            })}
            {renderField({
              name: 'model_b_answer',
              label: 'Answer',
              component: (
                <TextField
                  placeholder="Please paste Model B's text answer"
                  value={formData.model_b_answer}
                  onChange={(value) => updateFormData('model_b_answer', value)}
                  maxLength={5000}
                  showCount
                />
              )
            })}
            {renderField({
              name: 'model_b_screenshots',
              label: 'Answer Screenshots',
              component: (
                <Upload
                  maxCount={5}
                  className="rounded-2xl border border-[#FFFFFF1F] p-4"
                  value={formData.model_b_screenshots}
                  allUploadedImages={[...formData.model_a_screenshots, ...formData.model_b_screenshots]}
                  onChange={(images) => updateFormData('model_b_screenshots', images)}
                  description={
                    <div className="text-left text-xs text-[#606067] md:text-center md:text-sm">
                      <p>Click to upload or drag images here</p>
                      <p>Supports JPG, PNG, GIF formats, up to 5 images</p>
                    </div>
                  }
                />
              )
            })}
          </ul>
        </div>
        {formData.model_a_answer && formData.model_b_answer && (
          <ul className="mx-auto max-w-[1320px] space-y-6 px-6">
            {renderField({
              name: 'correct_answer',
              label: 'Correct Answer',
              required: false,
              component: (
                <TextField
                  placeholder="Please provide your own answer or explanation"
                  value={formData.correct_answer}
                  onChange={(value) => updateFormData('correct_answer', value)}
                  maxLength={2000}
                  showCount
                />
              )
            })}
          </ul>
        )}
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
