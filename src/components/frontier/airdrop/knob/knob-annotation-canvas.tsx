import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle, Line } from 'react-konva'
import Konva from 'konva'
import { ChevronLeft, Check } from 'lucide-react'
import { Rect, Point } from './types'

export interface KnobAnnotationCanvasRef {
  getAnnotatedImage: () => string
}

interface KnobAnnotationCanvasProps {
  image: HTMLImageElement
  rect: Rect | null
  pointer: Point | null
  onRectChange: (rect: Rect | null) => void
  onPointerChange: (pointer: Point | null) => void
  onClose: () => void
  onConfirm: () => void
}

const KnobAnnotationCanvas = forwardRef<KnobAnnotationCanvasRef, KnobAnnotationCanvasProps>(
  ({ image, rect, pointer, onRectChange, onPointerChange, onClose, onConfirm }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<Konva.Stage>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 })
    const [isDraggingRect, setIsDraggingRect] = useState(false)
    const [isDraggingCorner, setIsDraggingCorner] = useState<number | null>(null)
    const [lastPos, setLastPos] = useState<Point | null>(null)

    const MIN_SIZE = 40

    useEffect(() => {
      const updateDimensions = () => {
        if (!containerRef.current || !image) return

        const containerW = window.innerWidth
        const containerH = window.innerHeight - 100
        const imgRatio = image.naturalWidth / image.naturalHeight
        const containerRatio = containerW / containerH

        let drawWidth, drawHeight, scale

        if (containerRatio > imgRatio) {
          drawHeight = containerH
          drawWidth = containerH * imgRatio
          scale = containerH / image.naturalHeight
        } else {
          drawWidth = containerW
          drawHeight = containerW / imgRatio
          scale = containerW / image.naturalWidth
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
            center: {
              x: (rect.center?.x || 0) + safeDx,
              y: (rect.center?.y || 0) + safeDy
            }
          }
          onRectChange(newRect)
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

      newRect.center = {
        x: (newRect.x1 + newRect.x2 + newRect.x3 + newRect.x4) / 4,
        y: (newRect.y1 + newRect.y2 + newRect.y3 + newRect.y4) / 4
      }

      onRectChange(newRect)
    }

    const handleCenterDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!rect) return
      const pos = e.target.position()
      const newRect = {
        ...rect,
        center: { x: pos.x, y: pos.y }
      }
      onRectChange(newRect)
    }

    const handlePointerDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
      const pos = e.target.position()
      onPointerChange({ x: pos.x, y: pos.y })
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

        if (rect) {
          ctx.strokeStyle = '#00D1FF'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(rect.x1, rect.y1)
          ctx.lineTo(rect.x2, rect.y2)
          ctx.lineTo(rect.x3, rect.y3)
          ctx.lineTo(rect.x4, rect.y4)
          ctx.closePath()
          ctx.stroke()

          if (rect.center) {
            ctx.fillStyle = '#FF0000'
            ctx.beginPath()
            ctx.arc(rect.center.x, rect.center.y, 8, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        if (pointer) {
          ctx.fillStyle = '#FFA500'
          ctx.beginPath()
          ctx.arc(pointer.x, pointer.y, 8, 0, Math.PI * 2)
          ctx.fill()
        }

        return canvas.toDataURL('image/jpeg', 0.9)
      }
    }))

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        {/* Header */}
        <div className="flex h-[100px] items-center justify-between px-5 pt-12">
          <button
            onClick={onClose}
            className="flex size-12 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <ChevronLeft className="size-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">Image Annotation</h1>
          <button
            onClick={onConfirm}
            className="flex size-12 items-center justify-center rounded-full bg-[#00D1FF] text-white"
          >
            <Check className="size-6" />
          </button>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-hidden bg-[#D3D3D3]">
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
                    stroke="#00D1FF"
                    strokeWidth={3 / dimensions.scale}
                    name="rect-shape"
                  />

                  {[
                    { x: rect.x1, y: rect.y1, i: 1 },
                    { x: rect.x2, y: rect.y2, i: 2 },
                    { x: rect.x3, y: rect.y3, i: 3 },
                    { x: rect.x4, y: rect.y4, i: 4 }
                  ].map((corner) => (
                    <Circle
                      key={corner.i}
                      id={corner.i.toString()}
                      x={corner.x}
                      y={corner.y}
                      radius={12 / dimensions.scale}
                      fill="#00D1FF"
                      name="corner"
                    />
                  ))}

                  {rect.center && (
                    <Circle
                      x={rect.center.x}
                      y={rect.center.y}
                      radius={10 / dimensions.scale}
                      fill="#FF0000"
                      draggable
                      name="center-dot"
                      onDragMove={handleCenterDrag}
                    />
                  )}
                </>
              )}

              {pointer && (
                <Circle
                  x={pointer.x}
                  y={pointer.y}
                  radius={10 / dimensions.scale}
                  fill="#FFA500"
                  draggable
                  name="pointer-dot"
                  onDragMove={handlePointerDrag}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    )
  }
)

KnobAnnotationCanvas.displayName = 'KnobAnnotationCanvas'

export default KnobAnnotationCanvas
