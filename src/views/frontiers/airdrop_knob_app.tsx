import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { Camera } from 'lucide-react'

import frontiterApi from '@/apis/frontiter.api'
import commonApi from '@/api-v1/common.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/mobile-app/frontier-header'
import HelpDrawer from '@/components/mobile-app/help-drawer'
import SuccessModal from '@/components/mobile-app/success-modal'
import Upload from '@/components/mobile-app/image-upload'
import BottomDrawer from '@/components/mobile-app/bottom-drawer'
import KnobAnnotationCanvas, {
  KnobAnnotationCanvasRef
} from '@/components/frontier/airdrop/knob/knob-annotation-canvas'
import { KnobFormData, Point, Rect } from '@/components/frontier/airdrop/knob/types'
import { calculateFileHash } from '@/utils/file-hash'

import imageExample from '@/assets/frontier/knob/raw_app.png'
import labelExample from '@/assets/frontier/knob/label_app.png'

interface UploadedImage {
  url: string
  hash: string
}

export default function AirdropKnobApp({ templateId }: { templateId?: string }) {
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showExampleModal, setShowExampleModal] = useState(false)
  const [exampleType, setExampleType] = useState<'original' | 'annotated'>('original')
  const [showAnnotationModal, setShowAnnotationModal] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [rectModified, setRectModified] = useState(false)
  const [pointerModified, setPointerModified] = useState(false)
  const [scaleValue, setScaleValue] = useState('')

  const annotationCanvasRef = useRef<KnobAnnotationCanvasRef>(null)

  const fetchTaskDetail = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)

      if (templateId && !templateId.includes(res.data.data_display.template_id)) {
        throw new Error('Template not match!')
      }

      const totalRewards = res.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)

      setRewardPoints(totalRewards)
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

  const resetState = () => {
    setImage(null)
    setRect(null)
    setPointer(null)
    setRectModified(false)
    setPointerModified(false)
    setScaleValue('')
    setImageLoading(false)
  }

  const handleUploadChange = (newImages: UploadedImage[]) => {
    if (newImages.length === 0) {
      resetState()
      setUploadedImages([])
      return
    }

    setUploadedImages(newImages)
    const newImg = newImages[0]
    const oldImg = uploadedImages[0]

    if (!oldImg || newImg.url !== oldImg.url) {
      setImageLoading(true)
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        setImage(img)

        const w = img.naturalWidth
        const h = img.naturalHeight
        const cx = w / 2
        const cy = h / 2
        const size = Math.min(w, h) * 0.4
        const hs = size / 2

        setRect({
          x1: cx - hs,
          y1: cy - hs,
          x2: cx + hs,
          y2: cy - hs,
          x3: cx + hs,
          y3: cy + hs,
          x4: cx - hs,
          y4: cy + hs,
          center: { x: cx, y: cy }
        })
        setPointer({ x: cx, y: cy })
        setRectModified(false)
        setPointerModified(false)
        setScaleValue('')
        setImageLoading(false)
      }

      img.onerror = () => {
        message.error('Image upload failed, please try again')
        resetState()
      }

      img.src = newImg.url
    }
  }

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const handleRectChange = (newRect: Rect | null) => {
    setRect(newRect)
    if (newRect) {
      setRectModified(true)
    } else {
      setPointer(null)
      setScaleValue('')
    }
  }

  const handlePointerChange = (newPointer: Point | null) => {
    setPointer(newPointer)
    if (newPointer) {
      setPointerModified(true)
    } else {
      setScaleValue('')
    }
  }

  const allFieldsFilled = uploadedImages.length > 0 && scaleValue.trim() !== '' && rectModified && pointerModified

  const handleSubmit = async () => {
    if (!image || !rect || !rect.center || !pointer) {
      message.error('Please complete all steps before submitting')
      return
    }

    const trimmedScaleValue = scaleValue.trim()
    if (!trimmedScaleValue) {
      message.error('Please enter a scale value')
      return
    }

    setSubmitting(true)
    try {
      const annotatedImageBase64 = annotationCanvasRef.current?.getAnnotatedImage()
      if (!annotatedImageBase64) throw new Error('Failed to get annotated image')

      const annotatedFile = dataURLtoFile(annotatedImageBase64, 'annotated_knob.jpg')
      const annotatedFileHash = await calculateFileHash(annotatedFile)
      const uploadRes = await commonApi.uploadFile(annotatedFile)
      if (!uploadRes || !uploadRes.file_path) {
        throw new Error('Failed to upload annotated image')
      }

      const annotatedImageUrl = uploadRes.file_path
      const originalImage = uploadedImages[0]?.url
      const originalImageHash = uploadedImages[0]?.hash

      const submissionData: KnobFormData = {
        original_image: originalImage,
        original_image_hash: originalImageHash,
        annotated_image: annotatedImageUrl,
        annotated_image_hash: annotatedFileHash,
        rect: {
          x1: Math.round(rect.x1),
          y1: Math.round(rect.y1),
          x2: Math.round(rect.x2),
          y2: Math.round(rect.y2),
          x3: Math.round(rect.x3),
          y3: Math.round(rect.y3),
          x4: Math.round(rect.x4),
          y4: Math.round(rect.y4),
          center: {
            x: Math.round(rect.center.x!),
            y: Math.round(rect.center.y!)
          }
        },
        pointer_point: {
          x: Math.round(pointer.x),
          y: Math.round(pointer.y)
        },
        scale_value: trimmedScaleValue
      }

      await frontiterApi.submitTask(taskId!, {
        data: submissionData,
        templateId: templateId!,
        taskId: taskId!
      })

      setShowSuccessModal(true)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to submit!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="min-h-screen bg-[#F5F5F5] pb-10 text-xs text-[#999999]">
          <FrontierHeader title="Appliance Knob" onHelp={() => setShowInfoModal(true)} />

          <div className="space-y-6 px-5 pt-4">
            {/* Upload Original Photo */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#999999]">Upload Original Photo</label>
              <div className="rounded-[28px] bg-white p-4">
                <Upload
                  value={uploadedImages}
                  allUploadedImages={uploadedImages}
                  onChange={handleUploadChange}
                  maxCount={1}
                  itemClassName="h-[140px] w-[140px] rounded-[24px]"
                  description={
                    <div className="flex size-[140px] items-center justify-center rounded-[24px] bg-[#F5F5F5]">
                      <Camera className="size-8 text-[#999999]" />
                    </div>
                  }
                />
                <p className="mt-4 text-[12px] leading-[18px]">
                  Upload a clear front-facing photo of an appliance knob{' '}
                  <span
                    className="cursor-pointer text-[#00D1FF]"
                    onClick={() => {
                      setExampleType('original')
                      setShowExampleModal(true)
                    }}
                  >
                    example
                  </span>
                </p>
              </div>
            </div>

            {/* Image Annotation */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#999999]">Image Annotation</label>
              <div className="rounded-[28px] bg-white p-4">
                {image && !imageLoading ? (
                  <button
                    onClick={() => setShowAnnotationModal(true)}
                    className="flex h-[200px] w-full items-center justify-center rounded-[24px] bg-[#F5F5F5] transition-colors hover:bg-[#E5E5E5]"
                  >
                    <div className="flex flex-col items-center gap-2 text-[#999999]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#999999]">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                        <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-sm">
                        {rectModified && pointerModified ? 'Edit annotation' : 'Start labeling'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-[24px] bg-[#F5F5F5]">
                    <div className="flex flex-col items-center gap-2 text-[#999999]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#999999]">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                        <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-sm">Upload image first</span>
                    </div>
                  </div>
                )}
                <p className="mt-4 text-[12px] leading-[18px]">
                  Move the cyan rectangle to the knob position, the red dot to the center of the knob, and the orange
                  dot to the pointer position{' '}
                  <span
                    className="cursor-pointer text-[#00D1FF]"
                    onClick={() => {
                      setExampleType('annotated')
                      setShowExampleModal(true)
                    }}
                  >
                    example
                  </span>
                </p>
              </div>
            </div>

            {/* Pointer Value */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#999999]">Pointer Value</label>
              <input
                type="text"
                value={scaleValue}
                onChange={(e) => setScaleValue(e.target.value)}
                placeholder="e.g.: 60 min"
                className="h-[52px] w-full rounded-[26px] bg-white px-6 text-base text-black outline-none placeholder:text-[#3C3C434D]"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!allFieldsFilled || submitting}
              className={`h-[56px] w-full rounded-full text-base font-semibold transition-all ${
                allFieldsFilled ? 'bg-black text-white shadow-app-btn' : 'bg-[#A0A0A0]/40 text-white'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        <HelpDrawer
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="More About Frontier"
          cards={[
            {
              preset: 'about',
              title: 'Real-world Photo',
              content: [
                {
                  type: 'p',
                  text: 'This task requires high-resolution, frontal photos of individual appliance knobs (centered, with text scales). Provide precise bounding box and pointer annotations, including the scale value each pointer indicates.'
                }
              ]
            },
            {
              preset: 'guidelines',
              content: [
                {
                  type: 'h3',
                  text: 'Task Description'
                },
                {
                  type: 'p',
                  text: 'This task involves annotating appliance knobs from photos. You will upload a front-facing photo of a knob, mark the knob outer contour with a blue rectangle, mark the center with a red dot, mark the pointer position with an orange dot, and enter the scale value indicated by the pointer. Accurate annotations help build a high-quality dataset for knob recognition and analysis.'
                },
                {
                  type: 'list',
                  title: 'Requirements (Must Read)',
                  items: [
                    'Photo must clearly and completely contain the knob',
                    'Non-AI generated photos only',
                    'Must be front-facing view',
                    'Each image must contain exactly one knob',
                    'Knob must be centered in the photo',
                    'Scale markings around the knob must be in Chinese, English, or numbers, not just icons'
                  ]
                }
              ]
            },
            {
              preset: 'redline'
            }
          ]}
        />

        {/* Example Drawer */}
        <BottomDrawer open={showExampleModal} onClose={() => setShowExampleModal(false)}>
          <div className="pb-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Example</h3>
              <button
                onClick={() => setShowExampleModal(false)}
                className="flex size-8 items-center justify-center text-2xl text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-gray-600">Please refer to the following examples:</p>

            {/* Example Image */}
            <div className="overflow-hidden rounded-2xl bg-[#C4C4C4]">
              <img
                src={exampleType === 'original' ? imageExample : labelExample}
                alt={exampleType === 'original' ? 'Original knob photo example' : 'Annotated knob photo example'}
                className="w-full object-contain"
              />
            </div>
          </div>
        </BottomDrawer>

        {/* Annotation Modal */}
        {showAnnotationModal && image && (
          <KnobAnnotationCanvas
            ref={annotationCanvasRef}
            image={image}
            rect={rect}
            pointer={pointer}
            onRectChange={handleRectChange}
            onPointerChange={handlePointerChange}
            onClose={() => setShowAnnotationModal(false)}
            onConfirm={() => setShowAnnotationModal(false)}
          />
        )}

        <SuccessModal
          open={showSuccessModal}
          onClose={() => window.history.back()}
          points={rewardPoints}
          title="Submitted!"
          message="Your knob annotation has been submitted for review."
        />
      </Spin>
    </AuthChecker>
  )
}
