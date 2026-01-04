import React, { ReactNode } from 'react'

interface StepContainerProps {
  step: number
  title: string
  description?: ReactNode
  children: ReactNode
  warning?: ReactNode
}

export const StepContainer: React.FC<StepContainerProps> = ({ step, title, description, children, warning }) => {
  return (
    <div className="relative mb-4 grid grid-cols-1 gap-[18px] rounded-xl border border-[#8b5cf633] bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] p-[18px] backdrop-blur md:grid-cols-[280px_1fr]">
      {/* Decorative top border with simplified shimmer */}
      <div className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-t-2xl">
        <div className="size-full bg-gradient-to-r from-[#8b5cf6] via-[#667eea] to-[#8b5cf6] opacity-80" />
      </div>

      <div className="sticky top-6 h-fit">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#667eea] text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]">
            {step}
          </div>
          <div className="text-base font-bold text-white">{title}</div>
        </div>

        {warning && (
          <div className="mb-3 rounded-md border-l-4 border-yellow-500 bg-yellow-500/10 px-3 py-2.5 text-xs leading-[1.4] text-gray-200">
            {warning}
          </div>
        )}
      </div>

      <div className="min-w-0 pl-0 text-[13px] leading-normal text-white">
        {description && <div className="mb-3 text-[#ffffff]">{description}</div>}
        {children}
      </div>
    </div>
  )
}
