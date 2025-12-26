import React from 'react'
import UploadImg, { UploadedImage } from '../UploadImg'

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  onShowModal: (src: string) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, onShowModal }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf640] bg-[#1a1a1a] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)]">
      <div className="absolute inset-x-0 top-0 h-[3px] animate-pulse bg-gradient-to-r from-[#8b5cf6] via-[#667eea] to-[#8b5cf6] bg-[length:200%_100%]" />
      <h2 className="mb-4 flex items-center gap-2 border-l-[3px] border-[#6366f1] pl-3 text-lg font-bold">
        Upload Image
      </h2>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#a78bfa]">Example: Original Image</div>
          <div
            className="flex h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#8b5cf64d] bg-black/30 transition-colors hover:border-[#8b5cf680]"
            onClick={() => onShowModal('https://static.codatta.io/static/images/knob_raw_1766728031053.jpg')}
          >
            <img
              src="https://static.codatta.io/static/images/knob_raw_1766728031053.jpg"
              alt="Example"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="h-[400px] w-full">
          <UploadImg
            value={value}
            onChange={onChange}
            maxCount={1}
            className="size-full"
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
  )
}

export default ImageUploader
