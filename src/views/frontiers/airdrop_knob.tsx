import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { message, Spin, Modal } from 'antd'
import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import frontiterApi from '@/apis/frontiter.api'
import Guideline from '@/components/frontier/airdrop/knob/guideline'
import TaskSteps from '@/components/frontier/airdrop/knob/task-steps'
import ImageUploader from '@/components/frontier/airdrop/knob/image-uploader'
import AnnotationCanvas, { AnnotationCanvasRef } from '@/components/frontier/airdrop/knob/annotation-canvas'
import ScaleInput from '@/components/frontier/airdrop/knob/scale-input'
import { Point, Rect, KnobFormData } from '@/components/frontier/airdrop/knob/types'
import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

const AirdropKnob: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // State
  const [currentStep, setCurrentStep] = useState(1)
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
      setCurrentStep(1)
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
          setCurrentStep(2)
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
      if (rect) setCurrentStep(3)
    } else {
      setCurrentStep(4)
    }
  }

  const handleRectChange = (newRect: Rect | null) => {
    setRect(newRect)
    if (newRect) {
      setCurrentStep(3)
    } else {
      setPointer(null)
      setScaleValue('')
      setCurrentStep(2)
    }
  }

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen bg-[#0a0a0a] py-6 font-inter text-white">
          {/* Header */}
          <div className="mb-8 border-b border-[#FFFFFF1F] pb-4">
            <div className="mx-auto max-w-[1380px] px-6">
              <div
                className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-400"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={16} /> Back
              </div>
              <h1 className="bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-center text-2xl font-bold text-transparent">
                Knob Annotation Task
              </h1>
              <p className="mt-1 text-center text-sm text-[#a0a0a0]">
                Please follow the steps to complete the collection and annotation of knob images
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1380px] px-6">
            <Guideline />

            <div className="mt-8 grid grid-cols-1 items-start gap-5 xl:grid-cols-[360px_1fr]">
              {/* Left Panel */}
              <TaskSteps currentStep={currentStep} rect={rect} pointer={pointer} />

              {/* Right Panel */}
              <div className="flex flex-col gap-5">
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
            </div>

            {/* Submit Bar */}
            <div className="mt-8 flex justify-center border-t border-[#1f2937e6] pb-20 pt-6">
              <Button
                disabled={!image || !rect || !pointer || !scaleValue}
                onClick={handleSubmit}
                loading={loading}
                className={`rounded-xl px-8 py-3.5 font-bold text-white shadow-app-btn transition-all ${
                  !image || !rect || !pointer || !scaleValue
                    ? 'cursor-not-allowed bg-gray-600 opacity-50'
                    : 'bg-gradient-to-br from-[#8b5cf6] to-[#667eea] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(139,92,246,0.5)]'
                }`}
                text="Submit Task"
              />
            </div>
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
