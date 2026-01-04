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
    <div className="space-y-3">
      <div className="block">
        <h2 className="flex items-center gap-2 text-sm font-medium text-white">
          Step {step}: {title}
        </h2>
        {description && <p className="mt-1 text-xs text-[#a0a0a0]">{description}</p>}
        {warning && <div className="mt-2 text-xs">{warning}</div>}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  )
}
