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
  description?: string | React.ReactNode
  icon?: string
  isMobile?: boolean
  className?: string
  onChange: (value: UploadedImage[]) => void
}

const Upload: React.FC<UploadProps> = ({ value, onChange, error, description, isMobile, className, icon }) => {
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
    if (file.size > 10 * 1024 * 1024) {
      message.error('Image size must be less than 10MB')
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <Spin spinning={uploading}>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {value.length === 0 ? (
          isMobile ? (
            <div className={cn('flex items-center gap-4 rounded-xl bg-[#252532] p-3', className)} onClick={handleClick}>
              <div
                className={cn(
                  'relative size-[100px] shrink-0 overflow-hidden rounded-lg bg-[#3A3A4A] bg-gradient-to-r from-[#E3E3E3] to-[#D6D6D6] transition-colors hover:bg-[#4a4a5a]',
                  error && 'border border-red-500'
                )}
              >
                <img src={icon} alt="" className="mx-auto h-full w-auto" />
                <div className="absolute inset-0 z-10 flex size-full items-center justify-center bg-[#000000]/10">
                  <Plus className="size-6" />
                </div>
              </div>
              <div className="flex-1 text-sm leading-relaxed text-[#868686]">
                {description || 'Click to upload screenshot'}
              </div>
            </div>
          ) : (
            <div className="flex h-[130px] items-stretch gap-2">
              <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={cn(
                  'flex size-full cursor-pointer flex-col items-center justify-center rounded-lg border border-[#FFFFFF1F] py-6 text-center text-[#606067] transition-colors hover:border-dashed hover:border-[#875DFF]',
                  error && 'border-red-500'
                )}
              >
                <Plus className="mb-3 size-6" />
                <p className="text-sm">{description || 'Click to upload screenshot'}</p>
              </div>
              <div className="relative size-[130px] overflow-hidden rounded-lg bg-gradient-to-r from-[#E3E3E3] to-[#D6D6D6]">
                <img src={icon} alt="" className="mx-auto h-full w-auto" />
                <div className="absolute left-1 top-1 rounded-full bg-[#0000001F] px-1 text-xs font-semibold leading-5 text-[#1C1C26]">
                  Example
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
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
            <div className="relative hidden size-[130px] overflow-hidden rounded-lg bg-gradient-to-r from-[#E3E3E3] to-[#D6D6D6]">
              <img src={icon} alt="" className="mx-auto h-full w-auto" />
              <div className="absolute left-1 top-1 rounded-full bg-[#0000001F] px-1 text-xs font-semibold leading-5 text-[#1C1C26]">
                Example
              </div>
            </div>
          </div>
        )}
      </Spin>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default Upload
