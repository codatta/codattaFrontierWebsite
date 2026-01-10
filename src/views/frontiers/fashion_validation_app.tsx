import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { cn } from '@udecode/cn'

import AuthChecker from '@/components/app/auth-checker'
import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'
import SuccessModal from '@/components/mobile-app/success-modal'
import frontiterApi from '@/apis/frontiter.api'
import { FashionAnswer, FASHION_IMAGES, QUESTION_OPTIONS } from '@/components/frontier/fashion/constants'
import {
  ValidIcon,
  InvalidIcon,
  FlatIcon,
  ModelIcon,
  CollageIcon,
  PosterIcon,
  TopIcon,
  BottomIcon,
  FullIcon,
  AccessoryIcon,
  FrontIcon,
  BackIcon,
  SideIcon,
  CheckIcon
} from '@/components/frontier/fashion/icons'

type FashionAnswerDraft = Partial<FashionAnswer> & { image_url: string }

interface OptionButtonProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  icon?: React.ElementType
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, description, selected, onClick, icon: Icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-full min-h-[84px] flex-col items-start justify-between rounded-[20px] border p-4 text-left transition-all',
        selected ? 'border-[#40E1EF] bg-[#40E1EF14]' : 'border-white bg-white'
      )}
    >
      {/* Header: Icon + Checkmark */}
      <div className="flex w-full items-start justify-between">
        <div className="text-[#1C1C1C]">{Icon ? <Icon /> : <div className="size-7" />}</div>
        {selected && <CheckIcon size={20} />}
      </div>

      {/* Content */}

      <div className="my-2 text-[17px] text-black">{label}</div>
      {description && <p className="text-[13px] leading-[15px] text-[#999999]">{description}</p>}
    </button>
  )
}

const QuestionSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="px-4 text-[17px] font-semibold text-[#999999]">{title}</h3>
    <div>{children}</div>
  </div>
)

// Map values to icons
const ICON_MAP: Record<string, React.ElementType> = {
  valid: ValidIcon,
  invalid: InvalidIcon,
  flat: FlatIcon,
  model: ModelIcon,
  collage: CollageIcon,
  poster: PosterIcon,
  top: TopIcon,
  bottom: BottomIcon,
  full: FullIcon,
  accessory: AccessoryIcon,
  front: FrontIcon,
  back: BackIcon,
  side: SideIcon
}

