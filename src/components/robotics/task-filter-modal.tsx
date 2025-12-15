import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'

import { cn } from '@udecode/cn'

import { TaskType } from '@/apis/frontiter.api'

export type FilterState = {
  task_types: TaskType[]
}

const DEFAULT_FILTER_STATE: FilterState = {
  task_types: ['submission', 'validation']
}

interface RoboticsTaskFilterModalProps {
  open: boolean
  value: FilterState
  onChange: (value: FilterState) => void
  onClose: () => void
}

const RoboticsTaskFilterModal: React.FC<RoboticsTaskFilterModalProps> = ({ open, value, onChange, onClose }) => {
  const [draftFilter, setDraftFilter] = useState<FilterState>(value)

  useEffect(() => {
    if (open) {
      setDraftFilter(value)
    }
  }, [open, value])

  const handleFilterReset = () => {
    setDraftFilter(DEFAULT_FILTER_STATE)
    onChange(DEFAULT_FILTER_STATE)
  }

  const handleFilterApply = () => {
    onChange(draftFilter)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closable
      maskClosable={false}
      styles={{ content: { padding: 0 } }}
    >
      <div className="p-6 text-sm text-white">
        <div className="mb-6 text-xl font-bold">Filter</div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 text-[#D2D2D4]">Task Type</div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setDraftFilter((prev) => {
                    const isSubmissionSelected = prev.task_types.includes('submission')
                    const isValidationSelected = prev.task_types.includes('validation')

                    if (isSubmissionSelected) {
                      // Attempting to uncheck Submission
                      // Only allow if Validation is also selected (so we don't end up with empty)
                      if (!isValidationSelected) return prev
                      return {
                        ...prev,
                        task_types: prev.task_types.filter((t) => t !== 'submission')
                      }
                    } else {
                      // Checking Submission
                      return {
                        ...prev,
                        task_types: [...prev.task_types, 'submission']
                      }
                    }
                  })
                }
                className={cn(
                  'min-w-[110px] rounded-full border px-4 py-1.5 text-center text-sm transition-colors',
                  draftFilter.task_types.includes('submission')
                    ? 'border-transparent bg-white text-black'
                    : 'border-white/20 bg-transparent text-white/80'
                )}
              >
                Contribute
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraftFilter((prev) => {
                    const isValidationSelected = prev.task_types.includes('validation')
                    const isSubmissionSelected = prev.task_types.includes('submission')

                    if (isValidationSelected) {
                      // Attempting to uncheck Validation
                      // Only allow if Submission is also selected
                      if (!isSubmissionSelected) return prev
                      return {
                        ...prev,
                        task_types: prev.task_types.filter((t) => t !== 'validation')
                      }
                    } else {
                      // Checking Validation
                      return {
                        ...prev,
                        task_types: [...prev.task_types, 'validation']
                      }
                    }
                  })
                }
                className={cn(
                  'min-w-[110px] rounded-full border px-4 py-1.5 text-center transition-colors',
                  draftFilter.task_types.includes('validation')
                    ? 'border-transparent bg-white text-black'
                    : 'border-white/20 bg-transparent text-white/80'
                )}
              >
                Review
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end gap-4">
          <Button type="text" onClick={handleFilterReset} className="h-[44px] w-[120px] rounded-full">
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleFilterApply}
            className="h-[44px] rounded-full bg-[#875DFF] px-8 font-semibold text-white shadow-[none] hover:bg-[#9C76FF]"
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RoboticsTaskFilterModal
