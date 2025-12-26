import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect as KonvaRect, Circle, Line, Group } from 'react-konva'
import Konva from 'konva'
import { Button } from '@/components/booster/button'
import { Rect, Point } from './types'

export interface AnnotationCanvasRef {
  getAnnotatedImage: () => string
}

interface AnnotationCanvasProps {
  image: HTMLImageElement | null
  rect: Rect | null
  pointer: Point | null
  exampleImage?: string
  onRectChange: (rect: Rect | null) => void
  onPointerChange: (pointer: Point | null) => void
  onShowModal: (src: string) => void
}

const AnnotationCanvas = forwardRef<AnnotationCanvasRef, AnnotationCanvasProps>(
  ({ image, rect, pointer, exampleImage, onRectChange, onPointerChange, onShowModal }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<Konva.Stage>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawStart, setDrawStart] = useState<Point | null>(null)
    const [drawCurrent, setDrawCurrent] = useState<Point | null>(null)
    const [isDraggingShape, setIsDraggingShape] = useState(false)
    const [lastShapePos, setLastShapePos] = useState<Point | null>(null)

    const MIN_SIZE = 20

    // Calculate dimensions to fit image in container
    useEffect(() => {
      const updateDimensions = () => {
        if (!containerRef.current || !image) return

        const containerW = containerRef.current.clientWidth
        const containerH = containerRef.current.clientHeight
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

    // Helper to get midpoint
    const getMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => ({
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    })

    // Denormalized coordinates helper (now just pass-through as we use pixels)
    const getCoords = () => {
      if (!rect || !image) return null
      return {
        x1: rect.x1,
        y1: rect.y1,
        x2: rect.x2,
        y2: rect.y2,
        x3: rect.x3,
        y3: rect.y3,
        x4: rect.x4,
        y4: rect.y4,
        w: image.naturalWidth,
        h: image.naturalHeight
      }
    }

    const getCursorForCorner = (index: number) => {
      switch (index) {
        case 1:
          return 'nw-resize'
        case 2:
          return 'ne-resize'
        case 3:
          return 'se-resize'
        case 4:
          return 'sw-resize'
        default:
          return 'default'
      }
    }

    const getCursorForEdge = (index: number) => {
      switch (index) {
        case 0:
          return 'n-resize' // Top
        case 1:
          return 'e-resize' // Right
        case 2:
          return 's-resize' // Bottom
        case 3:
          return 'w-resize' // Left
        default:
          return 'default'
      }
    }

    const handleCornerDrag = (index: number, e: Konva.KonvaEventObject<DragEvent>) => {
      if (!image || !rect) return
      const pos = e.target.position()
      let { x, y } = pos

      const minW = MIN_SIZE
      const minH = MIN_SIZE

      // Get current pixel coordinates
      const c = {
        x1: rect.x1,
        y1: rect.y1,
        x2: rect.x2,
        y2: rect.y2,
        x3: rect.x3,
        y3: rect.y3,
        x4: rect.x4,
        y4: rect.y4
      }

      // Clamp coordinates to enforce min size and prevent mirroring
      switch (index) {
        case 1: // TL
          x = Math.min(x, c.x2 - minW)
          y = Math.min(y, c.y4 - minH)
          break
        case 2: // TR
          x = Math.max(x, c.x1 + minW)
          y = Math.min(y, c.y3 - minH)
          break
        case 3: // BR
          x = Math.max(x, c.x4 + minW)
          y = Math.max(y, c.y2 + minH)
          break
        case 4: // BL
          x = Math.min(x, c.x3 - minW)
          y = Math.max(y, c.y1 + minH)
          break
      }

      // Update drag node position to reflect clamped values
      e.target.position({ x, y })

      const newRect = { ...rect }
      // Update corner and maintain axis alignment (rectangular constraint)
      switch (index) {
        case 1: // TL: x1, y1 -> updates x4 (left edge) and y2 (top edge)
          newRect.x1 = x
          newRect.y1 = y
          newRect.x4 = x // Align Left Edge
          newRect.y2 = y // Align Top Edge
          break
        case 2: // TR: x2, y2 -> updates x3 (right edge) and y1 (top edge)
          newRect.x2 = x
          newRect.y2 = y
          newRect.x3 = x // Align Right Edge
          newRect.y1 = y // Align Top Edge
          break
        case 3: // BR: x3, y3 -> updates x2 (right edge) and y4 (bottom edge)
          newRect.x3 = x
          newRect.y3 = y
          newRect.x2 = x // Align Right Edge
          newRect.y4 = y // Align Bottom Edge
          break
        case 4: // BL: x4, y4 -> updates x1 (left edge) and y3 (bottom edge)
          newRect.x4 = x
          newRect.y4 = y
          newRect.x1 = x // Align Left Edge
          newRect.y3 = y // Align Bottom Edge
          break
      }

      // Update center
      newRect.center = {
        x: (newRect.x1 + newRect.x2 + newRect.x3 + newRect.x4) / 4,
        y: (newRect.y1 + newRect.y2 + newRect.y3 + newRect.y4) / 4
      }

      onRectChange(newRect)
    }

    const handleEdgeDrag = (edgeIndex: number, e: Konva.KonvaEventObject<DragEvent>) => {
      if (!image || !rect) return
      const coords = getCoords()
      if (!coords) return

      const { x: newX, y: newY } = e.target.position()

      // Calculate current midpoint (before drag)
      let p1, p2
      if (edgeIndex === 0) {
        p1 = { x: coords.x1, y: coords.y1 }
        p2 = { x: coords.x2, y: coords.y2 }
      } // Top
      else if (edgeIndex === 1) {
        p1 = { x: coords.x2, y: coords.y2 }
        p2 = { x: coords.x3, y: coords.y3 }
      } // Right
      else if (edgeIndex === 2) {
        p1 = { x: coords.x3, y: coords.y3 }
        p2 = { x: coords.x4, y: coords.y4 }
      } // Bottom
      else {
        p1 = { x: coords.x4, y: coords.y4 }
        p2 = { x: coords.x1, y: coords.y1 }
      } // Left

      const currentMid = getMidpoint(p1, p2)
      let dx = newX - currentMid.x
      let dy = newY - currentMid.y

      const minW = MIN_SIZE
      const minH = MIN_SIZE

      // Clamp deltas to enforce min size and prevent mirroring
      // We are constraining the movement perpendicular to the expected edge orientation
      // AND forcing axis alignment to prevent shearing
      if (edgeIndex === 0) {
        // Top: constrain y against bottom corners (y4, y3). Lock x.
        dx = 0
        // y1+dy <= y4-minH AND y2+dy <= y3-minH
        const maxDy = Math.min(coords.y4 - coords.y1, coords.y3 - coords.y2) - minH
        dy = Math.min(dy, maxDy)
      } else if (edgeIndex === 1) {
        // Right: constrain x against left corners (x1, x4). Lock y.
        dy = 0
        // x2+dx >= x1+minW AND x3+dx >= x4+minW
        const minDx = Math.max(coords.x1 - coords.x2, coords.x4 - coords.x3) + minW
        dx = Math.max(dx, minDx)
      } else if (edgeIndex === 2) {
        // Bottom: constrain y against top corners (y1, y2). Lock x.
        dx = 0
        // y3+dy >= y2+minH AND y4+dy >= y1+minH
        const minDy = Math.max(coords.y2 - coords.y3, coords.y1 - coords.y4) + minH
        dy = Math.max(dy, minDy)
      } else {
        // Left: constrain x against right corners (x2, x3). Lock y.
        dy = 0
        // x4+dx <= x3-minW AND x1+dx <= x2-minW
        const maxDx = Math.min(coords.x3 - coords.x4, coords.x2 - coords.x1) - minW
        dx = Math.min(dx, maxDx)
      }

      // Update anchor position to reflect clamping
      e.target.position({
        x: currentMid.x + dx,
        y: currentMid.y + dy
      })

      const newRect = { ...rect }

      // Update adjacent corners
      if (edgeIndex === 0) {
        // Top: 1 & 2
        newRect.x1 += dx
        newRect.y1 += dy
        newRect.x2 += dx
        newRect.y2 += dy
      } else if (edgeIndex === 1) {
        // Right: 2 & 3
        newRect.x2 += dx
        newRect.y2 += dy
        newRect.x3 += dx
        newRect.y3 += dy
      } else if (edgeIndex === 2) {
        // Bottom: 3 & 4
        newRect.x3 += dx
        newRect.y3 += dy
        newRect.x4 += dx
        newRect.y4 += dy
      } else {
        // Left: 4 & 1
        newRect.x4 += dx
        newRect.y4 += dy
        newRect.x1 += dx
        newRect.y1 += dy
      }

      // Update center
      newRect.center = {
        x: (newRect.x1 + newRect.x2 + newRect.x3 + newRect.x4) / 4,
        y: (newRect.y1 + newRect.y2 + newRect.y3 + newRect.y4) / 4
      }

      onRectChange(newRect)
    }

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
      // If clicking on transformer or rect, don't start drawing
      // With new Quad editor, we check if target is part of the editor (Circle or Line)
      const target = e.target

      // Handle Shape Drag Start
      if (target instanceof Konva.Line && target.name() === 'quad-edge') {
        const stage = e.target.getStage()
        const point = stage?.getPointerPosition()
        if (point) {
          setIsDraggingShape(true)
          setLastShapePos({ x: point.x / dimensions.scale, y: point.y / dimensions.scale })
        }
        return
      }

      if (target instanceof Konva.Circle || (target instanceof Konva.Line && target.name() === 'quad-edge')) {
        return
      }

      // If clicking on pointer, don't start drawing
      if (e.target instanceof Konva.Circle && e.target.name() === 'pointer') {
        return
      }

      if (rect) {
        // If rect exists, click elsewhere might place pointer (if not clicking on rect/transformer)
        // But we want to ensure we don't accidentally move pointer when trying to deselect?
        // Current logic: if rect exists and no pointer, click places pointer
        if (!pointer) {
          const stage = e.target.getStage()
          const point = stage?.getPointerPosition()
          if (point) {
            onPointerChange({
              x: point.x / dimensions.scale,
              y: point.y / dimensions.scale
            })
          }
        }
        return
      }

      // Start drawing
      const stage = e.target.getStage()
      const point = stage?.getPointerPosition()
      if (point) {
        setIsDrawing(true)
        const scaledPoint = { x: point.x / dimensions.scale, y: point.y / dimensions.scale }
        setDrawStart(scaledPoint)
        setDrawCurrent(scaledPoint)
      }
    }

    const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage()
      const point = stage?.getPointerPosition()
      if (!point) return

      const currentPos = { x: point.x / dimensions.scale, y: point.y / dimensions.scale }

      if (isDraggingShape && lastShapePos && rect && image) {
        const dx = currentPos.x - lastShapePos.x
        const dy = currentPos.y - lastShapePos.y

        // Bounds checking
        const c = {
          x1: rect.x1,
          y1: rect.y1,
          x2: rect.x2,
          y2: rect.y2,
          x3: rect.x3,
          y3: rect.y3,
          x4: rect.x4,
          y4: rect.y4
        }
        const w = image.naturalWidth
        const h = image.naturalHeight

        const minX = Math.min(c.x1, c.x2, c.x3, c.x4)
        const maxX = Math.max(c.x1, c.x2, c.x3, c.x4)
        const minY = Math.min(c.y1, c.y2, c.y3, c.y4)
        const maxY = Math.max(c.y1, c.y2, c.y3, c.y4)

        let safeDx = dx
        let safeDy = dy

        if (minX + safeDx < 0) safeDx = -minX
        if (maxX + safeDx > w) safeDx = w - maxX
        if (minY + safeDy < 0) safeDy = -minY
        if (maxY + safeDy > h) safeDy = h - maxY

        if (safeDx !== 0 || safeDy !== 0) {
          const newRect = { ...rect }
          newRect.x1 += safeDx
          newRect.y1 += safeDy
          newRect.x2 += safeDx
          newRect.y2 += safeDy
          newRect.x3 += safeDx
          newRect.y3 += safeDy
          newRect.x4 += safeDx
          newRect.y4 += safeDy
          newRect.center = {
            x: (newRect.x1 + newRect.x2 + newRect.x3 + newRect.x4) / 4,
            y: (newRect.y1 + newRect.y2 + newRect.y3 + newRect.y4) / 4
          }
          onRectChange(newRect)
          // Accumulate the consumed delta into lastPos, effectively shifting the "anchor"
          // We add safeDx/safeDy to lastShapePos so the next delta is calculated relative to the new position
          setLastShapePos({ x: lastShapePos.x + safeDx, y: lastShapePos.y + safeDy })
        }
        return
      }

      if (!isDrawing) return
      setDrawCurrent(currentPos)
    }

    const handleStageMouseUp = () => {
      setIsDraggingShape(false)
      setLastShapePos(null)

      if (isDrawing && drawStart && drawCurrent && image) {
        setIsDrawing(false)

        // Create normalized rect (no rotation initially)
        const x1 = Math.min(drawStart.x, drawCurrent.x)
        const y1 = Math.min(drawStart.y, drawCurrent.y)
        const x2 = Math.max(drawStart.x, drawCurrent.x)
        const y2 = Math.max(drawStart.y, drawCurrent.y)

        // Don't create if too small
        if (Math.abs(x2 - x1) > MIN_SIZE && Math.abs(y2 - y1) > MIN_SIZE) {
          onRectChange({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y1,
            x3: x2,
            y3: y2,
            x4: x1,
            y4: y2,
            center: {
              x: (x1 + x2) / 2,
              y: (y1 + y2) / 2
            }
          })
        }
        setDrawStart(null)
        setDrawCurrent(null)
      }
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
          ctx.strokeStyle = 'red'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(rect.x1, rect.y1)
          ctx.lineTo(rect.x2, rect.y2)
          ctx.lineTo(rect.x3, rect.y3)
          ctx.lineTo(rect.x4, rect.y4)
          ctx.closePath()
          ctx.stroke()

          // Draw corner coordinates removed as per request
          if (rect.center) {
            ctx.fillStyle = '#10b981'
            ctx.beginPath()
            ctx.arc(rect.center.x, rect.center.y, 6, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = 'white'
            ctx.lineWidth = 2
            ctx.stroke()
          }
        }

        if (pointer) {
          // Outer circle
          ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'
          ctx.beginPath()
          ctx.arc(pointer.x, pointer.y, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = 'white'
          ctx.lineWidth = 3
          ctx.stroke()

          // Inner center point
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2)
          ctx.fill()

          // Coordinates removed as per request
        }

        return canvas.toDataURL('image/jpeg', 0.8)
      }
    }))

    return (
      <div className="space-y-3">
        <div className="block space-y-6">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-medium">
              Step 2: Annotate Knob Outline<span className="text-red-400">*</span>
              {rect && (
                <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </span>
              )}
            </h2>
            <p className="mt-1 text-xs text-[#a0a0a0]">Use a red rectangle to annotate the knob's outer contour</p>
            {/* Rect Stats */}
            <div className="mt-3">
              {rect ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600">TL</span>
                    <span>
                      {Math.round(rect.x1)}, {Math.round(rect.y1)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600">TR</span>
                    <span>
                      {Math.round(rect.x2)}, {Math.round(rect.y2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600">BR</span>
                    <span>
                      {Math.round(rect.x3)}, {Math.round(rect.y3)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600">BL</span>
                    <span>
                      {Math.round(rect.x4)}, {Math.round(rect.y4)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs italic text-gray-600">No shape drawn</div>
              )}
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-sm font-medium">
              Step 3: Annotate Pointer Position<span className="text-red-400">*</span>
              {pointer && (
                <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </span>
              )}
            </h2>
            <p className="mt-1 text-xs text-[#a0a0a0]">Use a brown dot to annotate the pointer position</p>
            {/* Pointer Stats */}
            <div className="mt-3">
              {pointer ? (
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-white">P</span>
                  <span>
                    {Math.round(pointer.x)}, {Math.round(pointer.y)}
                  </span>
                </div>
              ) : (
                <div className="text-xs italic text-gray-600">Not active</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#a78bfa]">Example: Annotated Image</div>
            <div
              className="flex h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#FFFFFF1F] bg-black/30 transition-colors hover:border-[#8b5cf680]"
              onClick={() => exampleImage && onShowModal(exampleImage)}
            >
              {exampleImage ? (
                <img src={exampleImage} alt="Example" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-gray-500">No example image available</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#a78bfa]">Your Annotation</div>
            <div>
              {image ? (
                <div>
                  <div
                    ref={containerRef}
                    className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg border border-[#FFFFFF1F] bg-black"
                  >
                    <Stage
                      ref={stageRef}
                      width={dimensions.width}
                      height={dimensions.height}
                      onMouseDown={handleStageMouseDown}
                      onMouseMove={handleStageMouseMove}
                      onMouseUp={handleStageMouseUp}
                      onMouseLeave={handleStageMouseUp}
                    >
                      <Layer scaleX={dimensions.scale} scaleY={dimensions.scale}>
                        <KonvaImage image={image} />

                        {/* Temporary Drawing Rect */}
                        {isDrawing && drawStart && drawCurrent && (
                          <KonvaRect
                            x={Math.min(drawStart.x, drawCurrent.x)}
                            y={Math.min(drawStart.y, drawCurrent.y)}
                            width={Math.abs(drawCurrent.x - drawStart.x)}
                            height={Math.abs(drawCurrent.y - drawStart.y)}
                            stroke="red"
                            strokeWidth={2 / dimensions.scale}
                          />
                        )}

                        {/* Edited Quadrilateral */}
                        {rect &&
                          image &&
                          (() => {
                            const coords = getCoords()
                            if (!coords) return null
                            const { x1, y1, x2, y2, x3, y3, x4, y4 } = coords

                            const corners = [
                              { x: x1, y: y1, i: 1 },
                              { x: x2, y: y2, i: 2 },
                              { x: x3, y: y3, i: 3 },
                              { x: x4, y: y4, i: 4 }
                            ]

                            // Edges: 1-2, 2-3, 3-4, 4-1
                            const edges = [
                              { p1: corners[0], p2: corners[1], i: 0 },
                              { p1: corners[1], p2: corners[2], i: 1 },
                              { p1: corners[2], p2: corners[3], i: 2 },
                              { p1: corners[3], p2: corners[0], i: 3 }
                            ]

                            return (
                              <>
                                {/* The Polygon Shape */}
                                <Line
                                  points={[x1, y1, x2, y2, x3, y3, x4, y4]}
                                  closed
                                  stroke="red"
                                  strokeWidth={4 / dimensions.scale}
                                  fill="transparent"
                                  name="quad-edge"
                                  onMouseEnter={() => {
                                    if (stageRef.current) stageRef.current.container().style.cursor = 'move'
                                  }}
                                  onMouseLeave={() => {
                                    if (stageRef.current) stageRef.current.container().style.cursor = 'default'
                                  }}
                                />

                                {/* Corners */}
                                {corners.map((c) => (
                                  <Circle
                                    key={`corner-${c.i}`}
                                    x={c.x}
                                    y={c.y}
                                    radius={7 / dimensions.scale}
                                    fill="white"
                                    stroke="red"
                                    strokeWidth={2 / dimensions.scale}
                                    draggable
                                    onDragMove={(e) => handleCornerDrag(c.i, e)}
                                    onMouseEnter={() => {
                                      if (stageRef.current) {
                                        stageRef.current.container().style.cursor = getCursorForCorner(c.i)
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (stageRef.current) stageRef.current.container().style.cursor = 'default'
                                    }}
                                  />
                                ))}

                                {/* Edge Anchors */}
                                {edges.map((e) => {
                                  const mid = getMidpoint(e.p1, e.p2)
                                  return (
                                    <Circle
                                      key={`edge-${e.i}`}
                                      x={mid.x}
                                      y={mid.y}
                                      radius={6 / dimensions.scale}
                                      fill="white"
                                      stroke="red"
                                      strokeWidth={2 / dimensions.scale}
                                      draggable
                                      onDragMove={(evt) => handleEdgeDrag(e.i, evt)}
                                      onMouseEnter={() => {
                                        if (stageRef.current) {
                                          stageRef.current.container().style.cursor = getCursorForEdge(e.i)
                                        }
                                      }}
                                      onMouseLeave={() => {
                                        if (stageRef.current) stageRef.current.container().style.cursor = 'default'
                                      }}
                                    />
                                  )
                                })}
                              </>
                            )
                          })()}

                        {/* Center Point */}
                        {rect && rect.center && (
                          <Circle
                            x={rect.center.x}
                            y={rect.center.y}
                            radius={5 / dimensions.scale}
                            fill="#10b981"
                            stroke="white"
                            strokeWidth={2 / dimensions.scale}
                            listening={false}
                          />
                        )}

                        {/* Pointer */}
                        {pointer && (
                          <Group
                            name="pointer"
                            x={pointer.x}
                            y={pointer.y}
                            draggable
                            onDragMove={(e) => {
                              onPointerChange({
                                x: e.target.x(),
                                y: e.target.y()
                              })
                            }}
                            onDragEnd={(e) => {
                              onPointerChange({
                                x: e.target.x(),
                                y: e.target.y()
                              })
                            }}
                            onMouseEnter={() => {
                              const stage = stageRef.current
                              if (stage) stage.container().style.cursor = 'pointer'
                            }}
                            onMouseLeave={() => {
                              const stage = stageRef.current
                              if (stage) stage.container().style.cursor = 'default'
                            }}
                          >
                            <Circle
                              radius={12 / dimensions.scale}
                              fill="rgba(139, 69, 19, 0.5)"
                              stroke="white"
                              strokeWidth={2 / dimensions.scale}
                            />
                            <Circle radius={2 / dimensions.scale} fill="white" />
                          </Group>
                        )}
                      </Layer>
                    </Stage>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      disabled={!rect}
                      onClick={() => onRectChange(null)}
                      className={`h-9 rounded-lg border px-4 text-xs font-medium transition-colors ${
                        !rect
                          ? 'cursor-not-allowed border-[#FFFFFF1F] bg-white/5 text-gray-500'
                          : 'border-[#FFFFFF1F] bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
                      }`}
                      text="Clear Rectangle"
                    />
                    <Button
                      disabled={!pointer}
                      onClick={() => onPointerChange(null)}
                      className={`h-9 rounded-lg border px-4 text-xs font-medium transition-colors ${
                        !pointer
                          ? 'cursor-not-allowed border-[#FFFFFF1F] bg-white/5 text-gray-500'
                          : 'border-[#FFFFFF1F] bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
                      }`}
                      text="Clear Pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#FFFFFF1F] bg-white/5 text-[#888]">
                  <div className="mb-4 text-5xl">📷</div>
                  <div>Please upload an image first</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

AnnotationCanvas.displayName = 'AnnotationCanvas'

export default AnnotationCanvas
