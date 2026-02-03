import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, App } from 'antd'

import frontiterApi from '@/apis/frontiter.api'
import commonApi from '@/api-v1/common.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/mobile-app/frontier-header'
import HelpDrawer from '@/components/mobile-app/help-drawer'
import SuccessModal from '@/components/mobile-app/success-modal'
import Upload from '@/components/mobile-app/image-upload'
import BottomDrawer from '@/components/mobile-app/bottom-drawer'
import KnobAnnotationCanvas, { KnobAnnotationCanvasRef } from '@/components/frontier/airdrop/knob/annotation-canvas-app'
import { KnobFormData, Point, Rect } from '@/components/frontier/airdrop/knob/types'
import { calculateFileHash } from '@/utils/file-hash'
import { AppToastContainer } from '@/hooks/use-app-toast'

import imageExample from '@/assets/frontier/knob/raw_app.png'
import labelExample from '@/assets/frontier/knob/label_app.png'

interface UploadedImage {
  url: string
  hash: string
}

export default function AirdropKnobApp({ templateId }: { templateId?: string }) {
  const { taskId } = useParams()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showExampleModal, setShowExampleModal] = useState(false)
  const [exampleType, setExampleType] = useState<'original' | 'annotated'>('original')
  const [showAnnotationModal, setShowAnnotationModal] = useState(false)
  const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined)

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [rectModified, setRectModified] = useState(false)
  const [pointerModified, setPointerModified] = useState(false)
  const [scaleValue, setScaleValue] = useState('')
  const [annotatedImagePreview, setAnnotatedImagePreview] = useState<string | null>(null)

  const annotationCanvasRef = useRef<KnobAnnotationCanvasRef>(null)

  const fetchTaskDetail = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)

      if (templateId && !templateId.includes(res.data.data_display.template_id)) {
        throw new Error('Template not match!')
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load task detail.'
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }, [message, taskId, templateId])

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
    setAnnotatedImagePreview(null)
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
        // Offset pointer from center to make it clearly visible
        const offset = hs * 0.3
        setPointer({ x: cx + offset, y: cy - offset })
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

    if (!uploadedImages || uploadedImages.length === 0 || !uploadedImages[0]?.url || !uploadedImages[0]?.hash) {
      message.error('Please upload an image first')
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

      const submitRes = await frontiterApi.submitTask(taskId!, {
        data: submissionData,
        templateId: templateId!,
        taskId: taskId!
      })

      // Extract reward points from submit response
      if (submitRes?.data?.reward_info && Array.isArray(submitRes.data.reward_info)) {
        const totalRewards = submitRes.data.reward_info
          .filter(
            (item: { reward_mode: string; reward_type: string }) =>
              item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          )
          .reduce((acc: number, cur: { reward_value: number }) => acc + cur.reward_value, 0)
        setRewardPoints(totalRewards > 0 ? totalRewards : undefined)
      } else {
        setRewardPoints(undefined)
      }

      setShowSuccessModal(true)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to submit!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthChecker>
      <AppToastContainer />
      <Spin spinning={loading || submitting}>
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
                  itemClassName="h-[107px] w-[107px] rounded-[20px]"
                  description={
                    <div className="flex size-[107px] items-center justify-center rounded-[20px] bg-[#F5F5F5]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.89587 8.54102C8.45762 8.54102 7.29171 9.70693 7.29171 11.1452C7.29171 12.5834 8.45762 13.7493 9.89587 13.7493C11.3341 13.7493 12.5 12.5834 12.5 11.1452C12.5 9.70693 11.3341 8.54102 9.89587 8.54102Z"
                          fill="#999999"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.39587 1.66602C7.11969 1.66602 6.8672 1.82206 6.74369 2.06909L5.69522 4.16602H2.81254C1.71948 4.16602 0.833374 5.05212 0.833374 6.14518V16.1452C0.833374 17.2382 1.71948 18.1243 2.81254 18.1243H16.9792C18.0723 18.1243 18.9584 17.2382 18.9584 16.1452V6.14518C18.9584 5.05212 18.0723 4.16602 16.9792 4.16602H14.0965L13.0481 2.06909C12.9245 1.82206 12.6721 1.66602 12.3959 1.66602H7.39587ZM5.83337 11.1452C5.83337 8.90152 7.65221 7.08268 9.89587 7.08268C12.1395 7.08268 13.9584 8.90152 13.9584 11.1452C13.9584 13.3888 12.1395 15.2077 9.89587 15.2077C7.65221 15.2077 5.83337 13.3888 5.83337 11.1452Z"
                          fill="#999999"
                        />
                      </svg>
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
              <div className="rounded-[26px] bg-white p-4">
                {annotatedImagePreview ? (
                  <>
                    <div className="relative inline-block">
                      <button
                        onClick={() => {
                          setShowAnnotationModal(true)
                        }}
                        className="block size-[107px] overflow-hidden rounded-[20px]"
                      >
                        <img src={annotatedImagePreview} alt="Annotated preview" className="size-full object-contain" />
                      </button>
                      <button
                        onClick={() => {
                          setAnnotatedImagePreview(null)
                          setRectModified(false)
                          setPointerModified(false)

                          // Reset rect and pointer to default positions when deleting annotation
                          if (image) {
                            const w = image.naturalWidth
                            const h = image.naturalHeight
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
                            // Offset pointer from center to make it clearly visible
                            const offset = hs * 0.3
                            setPointer({ x: cx + offset, y: cy - offset })
                          }

                          // Reset step states in annotation canvas
                          annotationCanvasRef.current?.resetStepStates()
                        }}
                        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-[#999999] text-lg text-white"
                      >
                        ×
                      </button>
                    </div>
                    <p className="mt-4 text-[12px] leading-[18px] text-[#999999]">
                      Move the cyan rectangle to the knob position, the red dot to the center of the knob, and the
                      orange dot to the pointer position{' '}
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
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (!image || imageLoading) {
                          message.warning('Please upload an image first')
                          return
                        }
                        setShowAnnotationModal(true)
                      }}
                      className="flex h-[107px] w-full items-center justify-center rounded-[20px] bg-[#F5F5F5] transition-colors"
                    >
                      <div className="flex items-center gap-1 text-[#999999]">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.9166 4.58398V3.75065C17.9166 2.69148 17.3091 2.08398 16.25 2.08398H15.4166C14.4308 2.08398 13.8433 2.61565 13.7658 3.54232H6.23495C6.15745 2.61565 5.56994 2.08398 4.58411 2.08398H3.75077C2.69161 2.08398 2.08411 2.69148 2.08411 3.75065V4.58398C2.08411 5.56982 2.61577 6.15731 3.54244 6.23481V13.7657C2.61577 13.8432 2.08411 14.4306 2.08411 15.4165V16.2498C2.08411 17.309 2.69161 17.9165 3.75077 17.9165H4.58411C5.56994 17.9165 6.15745 17.3848 6.23495 16.4581H13.7658C13.8433 17.3848 14.4308 17.9165 15.4166 17.9165H16.25C17.3091 17.9165 17.9166 17.309 17.9166 16.2498V15.4165C17.9166 14.4306 17.385 13.8432 16.4583 13.7657V6.23481C17.385 6.15731 17.9166 5.56982 17.9166 4.58398ZM13.7658 15.209H6.23495C6.16329 14.3515 5.64994 13.8382 4.79244 13.7665V6.23565C5.64994 6.16398 6.16329 5.65066 6.23495 4.79316H13.7658C13.8374 5.65066 14.3508 6.16398 15.2083 6.23565V13.7665C14.3508 13.8382 13.8374 14.3515 13.7658 15.209Z"
                            fill="#999999"
                          />
                        </svg>

                        <span className="text-sm">Start labeling</span>
                      </div>
                    </button>
                    <p className="mt-4 text-[12px] leading-[18px] text-[#999999]">
                      Move the cyan rectangle to the knob position, the red dot to the center of the knob, and the
                      yellow dot to the pointer position{' '}
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
                  </>
                )}
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
          <div className="pb-6 pt-4">
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

        {/* Annotation Modal - Keep mounted to preserve ref */}
        {image && (
          <div className={showAnnotationModal ? '' : 'hidden'}>
            <KnobAnnotationCanvas
              ref={annotationCanvasRef}
              image={image}
              rect={rect}
              pointer={pointer}
              rectModified={rectModified}
              pointerModified={pointerModified}
              onRectChange={handleRectChange}
              onPointerChange={handlePointerChange}
              onConfirm={() => {
                console.log('Confirm clicked - rect:', rect, 'pointer:', pointer)
                const annotatedImage = annotationCanvasRef.current?.getAnnotatedImage()
                console.log('Generated annotated image:', annotatedImage ? 'Success' : 'Failed')
                if (annotatedImage) {
                  setAnnotatedImagePreview(annotatedImage)
                  console.log('Preview set successfully')
                }
                setShowAnnotationModal(false)
              }}
            />
          </div>
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
