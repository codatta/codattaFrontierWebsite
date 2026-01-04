import React from 'react'
import UploadImg, { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

interface ScreenshotUploadProps {
  label: string
  exampleImage: string
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  onShowModal: (src: string) => void
  hint?: string
  required?: boolean
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
  label,
  exampleImage,
  value,
  onChange,
  onShowModal,
  hint,
  required = true
}) => {
  return (
    <div className="mb-3 flex flex-col gap-2">
      <label className="flex items-center gap-1 text-[13px] font-semibold text-[#d0d0d0]">
        {label}
        {required && <span className="text-red-500">*</span>}
        <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-[#facc15]/90 bg-[#0f172f]/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#facc15] shadow-[0_0_10px_rgba(251,191,36,0.1)]">
          <span className="size-1.5 rounded-full bg-[#facc15] shadow-[0_0_0_3px_rgba(250,204,21,0.4)]" />
          Key evidence
        </span>
      </label>

      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="text-[13px] font-semibold text-[#a78bfa]">Example Screenshot:</div>
          <div
            className="w-full cursor-pointer overflow-hidden rounded-lg border border-[#8b5cf64d] bg-black/30 transition-all hover:scale-[1.01] hover:border-[#8b5cf680]"
            onClick={() => onShowModal(exampleImage)}
          >
            <img src={exampleImage} alt="Example" className="block max-h-[400px] w-full object-contain" />
          </div>
        </div>

        <div className="h-full min-h-[200px]">
          <UploadImg
            value={value}
            onChange={onChange}
            maxCount={1}
            className="size-full rounded-lg border border-dashed border-[#8b5cf64d] bg-black/30 hover:bg-black/40"
            itemClassName="h-full w-full !max-w-none !min-w-0 !aspect-auto"
            description={
              <div className="flex flex-col items-center">
                <span className="mb-1 text-base">📷</span>
                <span className="text-sm font-semibold text-white">Upload screenshot</span>
                <span className="text-xs text-gray-400">No image selected</span>
              </div>
            }
          />
        </div>
      </div>

      {hint && <div className="mt-0.5 text-[11px] text-[#888888]">{hint}</div>}
    </div>
  )
}
