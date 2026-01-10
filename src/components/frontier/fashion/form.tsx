import { useState } from 'react'
import { cn } from '@udecode/cn'
import { Button } from '@/components/booster/button'
import { QuestionGroup } from './question-group'
import { QUESTION_OPTIONS, FashionAnswer } from './constants'

interface FashionValidationFormProps {
  initialData?: FashionAnswer
  imageUrl: string
  onSubmit: (data: FashionAnswer) => Promise<void>
  isLast?: boolean
}

export function FashionValidationForm({ initialData, imageUrl, onSubmit, isLast }: FashionValidationFormProps) {
  const [answers, setAnswers] = useState<FashionAnswer>(
    initialData ||
      ({
        image_url: imageUrl,
        is_valid: undefined,
        image_type: undefined,
        category: undefined,
        viewpoint: undefined
      } as unknown as FashionAnswer)
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQ1Change = (value: string) => {
    const is_valid = value as 'valid' | 'invalid'
    setAnswers((prev) => ({
      ...prev,
      is_valid,
      // Reset subsequent answers when Q1 changes
      image_type: undefined,
      category: undefined,
      viewpoint: undefined
    }))
  }

  const handleQ2Change = (value: string) => {
    const image_type = value as 'flat' | 'model' | 'collage' | 'poster'
    setAnswers((prev) => ({
      ...prev,
      image_type,
      // Reset subsequent answers when Q2 changes
      category: undefined,
      viewpoint: undefined
    }))
  }

  const handleQ3Change = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      category: value as 'top' | 'bottom' | 'full' | 'accessory'
    }))
  }

  const handleQ4Change = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      viewpoint: value as 'front' | 'back' | 'side'
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit({ ...answers, image_url: imageUrl })
    } finally {
      setIsSubmitting(false)
    }
  }

  const showQ2 = answers.is_valid === 'valid'
  const showQ3Q4 = showQ2 && answers.image_type === 'model'

  // Logic:
  // Q1 is always shown.
  // Q2 is shown if Q1 is Valid/Clear.
  // Q3 is shown if Q2 is selected (any type).
  // Q4 is shown ONLY if Q2 is On Model.

  // Wait, re-reading logic from user:
  // "Q2 Choose 'On Model', appear Q3, Q4; otherwise only appear Q3"
  // This implies Q3 appears for ANY valid Q2 selection.
  const showQ3 = showQ2 && !!answers.image_type

  const isSubmitEnabled = () => {
    if (!answers.is_valid) return false
    if (answers.is_valid === 'invalid') return true

    // Valid path
    if (!answers.image_type) return false

    // Must answer Q3 (Category)
    if (!answers.category) return false

    // If Model, must answer Q4 (Viewpoint)
    if (answers.image_type === 'model') {
      if (!answers.viewpoint) return false
    }

    return true
  }

  return (
    <div className="space-y-8">
      <QuestionGroup
        title="Is this image valid?"
        options={QUESTION_OPTIONS.q1}
        value={answers.is_valid}
        onChange={handleQ1Change}
      />

      {showQ2 && (
        <QuestionGroup
          title="What is the image type?"
          options={QUESTION_OPTIONS.q2}
          value={answers.image_type}
          onChange={handleQ2Change}
        />
      )}

      {showQ3 && (
        <QuestionGroup
          title="Main category?"
          options={QUESTION_OPTIONS.q3}
          value={answers.category}
          onChange={handleQ3Change}
        />
      )}

      {showQ3Q4 && (
        <QuestionGroup
          title="Model viewpoint?"
          options={QUESTION_OPTIONS.q4}
          value={answers.viewpoint}
          onChange={handleQ4Change}
        />
      )}
      <div className="pt-3">
        <Button
          text={isLast ? 'Submit' : 'Continue'}
          className={cn(
            'mx-auto h-10 w-[240px] rounded-full text-sm',
            !isSubmitEnabled() && 'cursor-not-allowed opacity-50'
          )}
          onClick={handleSubmit}
          disabled={!isSubmitEnabled() || isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </div>
  )
}
