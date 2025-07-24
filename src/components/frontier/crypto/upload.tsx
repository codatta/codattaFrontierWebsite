import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { message, Spin } from 'antd'
import { cn } from '@udecode/cn'

import commonApi from '@/api-v1/common.api'

import { calculateFileHash } from '@/utils/file-hash'

export interface UploadedImage {
  url: string
  hash: string
}

interface UploadProps {
  value: UploadedImage[]
  error?: string
  description?: string
  isMobile?: boolean
  className?: string
  onChange: (value: UploadedImage[]) => void
}

const Upload: React.FC<UploadProps> = ({ value, onChange, error, description, isMobile, className }) => {
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // This effect is to clear the local file state if the parent form clears the value
    if (value.length === 0) {
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [value])

  const processFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      message.error('Image size must be less than 20MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file')
      return
    }

    setUploading(true)
    try {
      const hash = await calculateFileHash(file)
      const res = await commonApi.uploadFile(file)
      onChange([{ url: res.file_path, hash }])
      setImageFile(file)
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message)
      } else {
        message.error('An unknown error occurred during upload.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    processFile(files[0])
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeImage = () => {
    onChange([])
  }

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="space-y-3">
      <Spin spinning={uploading}>
        {value.length === 0 ? (
          isMobile ? (
            <div className={cn('flex items-center gap-4 rounded-xl bg-[#252532] px-4 py-3', className)}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex size-24 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/15',
                  error && 'border border-red-500'
                )}
              >
                <Plus className="size-8" />
              </button>
              <div className="flex-1 text-sm leading-relaxed text-white/50">
                {description || 'Click to upload screenshot'}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={cn(
                'flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-white/20 bg-white/5 p-8 text-center transition-colors hover:border-dashed hover:bg-white/10',
                error && 'border-red-500'
              )}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Plus className="mb-4 size-8 text-white/50" />
              <p className="text-sm text-white/50">{description || 'Click to upload screenshot or drag and drop'}</p>
            </div>
          )
        ) : (
          <div className={cn('flex w-full items-center gap-3 rounded-lg px-4 py-6', className)}>
            {imageFile && (
              <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-white/10">
                <img src={createImagePreview(imageFile)} className="size-full object-cover" alt={imageFile.name} />
              </div>
            )}
            <div className="flex w-full items-center justify-between">
              <div className="w-full text-sm text-white">
                <div className="mb-1 line-clamp-2 max-w-[180px] font-medium">{imageFile?.name}</div>
                <div className="text-xs text-gray-400">
                  {imageFile && `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`}
                </div>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="group rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X className="size-5 text-gray-400 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        )}
      </Spin>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default Upload
