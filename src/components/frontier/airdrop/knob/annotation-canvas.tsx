import React from 'react'
import { Button } from '@/components/booster/button'
import { Rect, Point } from './types'

interface AnnotationCanvasProps {
  image: HTMLImageElement | null
  rect: Rect | null
  pointer: Point | null
  containerRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onClick: (e: React.MouseEvent) => void
  onClearRect: () => void
  onClearPointer: () => void
  onShowModal: (src: string) => void
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  image,
  rect,
  pointer,
  containerRef,
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
  onClearRect,
  onClearPointer,
  onShowModal
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf640] bg-[#1a1a1a] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)]">
      <div className="absolute inset-x-0 top-0 h-[3px] animate-pulse bg-gradient-to-r from-[#8b5cf6] via-[#667eea] to-[#8b5cf6] bg-[length:200%_100%]" />
      <h2 className="mb-4 flex items-center gap-2 border-l-[3px] border-[#6366f1] pl-3 text-lg font-bold">
        Image Annotation
      </h2>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Example: Annotated Image</div>
          <div
            className="flex h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#8b5cf64d] bg-black/30 transition-colors hover:border-[#8b5cf680]"
            onClick={() => onShowModal('https://static.codatta.io/static/images/knob_label_1766728031053.png')}
          >
            <img
              src="https://static.codatta.io/static/images/knob_label_1766728031053.png"
              alt="Example"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div>
          {image ? (
            <div>
              <div
                ref={containerRef}
                className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-black"
              >
                <canvas
                  ref={canvasRef}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onClick={onClick}
                  className="block touch-none"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  disabled={!rect}
                  onClick={onClearRect}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    !rect
                      ? 'cursor-not-allowed border-[#8b5cf666] bg-transparent text-[#a78bfa] opacity-50'
                      : 'border-[#8b5cf666] bg-[#8b5cf633] text-[#a78bfa] hover:bg-[#8b5cf64d]'
                  }`}
                  text="Clear Rectangle"
                />
                <Button
                  disabled={!pointer}
                  onClick={onClearPointer}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    !pointer
                      ? 'cursor-not-allowed border-[#8b5cf666] bg-transparent text-[#a78bfa] opacity-50'
                      : 'border-[#8b5cf666] bg-[#8b5cf633] text-[#a78bfa] hover:bg-[#8b5cf64d]'
                  }`}
                  text="Clear Pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] w-full flex-col items-center justify-center text-[#888]">
              <div className="mb-4 text-5xl">📷</div>
              <div>Please upload an image first</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnnotationCanvas
