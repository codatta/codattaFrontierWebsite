import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow, Circle, Group, Layer, Stage, Text, Rect } from 'react-konva'
import Konva from 'konva'

import useImageLabelStore, { updateRect } from '@/stores/image-label-store'

interface Props {
  width: number
  height: number
  containerWidth: number
  className?: string
  onPositionChange?: (x: number, y: number) => void
  onAngleChange?: (angle: number) => void
}

const MIN_RADIUS = 12
const MIN_ARROW_LENGTH = 60
const DraggableArrow: React.FC<Props> = ({
  width = 640,
  height = 480,
  containerWidth = 1,
  className,
  onPositionChange,
  onAngleChange
}) => {
  const { rect, focusPointVisible } = useImageLabelStore()
  const [mode, setMode] = useState<'default' | 'move' | 'rotate' | 'resize'>(
    'default'
  )
  const groupRef = useRef<Konva.Group>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [arrowLength, setArrowLength] = useState<number>(MIN_ARROW_LENGTH)

  const absolutePosition = useMemo(() => {
    return {
      x: rect.x * width,
      y: rect.y * height,
      angle: rect.angle
    }
  }, [rect, width, height])

  const handleDragMove = () => {
    if (!stageRef.current || mode === 'default') return

    const pointerPos = stageRef.current.getPointerPosition()
    if (!pointerPos) return

    if (mode === 'rotate') {
      const dx = pointerPos.x - absolutePosition.x
      const dy = pointerPos.y - absolutePosition.y
      const angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI)
      const arrowLength = Math.max(
        Math.sqrt(dx * dx + dy * dy),
        MIN_ARROW_LENGTH
      )

      setArrowLength(arrowLength)
      updateRect({ angle })
      onAngleChange?.(angle)
    } else if (mode === 'move') {
      const x = Math.max(
        0,
        Math.min(1, Math.floor((pointerPos.x / width) * 100) / 100)
      )
      const y = Math.max(
        0,
        Math.min(1, Math.floor((pointerPos.y / height) * 100) / 100)
      )

      updateRect({ x, y })
      onPositionChange?.(x, y)
    } else if (mode === 'resize') {
      const dx = pointerPos.x - absolutePosition.x
      const dy = pointerPos.y - absolutePosition.y
      const radius = Math.max(
        Math.round(Math.sqrt(dx * dx + dy * dy)),
        MIN_RADIUS
      )

      updateRect({ radius: Math.min(radius, 200) })
    }
  }

  const handleMouseUp = () => {
    setMode('default')

    if (stageRef.current) {
      stageRef.current.container().style.cursor = 'default'
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      style={{
        transform: `scale(${containerWidth / width || 1})`,
        transformOrigin: 'left top'
      }}
      onMouseMove={handleDragMove}
      className={className}
    >
      <Layer visible={focusPointVisible}>
        <Group
          ref={groupRef}
          x={absolutePosition.x}
          y={absolutePosition.y}
          rotation={absolutePosition.angle}
          offsetX={0}
          offsetY={0}
        >
          {(mode === 'resize' || mode === 'default') && (
            <ResizeRect
              width={rect.radius * 2}
              height={rect.radius * 2}
              onClick={() => setMode('resize')}
            />
          )}

          <Circle
            radius={rect.radius}
            fill="rgba(76, 175, 80, 0.2)"
            stroke="#ffffff"
            strokeWidth={1}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()!
              stage.container().style.cursor = 'pointer'
            }}
            onMouseLeave={(e) => {
              if (mode === 'default') {
                const stage = e.target.getStage()!
                stage.container().style.cursor = 'default'
              }
            }}
            onMouseDown={(e) => {
              const stage = e.target.getStage()!
              setMode('move')
              stage.container().style.cursor = 'pointer'
            }}
          />
          <Circle radius={2} fill="#ffffff" opacity={1} />
          {mode === 'move' && <Text text="⬇️" fontSize={24} x={-44} y={-10} />}
          {mode === 'rotate' && (
            <Text text="🔄" fontSize={24} x={-44} y={-10} />
          )}
          <Arrow
            points={[0, 0, arrowLength, 0]}
            pointerLength={20}
            pointerWidth={16}
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth={2}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()!
              stage.container().style.cursor = 'pointer'
            }}
            onMouseLeave={(e) => {
              if (mode === 'default') {
                const stage = e.target.getStage()!
                stage.container().style.cursor = 'default'
              }
            }}
            onMouseDown={(e) => {
              const stage = e.target.getStage()!
              setMode('rotate')
              stage.container().style.cursor = 'pointer'
            }}
          />
        </Group>
      </Layer>
    </Stage>
  )
}

export default DraggableArrow

interface ResizeRectProps {
  width: number
  height: number
  onClick?: () => void
}

function ResizeRect({ width, height, onClick }: ResizeRectProps) {
  const x = -width / 2 - 1
  const y = -height / 2 - 1

  return (
    <Group>
      {/* Main square outline */}
      <Rect
        x={x}
        y={y}
        width={width + 2}
        height={height + 2}
        stroke="#ffffff"
        strokeWidth={1}
        dash={[5, 5]}
      />

      {/* Corner resize handles */}
      {[
        { x: x, y: y }, // Top-left
        { x: x + width, y: y }, // Top-right
        { x: x, y: y + height }, // Bottom-left
        { x: x + width, y: y + height } // Bottom-right
      ].map((pos, index) => (
        <Rect
          key={index}
          x={pos.x - 5}
          y={pos.y - 5}
          width={10}
          height={10}
          fill="rgba(76, 175, 80, 0.2)"
          stroke="#ffffff"
          strokeWidth={1}
          onMouseEnter={(e) => {
            const stage = e.target.getStage()!
            stage.container().style.cursor = 'pointer'
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage()!
            stage.container().style.cursor = 'default'
          }}
          onMouseDown={(e) => {
            const stage = e.target.getStage()!
            stage.container().style.cursor = 'pointer'
            onClick?.()
          }}
        />
      ))}
    </Group>
  )
}
