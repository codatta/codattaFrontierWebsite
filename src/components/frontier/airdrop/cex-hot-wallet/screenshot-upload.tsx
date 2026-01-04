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
    <div className="mb-6 flex flex-col gap-3">
      {/* Label is removed here as it is usually handled by the StepContainer title/description or passed as label prop if needed for specific inputs, 
          but for ScreenshotUpload acting as the main content of a step, we might want to hide the label if it's redundant with the step title.
          However, keeping it minimal as per request. The Knob ImageUploader doesn't have a separate label above the grid, it puts "Step 1..." in the header. 
          Here we keep the label if provided but minimal.
      */}
      {label && (
        <label className="flex items-center gap-1 text-xs font-medium text-[#d0d0d0]">
          {label}
          {required && <span className="text-red-500">*</span>}
          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-[#facc15]/90 bg-[#0f172f]/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#facc15] shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <span className="size-1.5 rounded-full bg-[#facc15] shadow-[0_0_0_3px_rgba(250,204,21,0.4)]" />
            Key evidence
          </span>
        </label>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Example Image Section */}
        <div className="flex flex-col space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Example Screenshot</div>
          <div
            className="w-full flex-1 cursor-pointer overflow-hidden rounded-lg border border-[#FFFFFF1F] bg-black/30 transition-all hover:border-[#8b5cf680]"
            onClick={() => onShowModal(exampleImage)}
          >
            <img src={exampleImage} alt="Example" className="block size-full object-contain" />
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Your Screenshot</div>
          <div className="min-h-[200px] flex-1">
            <UploadImg
              value={value}
              onChange={onChange}
              maxCount={1}
              className="size-full rounded-lg border border-[#FFFFFF1F]"
              itemClassName="h-full w-full !max-w-none !min-w-0 !aspect-auto"
              description={
                <div className="flex flex-col items-center">
                  <span className="mb-2 text-lg font-semibold text-white">Click or Drop to Upload</span>
                  <span className="text-xs text-gray-400">Supports JPG, PNG</span>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {hint && <div className="mt-1 text-[11px] text-[#888888]">{hint}</div>}
    </div>
  )
}
