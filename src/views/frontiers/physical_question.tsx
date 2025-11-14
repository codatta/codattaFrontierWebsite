import { useEffect } from 'react'
import { Form, Button, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import PageHeader from '@/components/common/frontier-page-header'
import SubmitSuccessModal from '@/components/frontier/physical/submit-success-modal'
import QuestionContentSection from '@/components/frontier/physical/question-content-section'
import ResearchLiteratureSection from '@/components/frontier/physical/research-literature-section'
import ModelTestingSection from '@/components/frontier/physical/model-testing-section'
import ReviewChecklist from '@/components/frontier/physical/review-checklist'
import SubmissionNotes from '@/components/frontier/physical/submission-notes'
import { usePhysicalQuestion } from '@/components/frontier/physical/use-physical-question'
import { UploadedImage } from '@/components/frontier/physical/upload'

export default function PhysicalQuestion({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { taskId } = useParams()

  const {
    loading,
    isSubmitting,
    pageLoading,
    rewardPoints,
    resultType,
    errors,
    questionContent,
    recentResearchLiterature,
    certificationChecked,
    reviewChecklist,
    modelTests,
    setQuestionContent,
    setRecentResearchLiterature,
    setCertificationChecked,
    setReviewChecklist,
    setErrors,
    handleModelTestChange,
    handleSubmit,
    validateForm,
    checkTaskStatus
  } = usePhysicalQuestion(taskId, templateId)

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  const handleQuestionContentChange = (value: { text?: string; images?: UploadedImage[] }) => {
    const newContent = {
      ...questionContent,
      ...(value.text !== undefined && { text: value.text }),
      ...(value.images !== undefined && { images: value.images })
    }
    setQuestionContent(newContent)

    // Clear error if content is valid
    if (errors.questionContent && (newContent.text.trim() || newContent.images.length > 0)) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.questionContent
        return newErrors
      })
    }
  }

  const handleResearchLiteratureChange = (hasSource: boolean) => {
    setRecentResearchLiterature({ hasSource, url: hasSource ? recentResearchLiterature.url : '' })
    if (errors.recentResearchLiterature) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.recentResearchLiterature
        return newErrors
      })
    }
  }

  const handleSourceUrlChange = (url: string) => {
    setRecentResearchLiterature({ ...recentResearchLiterature, url })
    if (errors.recentResearchLiterature && url.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.recentResearchLiterature
        return newErrors
      })
    }
  }

  const handleCertificationChange = (checked: boolean) => {
    setCertificationChecked(checked)
    if (errors.certification && checked) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.certification
        return newErrors
      })
    }
  }

  const handleReviewChecklistChange = (value: string, checked: boolean) => {
    const newChecklist = checked ? [...reviewChecklist, value] : reviewChecklist.filter((v) => v !== value)
    setReviewChecklist(newChecklist)
    if (errors.reviewChecklist && newChecklist.length === 4) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.reviewChecklist
        return newErrors
      })
    }
  }

  return (
    <Spin spinning={pageLoading || loading} className="min-h-screen">
      <div className="min-h-screen bg-[#1a1625] pb-12">
        <PageHeader title="Physical Question Submission" />

        {resultType ? (
          <SubmitSuccessModal points={rewardPoints} open={true} onClose={() => window.history.back()} />
        ) : (
          <div className="mx-auto max-w-[1352px] px-10">
            <Form form={form} layout="vertical" className="space-y-12 pb-12">
              <QuestionContentSection
                value={questionContent}
                onChange={handleQuestionContentChange}
                error={errors.questionContent}
              />

              <ResearchLiteratureSection
                hasSource={recentResearchLiterature.hasSource}
                url={recentResearchLiterature.url}
                certificationChecked={certificationChecked}
                onHasSourceChange={handleResearchLiteratureChange}
                onUrlChange={handleSourceUrlChange}
                onCertificationChange={handleCertificationChange}
                error={errors.recentResearchLiterature}
                certificationError={errors.certification}
              />

              <ModelTestingSection
                modelTests={modelTests}
                onModelChange={handleModelTestChange}
                errors={errors.modelTests}
                correctAnswerError={errors.correctAnswer}
              />

              <ReviewChecklist
                value={reviewChecklist}
                onChange={handleReviewChecklistChange}
                error={errors.reviewChecklist}
              />
            </Form>
          </div>
        )}
        {!resultType && (
          <>
            <SubmissionNotes />
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              className={`mx-auto mt-12 block h-10 w-[240px] rounded-full text-sm font-normal ${!validateForm(false) && !isSubmitting ? 'opacity-50' : ''}`}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </Spin>
  )
}
