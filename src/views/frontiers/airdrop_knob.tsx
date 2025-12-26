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
import AnnotationCanvas from '@/components/frontier/airdrop/knob/annotation-canvas'
import ScaleInput from '@/components/frontier/airdrop/knob/scale-input'
import { Point, Rect, KnobFormData } from '@/components/frontier/airdrop/knob/types'

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
  const [previewImage, setPreviewImage] = useState<string>('')
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  // Canvas interaction state (refs for performance and mutable access in events)
  const interactionState = useRef({
    isDrawingRect: false,
    rectStart: null as Point | null,
    justFinishedDrawing: false,
    isDraggingRect: false,
    isResizingRect: false,
    isDraggingPointer: false,
    dragStart: null as Point | null,
    resizeHandle: null as string | null,
    rectOffset: null as Point | null,
    canvasDisplayWidth: 0,
    canvasDisplayHeight: 0
  })

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Canvas Logic
  const setupCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !img) return

    const containerHeight = 400
    let containerWidth = container.clientWidth || 800
    if (containerWidth === 0) containerWidth = Math.min(img.width, 800)

    const imgRatio = img.width / img.height
    const containerRatio = containerWidth / containerHeight

    let displayWidth, displayHeight

    if (imgRatio > containerRatio) {
      displayWidth = containerWidth
      displayHeight = containerWidth / imgRatio
    } else {
      displayHeight = containerHeight
      displayWidth = containerHeight * imgRatio
    }

    displayWidth = Math.max(Math.min(displayWidth, containerWidth), 1)
    displayHeight = Math.max(Math.min(displayHeight, containerHeight), 1)

    const dpr = window.devicePixelRatio || 1

    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight)
    }

    interactionState.current.canvasDisplayWidth = displayWidth
    interactionState.current.canvasDisplayHeight = displayHeight
  }, [])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { canvasDisplayWidth, canvasDisplayHeight } = interactionState.current

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Image
    ctx.drawImage(image, 0, 0, canvasDisplayWidth, canvasDisplayHeight)

    // Draw Rect
    if (rect) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1)

      // Center
      if (rect.center) {
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(rect.center.x, rect.center.y, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Resize handles (only if not drawing/dragging)
      const { isDrawingRect, isDraggingRect, isResizingRect } = interactionState.current
      if (!isDrawingRect && !isDraggingRect && !isResizingRect) {
        const handles = [
          { x: rect.x1, y: rect.y1 },
          { x: rect.x2, y: rect.y1 },
          { x: rect.x1, y: rect.y2 },
          { x: rect.x2, y: rect.y2 }
        ]
        ctx.fillStyle = '#ef4444'
        handles.forEach((h) => {
          ctx.beginPath()
          ctx.arc(h.x, h.y, 4, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    }

    // Draw Pointer
    if (pointer) {
      ctx.fillStyle = '#a16207'
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [image, rect, pointer])

  // Re-draw when state changes
  useEffect(() => {
    if (image) {
      redrawCanvas()
    }
  }, [image, rect, pointer, redrawCanvas])

  // Handle Image Upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        if (typeof e.target?.result === 'string') {
          setPreviewImage(e.target.result)
        }

        // Reset state
        setRect(null)
        setPointer(null)
        setScaleValue('')
        setCurrentStep(2)

        // Setup canvas
        setTimeout(() => {
          setupCanvas(img)
          // Trigger a redraw after setup
          requestAnimationFrame(() => redrawCanvas())
        }, 0)
      }
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFile(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFile(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFile(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        handleImageUpload(file)
      } else {
        message.error('Please upload an image file')
      }
    }
  }

  const clearImage = () => {
    Modal.confirm({
      title: 'Clear Image',
      content: 'Are you sure you want to delete the current image and re-upload? All annotations will be cleared.',
      onOk: () => {
        setImage(null)
        setPreviewImage('')
        setRect(null)
        setPointer(null)
        setScaleValue('')
        setCurrentStep(1)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  // Helpers
  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const isPointInRect = (x: number, y: number, r: Rect) => {
    return x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2
  }

  const isPointNearPoint = (x1: number, y1: number, x2: number, y2: number, threshold = 10) => {
    return Math.abs(x1 - x2) < threshold && Math.abs(y1 - y2) < threshold
  }

  const getResizeHandle = (x: number, y: number, r: Rect) => {
    const threshold = 10
    const handles = [
      { name: 'nw', x: r.x1, y: r.y1 },
      { name: 'ne', x: r.x2, y: r.y1 },
      { name: 'sw', x: r.x1, y: r.y2 },
      { name: 'se', x: r.x2, y: r.y2 },
      { name: 'n', x: (r.x1 + r.x2) / 2, y: r.y1 },
      { name: 's', x: (r.x1 + r.x2) / 2, y: r.y2 },
      { name: 'w', x: r.x1, y: (r.y1 + r.y2) / 2 },
      { name: 'e', x: r.x2, y: (r.y1 + r.y2) / 2 }
    ]

    for (const h of handles) {
      if (isPointNearPoint(x, y, h.x, h.y, threshold)) return h.name
    }
    return null
  }

  // Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return
    const { x, y } = getCanvasCoordinates(e)
    const state = interactionState.current

    // Check existing rect interaction
    if (rect) {
      const handle = getResizeHandle(x, y, rect)
      if (handle) {
        state.isResizingRect = true
        state.resizeHandle = handle
        state.rectStart = { x: rect.x1, y: rect.y1 }
        e.preventDefault()
        return
      } else if (isPointInRect(x, y, rect)) {
        state.isDraggingRect = true
        state.rectOffset = { x: x - rect.x1, y: y - rect.y1 }
        e.preventDefault()
        return
      }
    }

    // Check pointer interaction
    if (pointer) {
      if (isPointNearPoint(x, y, pointer.x, pointer.y, 10)) {
        state.isDraggingPointer = true
        e.preventDefault()
        return
      }
    }

    // New Rect
    if (currentStep === 2 || (currentStep > 2 && !rect)) {
      state.isDrawingRect = true
      state.rectStart = { x, y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e)
    const state = interactionState.current
    const canvas = canvasRef.current
    if (!canvas) return

    // Resizing
    if (state.isResizingRect && rect) {
      const newRect = { ...rect }

      switch (state.resizeHandle) {
        case 'nw':
          newRect.x1 = x
          newRect.y1 = y
          break
        case 'ne':
          newRect.x2 = x
          newRect.y1 = y
          break
        case 'sw':
          newRect.x1 = x
          newRect.y2 = y
          break
        case 'se':
          newRect.x2 = x
          newRect.y2 = y
          break
        case 'n':
          newRect.y1 = y
          break
        case 's':
          newRect.y2 = y
          break
        case 'w':
          newRect.x1 = x
          break
        case 'e':
          newRect.x2 = x
          break
      }

      // Normalize
      const normRect = { ...newRect }
      if (normRect.x1 > normRect.x2) [normRect.x1, normRect.x2] = [normRect.x2, normRect.x1]
      if (normRect.y1 > normRect.y2) [normRect.y1, normRect.y2] = [normRect.y2, normRect.y1]

      normRect.x3 = normRect.x2
      normRect.y3 = normRect.y1
      normRect.x4 = normRect.x1
      normRect.y4 = normRect.y2

      // Calculate Center
      normRect.center = {
        x: (normRect.x1 + normRect.x2) / 2,
        y: (normRect.y1 + normRect.y2) / 2
      }

      setRect(normRect)
      return
    }

    // Dragging Rect
    if (state.isDraggingRect && rect && state.rectOffset) {
      const width = rect.x2 - rect.x1
      const height = rect.y2 - rect.y1
      const newX1 = x - state.rectOffset.x
      const newY1 = y - state.rectOffset.y

      const newRect = {
        x1: newX1,
        y1: newY1,
        x2: newX1 + width,
        y2: newY1 + height,
        x3: newX1 + width,
        y3: newY1,
        x4: newX1,
        y4: newY1 + height,
        center: {
          x: newX1 + width / 2,
          y: newY1 + height / 2
        }
      }
      setRect(newRect)
      return
    }

    // Dragging Pointer
    if (state.isDraggingPointer && pointer) {
      setPointer({ x, y })
      return
    }

    // Drawing Rect
    if (state.isDrawingRect && state.rectStart) {
      redrawCanvas()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(state.rectStart.x, state.rectStart.y, x - state.rectStart.x, y - state.rectStart.y)
        ctx.setLineDash([])
      }
      return
    }

    // Cursor updates
    let cursor = 'default'
    if (rect) {
      const handle = getResizeHandle(x, y, rect)
      if (handle) {
        const cursors: Record<string, string> = {
          nw: 'nw-resize',
          ne: 'ne-resize',
          sw: 'sw-resize',
          se: 'se-resize',
          n: 'n-resize',
          s: 's-resize',
          w: 'w-resize',
          e: 'e-resize'
        }
        cursor = cursors[handle]
      } else if (isPointInRect(x, y, rect)) {
        cursor = 'move'
      }
    }
    if (pointer && isPointNearPoint(x, y, pointer.x, pointer.y, 10)) {
      cursor = 'move'
    }
    if (cursor === 'default') {
      if (currentStep === 2 || (currentStep > 2 && !rect)) cursor = 'crosshair'
      else if (currentStep === 3 || (currentStep > 3 && !pointer)) cursor = 'pointer'
    }
    canvas.style.cursor = cursor
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const state = interactionState.current

    if (state.isResizingRect || state.isDraggingRect || state.isDraggingPointer) {
      state.isResizingRect = false
      state.isDraggingRect = false
      state.isDraggingPointer = false
      state.resizeHandle = null
      state.rectOffset = null
      e.preventDefault()
      return
    }

    if (state.isDrawingRect && state.rectStart) {
      const { x, y } = getCanvasCoordinates(e)
      const x1 = Math.min(state.rectStart.x, x)
      const y1 = Math.min(state.rectStart.y, y)
      const x2 = Math.max(state.rectStart.x, x)
      const y2 = Math.max(state.rectStart.y, y)

      if (Math.abs(x2 - x1) > 10 && Math.abs(y2 - y1) > 10) {
        setRect({
          x1,
          y1,
          x2,
          y2,
          x3: x2,
          y3: y1,
          x4: x1,
          y4: y2,
          center: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
        })
        if (currentStep === 2) setCurrentStep(3)
      }
      state.isDrawingRect = false
      state.rectStart = null
      state.justFinishedDrawing = true
      setTimeout(() => {
        state.justFinishedDrawing = false
      }, 200)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const state = interactionState.current
    if (currentStep !== 3) return
    if (state.justFinishedDrawing || state.isDrawingRect) return

    const { x, y } = getCanvasCoordinates(e)
    setPointer({ x, y })
    setCurrentStep(4)
  }

  // Submit
  const handleSubmit = async () => {
    if (!image || !rect || !rect.center || !pointer || !scaleValue.trim()) {
      message.error('Please complete all steps before submitting')
      return
    }

    setLoading(true)
    try {
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not found')

      // We need to redraw to ensure clean state or annotated state
      redrawCanvas()
      const annotatedImage = canvas.toDataURL('image/png')
      const originalImage = annotatedImage

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

  const handleClearRect = () => {
    setRect(null)
    setCurrentStep(2)
  }

  const handleClearPointer = () => {
    setPointer(null)
    setScaleValue('')
    setCurrentStep(3)
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
                <ImageUploader
                  previewImage={previewImage}
                  isDraggingFile={isDraggingFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onUpload={handleImageUpload}
                  onClear={clearImage}
                  onShowModal={showImageModal}
                />

                {/* Annotation Section */}
                <AnnotationCanvas
                  image={image}
                  rect={rect}
                  pointer={pointer}
                  containerRef={containerRef}
                  canvasRef={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleClick}
                  onClearRect={handleClearRect}
                  onClearPointer={handleClearPointer}
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

          {/* <div className="mt-12 bg-[#D92B2B0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <ExpertRedline />
            </div>
          </div> */}
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
      </Spin>
    </AuthChecker>
  )
}

export default AirdropKnob
