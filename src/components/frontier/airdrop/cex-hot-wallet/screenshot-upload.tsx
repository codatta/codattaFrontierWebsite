import React from 'react'
import UploadImg, { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

interface ScreenshotUploadProps {
  label: string
  exampleImage: string
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  onShowModal: (src: string) => void
  required?: boolean
  error?: string
  hint?: string
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
  label,
  exampleImage,
  value,
  onChange,
  onShowModal,
  required = true,
  error,
  hint
}) => {
  return (
    <div className="mb-6 flex flex-col gap-2.5">
      {/* Label above the box */}
      <div className="text-sm font-semibold text-white/90">
        {label || 'Blockchain Explorer Screenshot'} {required && <span className="text-white/60">*</span>}
      </div>
      {hint && <div className="text-xs text-[#a0a0a0]">{hint}</div>}

      <div className="flex items-start gap-4">
        {/* Upload Section */}
        <div className="flex h-[180px] flex-1 flex-col">
          <UploadImg
            value={value}
            onChange={onChange}
            maxCount={1}
            className="size-full"
            itemClassName="h-full w-full !max-w-none !min-w-0 !aspect-auto !rounded-lg border-[#FFFFFF1F] hover:border-white transition-all !p-0"
            description={
              <div className="flex flex-col items-center gap-0.5 text-center text-sm leading-relaxed text-[#606067]">
                <span>Click to upload screenshot or drag and drop.</span>
                <span>
                  Supports JPG, PNG. <span className="text-white">PC Screenshot ONLY, NO Mobile UI Allowed</span>
                </span>
                <span>Full-page screenshot including: URL, TxHash, From address, and To address.</span>
              </div>
            }
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        {/* Example Image Section */}
        <div className="relative h-[180px] w-[260px] shrink-0">
          <div
            className="group relative size-full cursor-pointer overflow-hidden rounded-lg border border-[FFFFFF1F] bg-[#0C0C14] transition-all hover:border-white"
            onClick={() => onShowModal(exampleImage)}
          >
            <img
              src={exampleImage}
              alt="Example"
              className="block size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />

            {/* Example Badge */}
            <div className="absolute left-2 top-[6px] rounded-full bg-[#0000003D] px-2.5 text-xs font-semibold leading-5">
              Example
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
