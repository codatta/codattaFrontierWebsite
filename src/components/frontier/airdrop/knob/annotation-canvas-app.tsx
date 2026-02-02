import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Line, Rect as KonvaRect, Circle } from 'react-konva'
import Konva from 'konva'
// import { useAppToast } from '@/hooks/use-app-toast'
import { Rect, Point } from './types'

export interface KnobAnnotationCanvasRef {
  getAnnotatedImage: () => string
  resetStepStates: () => void
}

interface KnobAnnotationCanvasProps {
  image: HTMLImageElement
  rect: Rect | null
  pointer: Point | null
  rectModified: boolean
  pointerModified: boolean
  onRectChange: (rect: Rect | null) => void
  onPointerChange: (pointer: Point | null) => void
  onConfirm: () => void
}

const KnobAnnotationCanvas = forwardRef<KnobAnnotationCanvasRef, KnobAnnotationCanvasProps>(
  ({ image, rect, pointer, rectModified, pointerModified, onRectChange, onPointerChange, onConfirm }, ref) => {
    // const toast = useAppToast()
    const containerRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<Konva.Stage>(null)
    const isCenterManuallyAdjustedRef = useRef(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 })
    const [isDraggingRect, setIsDraggingRect] = useState(false)
    const [isDraggingCorner, setIsDraggingCorner] = useState<number | null>(null)
    const [lastPos, setLastPos] = useState<Point | null>(null)
    const [rectAdjusted, setRectAdjusted] = useState(false)
    const [pointerAdjusted, setPointerAdjusted] = useState(false)
    const [centerAdjusted, setCenterAdjusted] = useState(false)
    const lastRectChangeTimeRef = useRef<number>(0)
    const lastPointerChangeTimeRef = useRef<number>(0)

    const MIN_SIZE = 40

    // Reset internal state when rect/pointer are reset from parent
    useEffect(() => {
      // If rect exists but center hasn't been manually adjusted, reset the flag
      // This handles the case when parent resets state (e.g., after deleting annotated image)
      if (rect && rect.center) {
        const geometricCenter = {
          x: (rect.x1 + rect.x2 + rect.x3 + rect.x4) / 4,
          y: (rect.y1 + rect.y2 + rect.y3 + rect.y4) / 4
        }
        // If center is at geometric center (within 1px tolerance), reset the flag
        const isAtGeometricCenter =
          Math.abs(rect.center.x - geometricCenter.x) < 1 && Math.abs(rect.center.y - geometricCenter.y) < 1

        if (isAtGeometricCenter) {
          isCenterManuallyAdjustedRef.current = false
          setCenterAdjusted(false)
        }
      } else if (!rect) {
        // Reset flag when rect is cleared
        isCenterManuallyAdjustedRef.current = false
        setRectAdjusted(false)
        setPointerAdjusted(false)
        setCenterAdjusted(false)
      }
    }, [rect])

    // Detect when user has finished adjusting rect (1 second of no changes)
    useEffect(() => {
      if (!rect || rectAdjusted) return

      const checkTimer = setInterval(() => {
        const now = Date.now()
        if (lastRectChangeTimeRef.current > 0 && now - lastRectChangeTimeRef.current > 1000) {
          setRectAdjusted(true)
        }
      }, 500)

      return () => clearInterval(checkTimer)
    }, [rect, rectAdjusted])

    // Detect when user has finished adjusting pointer (1 second of no changes)
    useEffect(() => {
      if (!pointer || pointerAdjusted) return

      const checkTimer = setInterval(() => {
        const now = Date.now()
        if (lastPointerChangeTimeRef.current > 0 && now - lastPointerChangeTimeRef.current > 1000) {
          setPointerAdjusted(true)
        }
      }, 500)

      return () => clearInterval(checkTimer)
    }, [pointer, pointerAdjusted])

    useEffect(() => {
      const updateDimensions = () => {
        if (!containerRef.current || !image) return

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

        // Reserve space for header (100px) and guide section below canvas (estimated 180px)
        const reservedHeight = 100 + 180
        const availableHeight = screenHeight - reservedHeight

        const imgRatio = image.naturalWidth / image.naturalHeight

        let drawWidth, drawHeight, scale

        // Try to fill width first
        drawWidth = screenWidth
        drawHeight = screenWidth / imgRatio
        scale = screenWidth / image.naturalWidth

        // If height exceeds available space, scale down to fit height
        if (drawHeight > availableHeight) {
          drawHeight = availableHeight
          drawWidth = availableHeight * imgRatio
          scale = availableHeight / image.naturalHeight
        }

        setDimensions({ width: drawWidth, height: drawHeight, scale })
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }, [image])

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const target = e.target
      const stage = e.target.getStage()
      const point = stage?.getPointerPosition()
      if (!point) return

      const scaledPoint = { x: point.x / dimensions.scale, y: point.y / dimensions.scale }

      if (target.name() === 'corner') {
        const cornerIndex = parseInt(target.id())
        setIsDraggingCorner(cornerIndex)
        return
      }

      if (target.name() === 'rect-shape') {
        setIsDraggingRect(true)
        setLastPos(scaledPoint)
        return
      }

      if (target.name() === 'center-dot') {
        return
      }

      if (target.name() === 'pointer-dot') {
        return
      }

      if (rect && !pointer) {
        onPointerChange(scaledPoint)
      }
    }

    const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage()
      const point = stage?.getPointerPosition()
      if (!point || !rect) return

      const currentPos = { x: point.x / dimensions.scale, y: point.y / dimensions.scale }

      if (isDraggingRect && lastPos) {
        const dx = currentPos.x - lastPos.x
        const dy = currentPos.y - lastPos.y

        const w = image.naturalWidth
        const h = image.naturalHeight

        const minX = Math.min(rect.x1, rect.x2, rect.x3, rect.x4)
        const maxX = Math.max(rect.x1, rect.x2, rect.x3, rect.x4)
        const minY = Math.min(rect.y1, rect.y2, rect.y3, rect.y4)
        const maxY = Math.max(rect.y1, rect.y2, rect.y3, rect.y4)

        let safeDx = dx
        let safeDy = dy

        if (minX + safeDx < 0) safeDx = -minX
        if (maxX + safeDx > w) safeDx = w - maxX
        if (minY + safeDy < 0) safeDy = -minY
        if (maxY + safeDy > h) safeDy = h - maxY

        if (safeDx !== 0 || safeDy !== 0) {
          const newRect = {
            x1: rect.x1 + safeDx,
            y1: rect.y1 + safeDy,
            x2: rect.x2 + safeDx,
            y2: rect.y2 + safeDy,
            x3: rect.x3 + safeDx,
            y3: rect.y3 + safeDy,
            x4: rect.x4 + safeDx,
            y4: rect.y4 + safeDy,
            center: isCenterManuallyAdjustedRef.current
              ? rect.center
              : rect.center
                ? {
                    x: rect.center.x + safeDx,
                    y: rect.center.y + safeDy
                  }
                : {
                    x: (rect.x1 + rect.x2 + rect.x3 + rect.x4) / 4 + safeDx,
                    y: (rect.y1 + rect.y2 + rect.y3 + rect.y4) / 4 + safeDy
                  }
          }
          onRectChange(newRect)
          lastRectChangeTimeRef.current = Date.now()
          setLastPos({ x: lastPos.x + safeDx, y: lastPos.y + safeDy })
        }
        return
      }

      if (isDraggingCorner !== null) {
        handleCornerDrag(isDraggingCorner, currentPos)
      }
    }

    const handleStageMouseUp = () => {
      setIsDraggingRect(false)
      setIsDraggingCorner(null)
      setLastPos(null)
    }

    const handleCornerDrag = (cornerIndex: number, pos: Point) => {
      if (!rect) return

      let { x, y } = pos
      const newRect = { ...rect }

      switch (cornerIndex) {
        case 1:
          x = Math.min(x, rect.x2 - MIN_SIZE)
          y = Math.min(y, rect.y4 - MIN_SIZE)
          newRect.x1 = x
          newRect.y1 = y
          newRect.x4 = x
          newRect.y2 = y
          break
        case 2:
          x = Math.max(x, rect.x1 + MIN_SIZE)
          y = Math.min(y, rect.y3 - MIN_SIZE)
          newRect.x2 = x
          newRect.y2 = y
          newRect.x3 = x
          newRect.y1 = y
          break
        case 3:
          x = Math.max(x, rect.x4 + MIN_SIZE)
          y = Math.max(y, rect.y2 + MIN_SIZE)
          newRect.x3 = x
          newRect.y3 = y
          newRect.x2 = x
          newRect.y4 = y
          break
        case 4:
          x = Math.min(x, rect.x3 - MIN_SIZE)
          y = Math.max(y, rect.y1 + MIN_SIZE)
          newRect.x4 = x
          newRect.y4 = y
          newRect.x1 = x
          newRect.y3 = y
          break
      }

      // If center has been manually adjusted, keep its absolute position
      // Otherwise, recalculate it as the geometric center
      console.log('handleCornerDrag - isCenterManuallyAdjusted:', isCenterManuallyAdjustedRef.current)
      if (!isCenterManuallyAdjustedRef.current) {
        newRect.center = {
          x: (newRect.x1 + newRect.x2 + newRect.x3 + newRect.x4) / 4,
          y: (newRect.y1 + newRect.y2 + newRect.y3 + newRect.y4) / 4
        }
        console.log('Recalculating center to geometric center:', newRect.center)
      } else {
        // Keep the existing center position unchanged
        newRect.center = rect.center
        console.log('Keeping existing center position:', newRect.center)
      }

      onRectChange(newRect)
      lastRectChangeTimeRef.current = Date.now()
    }

    const handleCenterDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!rect) return
      const pos = e.target.position()

      const newRect = {
        ...rect,
        center: { x: pos.x, y: pos.y }
      }
      onRectChange(newRect)
      setCenterAdjusted(true)
    }

    const handlePointerDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
      const pos = e.target.position()
      onPointerChange({ x: pos.x, y: pos.y })
      lastPointerChangeTimeRef.current = Date.now()
    }

    useImperativeHandle(ref, () => ({
      getAnnotatedImage: () => {
        if (!image) return ''
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return ''

        ctx.drawImage(image, 0, 0)

        // Scale factor for annotations (make them more visible)
        const scaleFactor = Math.min(image.naturalWidth, image.naturalHeight) / 500

        if (rect) {
          // Draw rectangle with shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
          ctx.shadowBlur = 4 * scaleFactor
          ctx.shadowOffsetY = 2 * scaleFactor
          ctx.strokeStyle = '#40E1EF'
          ctx.lineWidth = 6 * scaleFactor
          ctx.beginPath()
          ctx.moveTo(rect.x1, rect.y1)
          ctx.lineTo(rect.x2, rect.y2)
          ctx.lineTo(rect.x3, rect.y3)
          ctx.lineTo(rect.x4, rect.y4)
          ctx.closePath()
          ctx.stroke()

          // Draw corner squares with shadow
          ctx.fillStyle = '#40E1EF'
          const cornerSize = 16 * scaleFactor
          const corners = [
            { x: rect.x1, y: rect.y1 },
            { x: rect.x2, y: rect.y2 },
            { x: rect.x3, y: rect.y3 },
            { x: rect.x4, y: rect.y4 }
          ]
          corners.forEach((corner) => {
            ctx.fillRect(corner.x - cornerSize / 2, corner.y - cornerSize / 2, cornerSize, cornerSize)
          })

          // Draw center dot with shadow
          if (rect.center) {
            ctx.fillStyle = '#FF0000'
            ctx.beginPath()
            ctx.arc(rect.center.x, rect.center.y, 10 * scaleFactor, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        if (pointer) {
          // Draw pointer dot with shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
          ctx.shadowBlur = 4 * scaleFactor
          ctx.shadowOffsetY = 2 * scaleFactor
          ctx.fillStyle = '#FFFF00'
          ctx.beginPath()
          ctx.arc(pointer.x, pointer.y, 10 * scaleFactor, 0, Math.PI * 2)
          ctx.fill()
        }

        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        return canvas.toDataURL('image/jpeg', 0.9)
      },
      resetStepStates: () => {
        setRectAdjusted(false)
        setPointerAdjusted(false)
        setCenterAdjusted(false)
        isCenterManuallyAdjustedRef.current = false
        lastRectChangeTimeRef.current = 0
        lastPointerChangeTimeRef.current = 0
      }
    }))

    const handleConfirm = () => {
      console.log('rectModified', rectModified)
      console.log('pointerModified', pointerModified)
      // if (!rectModified) {
      //   toast.show('Please drag the cyan corners to cover the knob', 2000)
      //   return
      // }
      // if (!pointerModified) {
      //   toast.show('Please drag the yellow dot to the pointer tip', 2000)
      //   return
      // }
      onConfirm()
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        {/* Header */}
        <div className="flex h-[100px] items-center justify-between px-5 pt-12">
          <div className="size-11"></div>
          <h1 className="text-lg font-semibold text-white">Image Annotation</h1>
          <ConfirmIcon onClick={handleConfirm} />
        </div>

        {/* Canvas Area */}
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <div ref={containerRef} className="flex items-center justify-center bg-black">
            <Stage
              ref={stageRef}
              width={dimensions.width}
              height={dimensions.height}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
              onMouseLeave={handleStageMouseUp}
              onTouchStart={handleStageMouseDown}
              onTouchMove={handleStageMouseMove}
              onTouchEnd={handleStageMouseUp}
            >
              <Layer scaleX={dimensions.scale} scaleY={dimensions.scale}>
                <KonvaImage image={image} />

                {rect && (
                  <>
                    <Line
                      points={[rect.x1, rect.y1, rect.x2, rect.y2, rect.x3, rect.y3, rect.x4, rect.y4]}
                      closed
                      stroke="#40E1EF"
                      strokeWidth={2 / dimensions.scale}
                      name="rect-shape"
                      shadowColor="rgba(0, 0, 0, 0.25)"
                      shadowBlur={1 / dimensions.scale}
                      shadowOffsetY={1 / dimensions.scale}
                    />

                    {[
                      { x: rect.x1, y: rect.y1, i: 1 },
                      { x: rect.x2, y: rect.y2, i: 2 },
                      { x: rect.x3, y: rect.y3, i: 3 },
                      { x: rect.x4, y: rect.y4, i: 4 }
                    ].map((corner) => (
                      <KonvaRect
                        key={corner.i}
                        id={corner.i.toString()}
                        x={corner.x - 6 / dimensions.scale}
                        y={corner.y - 6 / dimensions.scale}
                        width={12 / dimensions.scale}
                        height={12 / dimensions.scale}
                        fill="#40E1EF"
                        name="corner"
                        shadowColor="rgba(0, 0, 0, 0.25)"
                        shadowBlur={1 / dimensions.scale}
                        shadowOffsetY={1 / dimensions.scale}
                      />
                    ))}

                    {rect.center && (
                      <Circle
                        x={rect.center.x}
                        y={rect.center.y}
                        radius={6 / dimensions.scale}
                        fill="#FF0000"
                        draggable
                        name="center-dot"
                        onDragStart={() => {
                          console.log('Center drag started - setting flag to true')
                          isCenterManuallyAdjustedRef.current = true
                        }}
                        onDragMove={handleCenterDrag}
                        shadowColor="rgba(0, 0, 0, 0.25)"
                        shadowBlur={1 / dimensions.scale}
                        shadowOffsetY={1 / dimensions.scale}
                        hitStrokeWidth={12 / dimensions.scale}
                      />
                    )}
                  </>
                )}

                {pointer && (
                  <Circle
                    x={pointer.x}
                    y={pointer.y}
                    radius={6 / dimensions.scale}
                    fill="#FFFF00"
                    draggable
                    name="pointer-dot"
                    onDragMove={handlePointerDrag}
                    shadowColor="rgba(0, 0, 0, 0.25)"
                    shadowBlur={1 / dimensions.scale}
                    shadowOffsetY={1 / dimensions.scale}
                    hitStrokeWidth={12 / dimensions.scale}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Guide Section - Below canvas */}
        <div className="hidden px-5 pb-10 pt-4 text-sm">
          <div className="space-y-3">
            {/* Step 1: Drag cyan rectangle corners to cover knob */}
            <div className="flex items-start gap-2">
              <span className={`font-medium ${rectAdjusted ? 'text-white/50' : 'text-white'}`}>1.</span>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {!rectAdjusted ? (
                  <>
                    <span className="text-white">Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <rect x="1" y="1" width="10" height="10" stroke="#40E1EF" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-white">cyan corners to cover knob</span>
                  </>
                ) : (
                  <>
                    <span className="text-white/50">Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 opacity-50"
                    >
                      <rect x="1" y="1" width="10" height="10" stroke="#40E1EF" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-white/50">cyan corners to cover knob</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <path
                        d="M13 4.5L6 11.5L3 8.5"
                        stroke="#40E1EF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
            </div>

            {/* Step 2: Drag yellow dot to pointer tip */}
            <div className="flex items-start gap-2">
              <span
                className={`font-medium ${pointerAdjusted ? 'text-white/50' : rectAdjusted ? 'text-white' : 'text-white/40'}`}
              >
                2.
              </span>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {!pointerAdjusted ? (
                  <>
                    <span className={rectAdjusted ? 'text-white' : 'text-white/40'}>Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`shrink-0 ${!rectAdjusted ? 'opacity-40' : ''}`}
                    >
                      <circle cx="6" cy="6" r="4" fill="#FFFF00" />
                    </svg>
                    <span className={rectAdjusted ? 'text-white' : 'text-white/40'}>yellow dot to pointer tip</span>
                  </>
                ) : (
                  <>
                    <span className="text-white/50">Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 opacity-50"
                    >
                      <circle cx="6" cy="6" r="4" fill="#FFFF00" />
                    </svg>
                    <span className="text-white/50">yellow dot to pointer tip</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <path
                        d="M13 4.5L6 11.5L3 8.5"
                        stroke="#40E1EF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Drag red dot to knob center (Optional) */}
            <div className="flex items-start gap-2">
              <span
                className={`font-medium ${centerAdjusted ? 'text-white/50' : pointerAdjusted ? 'text-white' : 'text-white/40'}`}
              >
                3.
              </span>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {!centerAdjusted ? (
                  <>
                    <span className={pointerAdjusted ? 'text-white' : 'text-white/40'}>Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`shrink-0 ${!pointerAdjusted ? 'opacity-40' : ''}`}
                    >
                      <circle cx="6" cy="6" r="4" fill="#FF0000" />
                    </svg>
                    <span className={pointerAdjusted ? 'text-white' : 'text-white/40'}>
                      red dot to knob center <span className="text-xs">(optional)</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white/50">Drag</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 opacity-50"
                    >
                      <circle cx="6" cy="6" r="4" fill="#FF0000" />
                    </svg>
                    <span className="text-white/50">
                      red dot to knob center <span className="text-xs">(optional)</span>
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <path
                        d="M13 4.5L6 11.5L3 8.5"
                        stroke="#40E1EF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

KnobAnnotationCanvas.displayName = 'KnobAnnotationCanvas'

export default KnobAnnotationCanvas

function ConfirmIcon({ onClick }: { onClick: () => void }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <path
        d="M8 29C8 16.8497 17.8497 7 30 7C42.1503 7 52 16.8497 52 29C52 41.1503 42.1503 51 30 51C17.8497 51 8 41.1503 8 29Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g filter="url(#filter0_dd_45831_87694)">
        <path
          d="M8 29C8 16.8497 17.8497 7 30 7C42.1503 7 52 16.8497 52 29C52 41.1503 42.1503 51 30 51C17.8497 51 8 41.1503 8 29Z"
          fill="white"
          fillOpacity="0.5"
          shapeRendering="crispEdges"
        />
        <path
          d="M8 29C8 16.8497 17.8497 7 30 7C42.1503 7 52 16.8497 52 29C52 41.1503 42.1503 51 30 51C17.8497 51 8 41.1503 8 29Z"
          fill="white"
          style={{ mixBlendMode: 'saturation' }}
          shapeRendering="crispEdges"
        />
        <path
          d="M8 29C8 16.8497 17.8497 7 30 7C42.1503 7 52 16.8497 52 29C52 41.1503 42.1503 51 30 51C17.8497 51 8 41.1503 8 29Z"
          fill="#999999"
          style={{ mixBlendMode: 'overlay' }}
          shapeRendering="crispEdges"
        />
        <path
          d="M8 29C8 16.8497 17.8497 7 30 7C42.1503 7 52 16.8497 52 29C52 41.1503 42.1503 51 30 51C17.8497 51 8 41.1503 8 29Z"
          fill="#40E1EF"
          shapeRendering="crispEdges"
        />
      </g>
      <rect x="8" y="7" width="44" height="44" rx="22" fill="black" fillOpacity="0.01" />
      <path
        d="M27.7007 38.4033C27.258 38.4033 26.8817 38.2096 26.5718 37.8223L21.0518 30.999C20.93 30.8551 20.8415 30.714 20.7861 30.5757C20.7363 30.4373 20.7114 30.299 20.7114 30.1606C20.7114 29.8397 20.8166 29.5768 21.0269 29.3721C21.2371 29.1618 21.5055 29.0566 21.832 29.0566C22.2139 29.0566 22.5348 29.2282 22.7949 29.5713L27.6592 35.6973L37.1968 20.6313C37.3351 20.4155 37.479 20.2633 37.6284 20.1748C37.7778 20.0863 37.9632 20.042 38.1846 20.042C38.5166 20.042 38.7822 20.1416 38.9814 20.3408C39.1862 20.54 39.2886 20.8029 39.2886 21.1294C39.2886 21.2511 39.2664 21.3784 39.2222 21.5112C39.1834 21.644 39.1143 21.7852 39.0146 21.9346L28.813 37.814C28.6857 38.0076 28.528 38.1543 28.3398 38.2539C28.1517 38.3535 27.9386 38.4033 27.7007 38.4033Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_dd_45831_87694"
          x="0"
          y="0"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_45831_87694" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_45831_87694" result="effect2_dropShadow_45831_87694" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_45831_87694" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
