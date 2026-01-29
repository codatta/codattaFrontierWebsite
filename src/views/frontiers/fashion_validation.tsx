import { Spin, Carousel, message } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { CarouselRef } from 'antd/es/carousel'

import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { FashionValidationForm } from '@/components/frontier/fashion/form'
import { FashionQuestion, FashionAnswer } from '@/components/frontier/fashion/constants'
import frontiterApi from '@/apis/frontiter.api'
import { cn } from '@udecode/cn'

export default function FashionValidation({ templateId }: { templateId: string }) {
  const { taskId, uid } = useParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselRef = useRef<CarouselRef>(null)

  // Answers state
  const [questions, setQuestions] = useState<FashionQuestion[]>([])
  const [allAnswers, setAllAnswers] = useState<FashionAnswer[]>([])

  const onBack = () => {
    window.history.back()
  }

  async function getTaskDetail(taskId: string, templateId: string, uid?: string) {
    setPageLoading(true)
    try {
      const res = uid ? await frontiterApi.getFeedTaskDetail(uid) : await frontiterApi.getTaskDetail(taskId)

      if (res.data.data_display.template_id !== templateId) {
        throw new Error('Template not match!')
      }

      // Calculate rewards
      const totalRewards = res.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)
      setRewardPoints(totalRewards)

      const questions = (res.data.questions as unknown[] as FashionQuestion[]) || []
      if (!questions?.length) {
        throw new Error('Questions not found!')
      }

      setQuestions(questions)
      console.log(questions, 'questions')

      setAllAnswers(questions.map((question) => ({ ...question })) as FashionAnswer[])
    } catch (err) {
      console.error(err)
      message.error((err as Error).message)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (!taskId) return
    getTaskDetail(taskId!, templateId, uid)
  }, [taskId, templateId, uid])

  const handleFormSubmit = async (answer: FashionAnswer) => {
    // Save current answer
    const newAnswers = [...allAnswers]
    newAnswers[currentImageIndex] = Object.assign(newAnswers[currentImageIndex] || {}, answer)
    setAllAnswers(newAnswers)

    const isLast = currentImageIndex === questions.length - 1
    const uids = newAnswers.reduce((acc, cur) => acc.concat(cur.uid), [] as string[]).join(',')

    if (isLast) {
      // Submit all
      try {
        setPageLoading(true)

        await frontiterApi.submitTask(taskId!, {
          taskId: taskId!,
          templateId: templateId,
          uid: uids,
          data: {
            answers: newAnswers,
            channel: 'web'
          }
        })
        setModalShow(true)
      } catch (error) {
        message.error((error as Error).message || 'Failed to submit!')
      } finally {
        setPageLoading(false)
      }
    } else {
      // Go to next image
      const nextIndex = currentImageIndex + 1
      setCurrentImageIndex(nextIndex)
      carouselRef.current?.goTo(nextIndex)
    }
  }

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="min-h-screen bg-[#1C1C26] text-white">
          {/* Header */}
          <div className="border-b border-[#FFFFFF1F] py-6">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#FFFFFF99] transition-colors hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <h1 className="text-base font-bold">Fashion</h1>
              <div className="w-[60px]"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-2">
            {/* Left Column - Image Viewer */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
              {questions.length > 1 ? (
                <div className="relative aspect-[1/1] overflow-hidden rounded-2xl bg-[#FAFAFA]">
                  <Carousel ref={carouselRef} afterChange={setCurrentImageIndex} dots={false} className="size-full">
                    {questions.map((question, idx) => (
                      <div key={idx} className="flex aspect-[1/1] w-full items-center justify-center">
                        <img
                          src={question.image_url}
                          alt={`Fashion item ${idx + 1}`}
                          className="size-full object-contain"
                        />
                      </div>
                    ))}
                  </Carousel>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 rounded-full border-[0.5px] border-[#0000001A] bg-[#875DFF1F] px-3 py-1 text-sm font-bold backdrop-blur-sm">
                    <span className="text-base font-bold text-[#875DFF]">{currentImageIndex + 1}</span>
                    <span className="text-sm text-[#404049]">/{questions?.length ?? 1}</span>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl',
                    questions.length === 0 ? 'aspect-[1/1] bg-[#252532]' : 'bg-[#FAFAFA]'
                  )}
                >
                  <img
                    src={questions[0]?.image_url}
                    alt={`Fashion image`}
                    className={cn('mx-auto max-w-full object-contain', questions.length === 0 ? 'invisible' : '')}
                  />
                </div>
              )}
            </div>

            <FashionValidationForm
              key={currentImageIndex}
              initialData={allAnswers[currentImageIndex] || undefined}
              imageUrl={questions[currentImageIndex]?.image_url}
              onSubmit={handleFormSubmit}
              isLast={currentImageIndex === questions.length - 1}
            />
          </div>
        </div>
        <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/FASHION_VALIDATION/9506419959500105765
