import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'

import { cn } from '@udecode/cn'

export type RoboticsTaskType = 'submission' | 'validation'

export type RoboticsFilterState = {
  taskTypes: RoboticsTaskType[]
}

const DEFAULT_ROBOTICS_FILTER_STATE: RoboticsFilterState = {
  taskTypes: ['submission', 'validation']
}

interface RoboticsTaskFilterModalProps {
  open: boolean
  value: RoboticsFilterState
  onChange: (value: RoboticsFilterState) => void
  onClose: () => void
}

const RoboticsTaskFilterModal: React.FC<RoboticsTaskFilterModalProps> = ({ open, value, onChange, onClose }) => {
  const [draftFilter, setDraftFilter] = useState<RoboticsFilterState>(value)

  useEffect(() => {
    if (open) {
      setDraftFilter(value)
    }
  }, [open, value])

  const handleFilterReset = () => {
    setDraftFilter(DEFAULT_ROBOTICS_FILTER_STATE)
    onChange(DEFAULT_ROBOTICS_FILTER_STATE)
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
                    const selected = prev.taskTypes.includes('submission')
                    return {
                      ...prev,
                      taskTypes: selected
                        ? prev.taskTypes.filter((t) => t !== 'submission')
                        : [...prev.taskTypes, 'submission']
                    }
                  })
                }
                className={cn(
                  'min-w-[110px] rounded-full border px-4 py-1.5 text-center text-sm transition-colors',
                  draftFilter.taskTypes.includes('submission')
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
                    const selected = prev.taskTypes.includes('validation')
                    return {
                      ...prev,
                      taskTypes: selected
                        ? prev.taskTypes.filter((t) => t !== 'validation')
                        : [...prev.taskTypes, 'validation']
                    }
                  })
                }
                className={cn(
                  'min-w-[110px] rounded-full border px-4 py-1.5 text-center transition-colors',
                  draftFilter.taskTypes.includes('validation')
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
