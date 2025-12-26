import React from 'react'
import { Input } from 'antd'
import { Point } from './types'

interface ScaleInputProps {
  pointer: Point | null
  scaleValue: string
  onChange: (value: string) => void
}

const ScaleInput: React.FC<ScaleInputProps> = ({ pointer, scaleValue, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="block">
        <h2 className="text-sm font-medium">
          Step 4: Fill Scale Value<span className="text-red-400">*</span>
        </h2>
        <p className="mt-1 text-xs text-[#a0a0a0]">Enter the scale value indicated by the pointer</p>
      </div>

      {pointer ? (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Scale Value Indicated by Pointer</label>
          <Input
            value={scaleValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., 60 min"
            className="w-full rounded-lg border-none bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 hover:bg-white/10 focus:border-blue-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#FFFFFF1F] py-8 text-center text-xs text-[#888]">
          Please complete pointer position annotation first
        </div>
      )}
    </div>
  )
}

export default ScaleInput
