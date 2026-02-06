import React, { ReactNode } from 'react'

interface StepContainerProps {
  title: string | ReactNode
  step?: number
  description?: ReactNode
  children: ReactNode
  warning?: ReactNode
}

export const StepContainer: React.FC<StepContainerProps> = ({ title, step, description, children, warning }) => {
  return (
    <div className="mt-12">
      <div className="block">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          {step !== undefined && (
            <span className="flex size-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {step}
            </span>
          )}
          {title}
        </h2>
        {description && <p className="mt-1 text-xs text-[#a0a0a0]">{description}</p>}
        {warning && <div className="mt-2 text-xs">{warning}</div>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}
