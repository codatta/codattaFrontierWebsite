import React, { useRef } from 'react'
import { Upload as UploadIcon, X } from 'lucide-react'

interface ImageUploaderProps {
  previewImage: string
  isDraggingFile: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onUpload: (file: File) => void
  onClear: () => void
  onShowModal: (src: string) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewImage,
  isDraggingFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpload,
  onClear,
  onShowModal
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

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

        <div
          className={`relative h-[400px] w-full rounded-lg border-2 ${previewImage ? 'border-solid border-[#8b5cf680]' : 'border-dashed border-[#8b5cf64d]'} ${isDraggingFile ? 'border-[#8b5cf6] bg-[#8b5cf626]' : 'bg-black/30'} flex items-center justify-center overflow-hidden transition-all hover:bg-black/40`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {!previewImage ? (
            <div
              className="flex size-full cursor-pointer flex-col items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#667eea] px-5 py-3 font-bold text-white shadow-app-btn transition-transform hover:-translate-y-0.5">
                <UploadIcon size={18} /> Upload Image
              </div>
              <div className="text-xs text-gray-400">Supports JPG, PNG formats</div>
              {isDraggingFile && <div className="mt-2 font-semibold text-[#a78bfa]">Drop image here</div>}
            </div>
          ) : (
            <div className="group relative flex size-full items-center justify-center">
              <div
                className="absolute right-2 top-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-colors hover:border-red-500 hover:bg-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
              >
                <X size={16} />
              </div>
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                onClick={() => onShowModal(previewImage)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
