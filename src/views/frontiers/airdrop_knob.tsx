import commonApi from '@/api-v1/common.api'
import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import AnnotationCanvas, { AnnotationCanvasRef } from '@/components/frontier/airdrop/knob/annotation-canvas'
import Guideline, { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import ImageUploader from '@/components/frontier/airdrop/knob/image-uploader'
import ScaleInput from '@/components/frontier/airdrop/knob/scale-input'
import { KnobFormData, Point, Rect } from '@/components/frontier/airdrop/knob/types'
import { UploadChangeContext, UploadedImage } from '@/components/frontier/airdrop/UploadImg'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { calculateFileHash } from '@/utils/file'
import { Button } from '@/components/booster/button'
import { message, Modal, Spin } from 'antd'
import { ArrowLeft } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

const AirdropKnob: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // State
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [rectModified, setRectModified] = useState(false)
  const [pointerModified, setPointerModified] = useState(false)
  const [scaleValue, setScaleValue] = useState('')
  const [scaleValueError, setScaleValueError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [imageLoading, setImageLoading] = useState(false)

  // Refs
  const annotationCanvasRef = useRef<AnnotationCanvasRef>(null)

  // API Check
  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) return

    setLoading(true)
    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }
    } catch (error: unknown) {
      console.error(error)
      // message.error(error.message || 'Failed to get task detail!')
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  // Helper to reset all state
  const resetState = () => {
    setImage(null)
    setRect(null)
    setPointer(null)
    setRectModified(false)
    setPointerModified(false)
    setScaleValue('')
    setScaleValueError('')
    setUploadedImages([])
    setImageLoading(false)
  }

  // Handle Upload Change
  const handleUploadChange = (newImages: UploadedImage[], context?: UploadChangeContext) => {
    // If UploadImg removed the failed file internally, newImages might be empty.
    // However, we still want to handle the 'error' context explicitly if present.

    if (context?.type === 'uploading') {
      setUploadedImages(newImages)
      setImageLoading(true)
      return
    }

    if (context?.type === 'error') {
      message.error('Image upload failed, please try again')
      resetState()
      return
    }

    // Standard empty check (e.g. user manually removed image)
    if (newImages.length === 0) {
      resetState()
      return
    }

    setUploadedImages(newImages)

    const newImg = newImages[0]
    const oldImg = uploadedImages[0]

    // If it's a new image (previously empty) or a URL change (upload finished)
    // We only proceed if status is 'done' or if it's a blob url (initial preview) but we prefer waiting for 'done' if we want to be strict.
    // However, existing logic allowed blob preview. The user requirement says "when upload done AND img loaded -> loading false".
    // So we should keep loading true if it is 'done' but image hasn't loaded yet.

    if (!oldImg || newImg.url !== oldImg.url) {
      setImageLoading(true)
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        setImage(img)

        // Only reset annotations if it was a fresh upload
        // We check if we already have a valid rect/pointer to decide if we need to auto-init
        // But simpler to just check if it's a different image source effectively
        if (!oldImg || newImg.url !== oldImg.url) {
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
          setScaleValueError('')
        }
        setImageLoading(false)
      }

      img.onerror = () => {
        message.error('Image upload failed, please try again')
        resetState()
      }

      img.src = newImg.url
    }
  }

  // Helper to convert base64 to file
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

  // Submit
  const handleSubmit = async () => {
    if (!image || !rect || !rect.center || !pointer) {
      message.error('Please complete all steps before submitting')
      return
    }

    if (!trimmedScaleValue) {
      setScaleValueError('Please enter a scale value')
      message.error('Please enter a scale value')
      return
    }
    setSubmitting(true)
    try {
      const annotatedImageBase64 = annotationCanvasRef.current?.getAnnotatedImage()
      if (!annotatedImageBase64) throw new Error('Failed to get annotated image')

      // Upload annotated image
      const annotatedFile = dataURLtoFile(annotatedImageBase64, 'annotated_knob.jpg')
      const annotatedFileHash = await calculateFileHash(annotatedFile)
      const uploadRes = await commonApi.uploadFile(annotatedFile)
      if (!uploadRes || !uploadRes.file_path) {
        throw new Error('Failed to upload annotated image')
      }

      const annotatedImageUrl = uploadRes.file_path

      // Use the uploaded image URL as the original image
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
        templateId: templateId,
        taskId: taskId
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

      setModalShow(true)
    } catch (error: unknown) {
      console.error(error)
      message.error((error as Error).message || 'Failed to submit!')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePointerChange = (newPointer: Point | null) => {
    setPointer(newPointer)
    if (newPointer) {
      setPointerModified(true)
    } else {
      setScaleValue('')
      setScaleValueError('')
    }
  }

  const handleRectChange = (newRect: Rect | null) => {
    setRect(newRect)
    if (newRect) {
      setRectModified(true)
    } else {
      setPointer(null)
      setScaleValue('')
      setScaleValueError('')
    }
  }

  // Debounce scale value trimming
  const [trimmedScaleValue, setTrimmedScaleValue] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = scaleValue.trim()
      setTrimmedScaleValue(trimmed)
      if (trimmed) {
        setScaleValueError('')
      }
    }, 300)
    return () => {
      clearTimeout(handler)
    }
  }, [scaleValue])

  const handleScaleValueChange = (val: string) => {
    setScaleValue(val)
  }

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  const onBack = () => {
    window.history.back()
  }

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen py-3 md:py-8">
          {/* Header */}
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} /> Back
              </div>
              Knob Image Data Collection & Annotation
              <span></span>
            </h1>
          </div>

          <div className="mt-12 bg-[#FFFFFF0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <Guideline />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
            {/* Upload Section */}
            <ImageUploader value={uploadedImages} onChange={handleUploadChange} onShowModal={showImageModal} />

            {/* Annotation Section */}
            <AnnotationCanvas
              ref={annotationCanvasRef}
              image={image}
              rect={rect}
              pointer={pointer}
              rectModified={rectModified}
              pointerModified={pointerModified}
              exampleImage="https://static.codatta.io/static/images/knob_label_1766728031053.png"
              loading={imageLoading}
              onRectChange={handleRectChange}
              onPointerChange={handlePointerChange}
              onShowModal={showImageModal}
            />

            {/* Scale Value Section */}
            <ScaleInput
              pointer={pointer}
              scaleValue={scaleValue}
              error={scaleValueError}
              onChange={handleScaleValueChange}
            />
          </div>

          <div className="mt-12 bg-[#D92B2B0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <ExpertRedline />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-center pb-20">
            <Button
              disabled={!image || !rectModified || !pointerModified || !trimmedScaleValue}
              onClick={handleSubmit}
              loading={submitting}
              className={`h-[44px] w-full rounded-full text-base font-bold ${
                !image || !rectModified || !pointerModified || !trimmedScaleValue ? 'opacity-50' : ''
              } md:mx-auto md:w-[240px]`}
              text="Submit"
            />
          </div>

          {/* Image Modal */}
          <Modal
            open={imageModalVisible}
            footer={null}
            onCancel={() => setImageModalVisible(false)}
            width="90%"
            centered
            styles={{
              content: { backgroundColor: 'transparent', boxShadow: 'none' },
              body: { padding: 0, display: 'flex', justifyContent: 'center' }
            }}
            closeIcon={
              <span className="flex size-10 items-center justify-center rounded-full bg-[#8b5cf64d] text-2xl text-white hover:bg-[#8b5cf699]">
                ×
              </span>
            }
          >
            <img src={modalImageSrc} alt="Preview" className="max-h-[90vh] max-w-full rounded-xl" />
          </Modal>

          <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default AirdropKnob
