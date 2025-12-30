import React from 'react'
import { Check } from 'lucide-react'
import { Rect, Point } from './types'

interface TaskStepsProps {
  currentStep: number
  rect: Rect | null
  pointer: Point | null
}

const TaskSteps: React.FC<TaskStepsProps> = ({ currentStep, rect, pointer }) => {
  return (
    <div className="sticky top-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf633] bg-[#1a1a1a] p-4 backdrop-blur-md">
        {/* Decor */}
        <div className="absolute inset-x-0 top-0 h-[3px] animate-pulse bg-gradient-to-r from-[#8b5cf6] via-[#667eea] to-[#8b5cf6] bg-[length:200%_100%]" />

        <h2 className="mb-4 flex items-center gap-2 border-l-[3px] border-[#6366f1] pl-3 text-lg font-bold">
          Task Steps
        </h2>

        <div className="space-y-2">
          {[
            {
              id: 1,
              title: 'Upload Knob Photo',
              content: 'Please upload a clear front-facing photo of an appliance knob'
            },
            {
              id: 2,
              title: 'Annotate Knob Outline',
              content: "Use a red rectangle to annotate the knob's outer contour"
            },
            {
              id: 3,
              title: 'Annotate Pointer Position',
              content: 'Use a brown dot to annotate the pointer position'
            },
            { id: 4, title: 'Fill Scale Value', content: 'Enter the scale value indicated by the pointer' }
          ].map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <div
                key={step.id}
                className={`rounded-xl border p-3 transition-all duration-300 ${
                  isActive
                    ? 'border-[#8b5cf680] bg-[#8b5cf626] shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : isCompleted
                      ? 'border-[#22c55e4d] bg-[#22c55e1a]'
                      : 'border-[#8b5cf633] bg-[#8b5cf614]'
                }`}
              >
                <div className="mb-2 flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#22c55e] to-[#16a34a]'
                        : 'bg-gradient-to-br from-[#8b5cf6] to-[#667eea]'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : step.id}
                  </div>
                  <div className="text-base font-semibold">{step.title}</div>
                </div>
                {isActive && <div className="ml-11 text-xs leading-relaxed text-[#d0d0d0]">{step.content}</div>}
              </div>
            )
          })}
        </div>

        {/* Coordinates Display */}
        {(rect || pointer) && (
          <div className="mt-5 space-y-2 rounded-lg border border-[#8b5cf633] bg-[#8b5cf61a] p-4 text-xs">
            {rect && (
              <div>
                <span className="mb-1 block font-bold text-[#a78bfa]">Rectangle:</span>
                <div className="rounded bg-black/30 p-1 font-[monospace]">
                  {`<${Math.round(rect.x1)},${Math.round(rect.y1)}>, <${Math.round(rect.x2)},${Math.round(rect.y2)}>`}
                </div>
              </div>
            )}
            {rect?.center && (
              <div>
                <span className="mb-1 block font-bold text-[#a78bfa]">Center:</span>
                <div className="rounded bg-black/30 p-1 font-[monospace]">
                  {`<${Math.round(rect.center.x)},${Math.round(rect.center.y)}>`}
                </div>
              </div>
            )}
            {pointer && (
              <div>
                <span className="mb-1 block font-bold text-[#a78bfa]">Pointer:</span>
                <div className="rounded bg-black/30 p-1 font-[monospace]">
                  {`<${Math.round(pointer.x)},${Math.round(pointer.y)}>`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskSteps
