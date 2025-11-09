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
  className?: string
  onChange: (value: UploadedImage[]) => void
}

const Upload: React.FC<UploadProps> = ({ value, onChange, error, description, className }) => {
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('Upload value changed:', value)
    // This effect is to clear the local file state if the parent form clears the value
    if (value.length === 0) {
      console.log('Clearing imageFile because value is empty')
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
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      message.error('Please upload an image in PNG, JPEG, or JPG format.')
      return
    }

    setUploading(true)
    try {
      const hash = await calculateFileHash(file)
      const res = await commonApi.uploadFile(file)
      onChange([{ url: res.file_path, hash }])
      setImageFile(file)
      console.log('file', file)
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <Spin spinning={uploading} wrapperClassName="w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          style={{ display: 'none' }}
        />

        {value.length === 0 ? (
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={cn(
              'flex size-[100px] cursor-pointer flex-col items-center justify-center rounded-md bg-[#404049] transition-colors',
              error && 'border-red-500'
            )}
          >
            <Plus className={cn('size-6 text-white', uploading && 'text-white/20')} />
            {description && <p className="mt-3 text-sm">{description}</p>}
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-3">
            {imageFile && (
              <div className="flex h-[100px] shrink-0 items-center gap-3">
                <img
                  src={imageFile ? createImagePreview(imageFile) : value[0].url}
                  className="size-[100px] rounded-md object-cover"
                  alt={imageFile?.name || 'Uploaded image'}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-white">{imageFile.name}</p>
                  <p className="text-xs text-white/50">{formatFileSize(imageFile.size)}</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeImage}
              className="group rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="size-5 text-gray-400 group-hover:text-red-400" />
            </button>
          </div>
        )}
      </Spin>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default Upload