const FashionValidationApp: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId } = useParams()
  const totalImages = FASHION_IMAGES.length

  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(true)
  const [rewardPoints, setRewardPoints] = useState(0)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [answers, setAnswers] = useState<FashionAnswerDraft[]>([])

  const currentImageUrl = FASHION_IMAGES[currentImageIndex]
  const currentAnswer = useMemo(
    () => answers[currentImageIndex] || { image_url: currentImageUrl },
    [answers, currentImageIndex, currentImageUrl]
  )
  const isLastImage = currentImageIndex === totalImages - 1

  const updateAnswer = (updater: (prev: FashionAnswerDraft) => FashionAnswerDraft) => {
    setAnswers((prev) => {
      const next = [...prev]
      const baseline = next[currentImageIndex] || { image_url: currentImageUrl }
      next[currentImageIndex] = updater(baseline)
      return next
    })
  }

  const handleValiditySelect = (value: 'valid' | 'invalid') => {
    updateAnswer((prev) => ({
      image_url: prev.image_url,
      is_valid: value,
      image_type: undefined,
      category: undefined,
      viewpoint: undefined
    }))
  }

  const handleImageTypeSelect = (value: 'flat' | 'model' | 'collage' | 'poster') => {
    updateAnswer((prev) => ({
      ...prev,
      image_type: value,
      category: undefined,
      viewpoint: undefined
    }))
  }

  const handleCategorySelect = (value: 'top' | 'bottom' | 'full' | 'accessory') => {
    updateAnswer((prev) => ({
      ...prev,
      category: value
    }))
  }

  const handleViewpointSelect = (value: 'front' | 'back' | 'side') => {
    updateAnswer((prev) => ({
      ...prev,
      viewpoint: value
    }))
  }

  const canContinue = useMemo(() => {
    if (!currentAnswer?.is_valid) return false
    if (currentAnswer.is_valid === 'invalid') return true
    if (!currentAnswer.image_type) return false
    if (!currentAnswer.category) return false
    if (currentAnswer.image_type === 'model' && !currentAnswer.viewpoint) return false
    return true
  }, [currentAnswer])

  const handleNextOrSubmit = async () => {
    if (!taskId) {
      message.error('Task ID is missing.')
      return
    }
    if (!canContinue) return

    if (!isLastImage) {
      setCurrentImageIndex((prev) => Math.min(prev + 1, totalImages - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!answers.every((answer) => answer?.is_valid)) {
      message.error('Please finish all images before submitting.')
      return
    }

    // TODO

    const serializedAnswers = answers.map((item, index) => ({
      image_url: item?.image_url || FASHION_IMAGES[index],
      is_valid: item!.is_valid as 'valid' | 'invalid',
      image_type: item?.image_type,
      category: item?.category,
      viewpoint: item?.viewpoint
    }))

    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId, {
        taskId,
        templateId,
        data: { answers: serializedAnswers, channel: 'app' }
      })
      setModalShow(true)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to submit!'
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const fetchTaskDetail = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    try {
      console.log('template_id', templateId)
      const res = await frontiterApi.getTaskDetail(taskId)
      if (!templateId?.includes(res.data.data_display.template_id)) {
        throw new Error('Template not match!')
      }
      const totalRewards = res.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)
      setRewardPoints(totalRewards)
      setAnswers(FASHION_IMAGES.map((url) => ({ image_url: url })))
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load task detail.'
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    fetchTaskDetail()
  }, [fetchTaskDetail])

  const onBack = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isInApp = userAgent.includes('codatta')
    if (isInApp && typeof window !== 'undefined') {
      const nativeBridge = (
        window as typeof window & { native?: { call: (method: string, ...args: unknown[]) => void } }
      ).native
      if (nativeBridge?.call) nativeBridge.call('goBack')
      else window.history.back()
    } else {
      window.history.back()
    }
  }

  const showTypeQuestion = currentAnswer?.is_valid === 'valid'
  const showCategoryQuestion = showTypeQuestion && !!currentAnswer?.image_type
  const showViewpointQuestion = showCategoryQuestion && currentAnswer?.image_type === 'model'

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="flex h-screen flex-col gap-8 bg-[#F5F5F5]">
          <div className="z-10 flex-none bg-[#F7F8FA]">
            <MobileAppFrontierHeader
              title={<span className="font-bold">Fashion</span>}
              canSubmit={false}
              onBack={onBack}
              showSubmitButton={false}
            />

            {/* Image preview */}
            <div className="px-4">
              <div className="relative aspect-[370/200] rounded-[26px] bg-[#FAFAFA]">
                <div className="aspect-[370/200] overflow-hidden rounded-[26px]">
                  <img
                    src={currentImageUrl}
                    alt={`fashion-${currentImageIndex + 1}`}
                    className="mx-auto max-h-full max-w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-3 right-3 rounded-full border-[0.5px] border-[#0000001A] bg-white/40 px-2 py-1 text-sm font-semibold backdrop-blur-sm">
                  <span className="text-[17px] font-bold text-[#40E1EF]">{currentImageIndex + 1}</span>
                  <span className="text-[13px] text-[#666666]">/{totalImages}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="space-y-8">
              <QuestionSection title="Is this image valid?">
                <div className="grid grid-cols-2 gap-3">
                  {QUESTION_OPTIONS.q1.map((option) => (
                    <OptionButton
                      key={option.value}
                      label={option.label}
                      description={option.description}
                      selected={currentAnswer?.is_valid === option.value}
                      onClick={() => handleValiditySelect(option.value as 'valid' | 'invalid')}
                      icon={ICON_MAP[option.value]}
                    />
                  ))}
                </div>
              </QuestionSection>

              {showTypeQuestion && (
                <QuestionSection title="What is the image type?">
                  <div className="grid grid-cols-2 gap-3">
                    {QUESTION_OPTIONS.q2.map((option) => (
                      <OptionButton
                        key={option.value}
                        label={option.label}
                        selected={currentAnswer?.image_type === option.value}
                        onClick={() => handleImageTypeSelect(option.value as 'flat' | 'model' | 'collage' | 'poster')}
                        icon={ICON_MAP[option.value]}
                      />
                    ))}
                  </div>
                </QuestionSection>
              )}

              {showCategoryQuestion && (
                <QuestionSection title="Main category?">
                  <div className="grid grid-cols-2 gap-3">
                    {QUESTION_OPTIONS.q3.map((option) => (
                      <OptionButton
                        key={option.value}
                        label={option.label}
                        selected={currentAnswer?.category === option.value}
                        onClick={() => handleCategorySelect(option.value as 'top' | 'bottom' | 'full' | 'accessory')}
                        icon={ICON_MAP[option.value]}
                      />
                    ))}
                  </div>
                </QuestionSection>
              )}

              {showViewpointQuestion && (
                <QuestionSection title="Model viewpoint?">
                  <div className="grid grid-cols-2 gap-3">
                    {QUESTION_OPTIONS.q4.map((option) => (
                      <OptionButton
                        key={option.value}
                        label={option.label}
                        selected={currentAnswer?.viewpoint === option.value}
                        onClick={() => handleViewpointSelect(option.value as 'front' | 'back' | 'side')}
                        icon={ICON_MAP[option.value]}
                      />
                    ))}
                  </div>
                </QuestionSection>
              )}

              <button
                onClick={handleNextOrSubmit}
                disabled={!canContinue}
                className="h-[56px] w-full rounded-full bg-black text-[17px] font-semibold leading-[56px] text-white transition-all disabled:bg-black/20 disabled:text-white/60"
              >
                {isLastImage ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>

          <SuccessModal
            open={modalShow}
            onClose={onBack}
            title="Successful"
            message="Other rewards will issue automatically after answer verification."
            points={rewardPoints}
            buttonText="Got it"
          />
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default FashionValidationApp
