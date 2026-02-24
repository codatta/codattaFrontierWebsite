import { useEffect, useRef, useState } from 'react'
import DraggableArrow from './draggable-arrow'
import useGiftStore from '@/stores/image-label-store'
import { Frame } from '@/utils/media'

export default function ImageLabel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const { frame } = useGiftStore()

  function renderFrame(frame: Frame, context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, frame.width, frame.height)
    const imageData = new ImageData(frame.data, frame.width, frame.height)
    context.putImageData(imageData, 0, 0)
  }

  useEffect(() => {
    if (!frame) return
    if (!canvasRef.current) return

    ctxRef.current = canvasRef.current?.getContext('2d') || null
    if (!ctxRef.current) return
    renderFrame(frame, ctxRef.current)
  }, [canvasRef, frame])

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div>
      <p className="mb-3 text-sm">Please complete the annotation task in the image below.</p>
      <div className="relative w-full" ref={containerRef}>
        <canvas
          ref={canvasRef}
          width={frame?.width || 640}
          height={frame?.height || 480}
          className="mb-4 w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-300 transition duration-300 ease-in-out"
        ></canvas>
        <DraggableArrow
          className="absolute left-0 top-0"
          width={frame?.width || 640}
          height={frame?.height || 480}
          containerWidth={containerWidth}
        />
      </div>
    </div>
  )
}
