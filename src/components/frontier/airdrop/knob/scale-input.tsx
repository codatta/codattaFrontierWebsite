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
    <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf640] bg-[#1a1a1a] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)]">
      <h2 className="mb-4 flex items-center gap-2 border-l-[3px] border-[#6366f1] pl-3 text-lg font-bold">
        Fill Scale Value
      </h2>

      {pointer ? (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-[#a78bfa]">Scale Value Indicated by Pointer</label>
          <Input
            value={scaleValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., 60 min"
            className="w-full rounded-lg border border-[#8b5cf64d] bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 hover:border-[#8b5cf6] focus:border-[#8b5cf6]"
          />
        </div>
      ) : (
        <div className="py-10 text-center text-[#888]">Please complete pointer position annotation first</div>
      )}
    </div>
  )
}

export default ScaleInput
