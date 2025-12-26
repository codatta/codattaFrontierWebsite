import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { message, Spin, Modal } from 'antd'
import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import frontiterApi from '@/apis/frontiter.api'
import Guideline from '@/components/frontier/airdrop/knob/guideline'
import ImageUploader from '@/components/frontier/airdrop/knob/image-uploader'
import AnnotationCanvas, { AnnotationCanvasRef } from '@/components/frontier/airdrop/knob/annotation-canvas'
import ScaleInput from '@/components/frontier/airdrop/knob/scale-input'
import { Point, Rect, KnobFormData } from '@/components/frontier/airdrop/knob/types'
import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

const AirdropKnob: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // State
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [scaleValue, setScaleValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

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
      const totalRewards = taskDetail.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)

      setRewardPoints(totalRewards)
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

  // Handle Upload Change
  const handleUploadChange = (newImages: UploadedImage[]) => {
    const oldImages = uploadedImages
    setUploadedImages(newImages)

    if (newImages.length === 0) {
      // Image deleted
      setImage(null)
      setRect(null)
      setPointer(null)
      setScaleValue('')
      return
    }

    const newImg = newImages[0]
    const oldImg = oldImages[0]

    // If it's a new image (previously empty) or a URL change (upload finished)
    if (!oldImg || newImg.url !== oldImg.url) {
      const img = new Image()
      img.onload = () => {
        setImage(img)

        // Only reset annotations if it was a fresh upload
        if (!oldImg) {
          setRect(null)
          setPointer(null)
          setScaleValue('')
        }
      }
      img.src = newImg.url
    }
  }

  // Submit
  const handleSubmit = async () => {
    if (!image || !rect || !rect.center || !pointer || !scaleValue.trim()) {
      message.error('Please complete all steps before submitting')
      return
    }

    setLoading(true)
    try {
      const annotatedImage = annotationCanvasRef.current?.getAnnotatedImage()
      if (!annotatedImage) throw new Error('Failed to get annotated image')

      // Use the uploaded image URL as the original image
      // Ideally this should be the remote URL if upload is done
      const originalImage = uploadedImages[0]?.url || annotatedImage

      const submissionData: KnobFormData = {
        originalImage,
        annotatedImage,
        rectCoordinates: {
          x1: Math.round(rect.x1),
          y1: Math.round(rect.y1),
          x2: Math.round(rect.x2),
          y2: Math.round(rect.y2),
          x3: Math.round(rect.x3),
          y3: Math.round(rect.y3),
          x4: Math.round(rect.x4),
          y4: Math.round(rect.y4)
        },
        centerCoordinates: {
          x: Math.round(rect.center.x!),
          y: Math.round(rect.center.y!)
        },
        pointerCoordinates: {
          x: Math.round(pointer.x),
          y: Math.round(pointer.y)
        },
        scaleValue
      }

      await frontiterApi.submitTask(taskId!, {
        data: submissionData,
        templateId: templateId,
        taskId: taskId
      })

      setModalShow(true)
    } catch (error: unknown) {
      message.error((error as Error).message || 'Failed to submit!')
    } finally {
      setLoading(false)
    }
  }

  const handlePointerChange = (newPointer: Point | null) => {
    setPointer(newPointer)
    if (newPointer === null) {
      setScaleValue('')
    }
  }

  const handleRectChange = (newRect: Rect | null) => {
    setRect(newRect)
    if (!newRect) {
      setPointer(null)
      setScaleValue('')
    }
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
              exampleImage="https://static.codatta.io/static/images/knob_label_1766728031053.png"
              onRectChange={handleRectChange}
              onPointerChange={handlePointerChange}
              onShowModal={showImageModal}
            />

            {/* Scale Value Section */}
            <ScaleInput pointer={pointer} scaleValue={scaleValue} onChange={setScaleValue} />
          </div>
          {/* 
          <div className="mt-12 bg-[#D92B2B0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <ExpertRedline />
            </div>
          </div> */}

          {/* Submit Button */}
          <div className="mt-12 flex justify-center pb-20">
            <Button
              disabled={!image || !rect || !pointer || !scaleValue}
              onClick={handleSubmit}
              loading={loading}
              className={`h-[44px] w-full rounded-full text-base font-bold ${
                !image || !rect || !pointer || !scaleValue ? 'opacity-50' : ''
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
