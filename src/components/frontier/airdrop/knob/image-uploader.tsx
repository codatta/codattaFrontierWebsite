import React from 'react'
import UploadImg, { UploadedImage } from '../UploadImg'

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  onShowModal: (src: string) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, onShowModal }) => {
  return (
    <div className="space-y-3">
      <div className="block">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          Step 1: Upload Knob Photo<span className="text-red-400">*</span>
          {value && value.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
              ✓
            </span>
          )}
        </h2>
        <p className="mt-1 text-xs text-[#a0a0a0]">Please upload a clear front-facing photo of an appliance knob</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Example: Original Image</div>
          <div
            className="flex h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#FFFFFF1F] bg-black/30 transition-colors hover:border-[#8b5cf680]"
            onClick={() => onShowModal('https://static.codatta.io/static/images/knob_raw_1766728031053.jpg')}
          >
            <img
              src="https://static.codatta.io/static/images/knob_raw_1766728031053.jpg"
              alt="Example"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Your Image</div>
          <div className="h-[400px] w-full">
            <UploadImg
              value={value}
              onChange={onChange}
              maxCount={1}
              className="size-full rounded-lg border border-[#FFFFFF1F]"
              itemClassName="h-full w-full !max-w-none !min-w-0 !aspect-auto"
              description={
                <div className="flex flex-col items-center">
                  <span className="mb-2 text-lg font-semibold">Click or Drop to Upload</span>
                  <span className="text-xs text-gray-400">Supports JPG, PNG</span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
