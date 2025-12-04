import React, { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import { message, Spin } from 'antd'
import { cn } from '@udecode/cn'

import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'

export interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
  file?: File
  fileName?: string
  fileSize?: number
}

interface UploadProps {
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  error?: string
  description?: string | React.ReactNode
  maxCount?: number
  className?: string
}

const FoodAnnotationUpload: React.FC<UploadProps> = ({ value = [], onChange, error, maxCount = 5, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const processFiles = async (files: FileList) => {
    if (value.length + files.length > maxCount) {
      message.error(`You can only upload a maximum of ${maxCount} images.`)
      return
    }

    const existingHashes = new Set(value.map((img) => img.hash))
    const filesToProcess = Array.from(files).slice(0, maxCount - value.length)

    for (const file of filesToProcess) {
      try {
        setUploading(true)

        // Validate file
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Image ${file.name} size must be less than 10MB`)
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (!allowedTypes.includes(file.type.toLowerCase())) {
          throw new Error(`Image ${file.name} must be in PNG, JPEG, or JPG format.`)
        }

        // Calculate hash
        const hash = await calculateFileHash(file)
        if (existingHashes.has(hash)) {
          message.error(`Image ${file.name} has already been uploaded.`)
          continue
        }

        // Upload file
        const res = await commonApi.uploadFile(file)

        // Add to state
        const newImage: UploadedImage = {
          url: res.file_path,
          hash,
          status: 'done',
          fileName: file.name,
          fileSize: file.size
        }

        onChange([...value, newImage])
        existingHashes.add(hash)
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An unknown error occurred.')
      } finally {
        setUploading(false)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    processFiles(e.target.files)
  }

  const removeImage = (hashToRemove: string) => {
    onChange(value.filter((image) => image.hash !== hashToRemove))
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('', className)}>
      <Spin spinning={uploading}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageUpload}
          multiple={maxCount > 1}
          className="hidden"
          style={{ display: 'none' }}
        />

        <div className="grid grid-cols-3 gap-2">
          {value.map((image) => (
            <div key={image.hash} className="relative">
              <div className="aspect-[1/1] overflow-hidden rounded-2xl bg-[#F5F5F5]">
                <img src={image.url} className="block size-full object-cover" alt={image.fileName} />
              </div>
              <button
                type="button"
                onClick={() => removeImage(image.hash)}
                className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-[#999999]/80 text-white hover:bg-[#999999]"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          ))}

          {value.length < maxCount && (
            <div
              onClick={handleClick}
              className={cn(
                'flex aspect-[1/1] cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#F5F5F5] transition-opacity hover:opacity-80',
                error && 'border border-red-400'
              )}
            >
              <Camera className="size-9 text-[#999999]" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </Spin>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default FoodAnnotationUpload
