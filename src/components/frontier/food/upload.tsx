import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { message, Spin } from 'antd'
import { calculateFileHash } from '@/utils/file-hash'
import commonApi from '@/api-v1/common.api'
import { cn } from '@udecode/cn'

export interface UploadedImage {
  url: string
  hash: string
}

interface FoodUploadProps {
  value: UploadedImage[]
  onChange: (value: UploadedImage[]) => void
  error?: string
}

const FoodUpload: React.FC<FoodUploadProps> = ({ value, onChange, error }) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const file = files[0]
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

  const removeImage = () => {
    onChange([])
  }

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Food Image<span className="text-red-400">*</span>
      </label>
      <Spin spinning={uploading}>
        {value.length === 0 ? (
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
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
              Photos of ready-to-eat dishes (homemade or restaurant-made) <br />
              Excludes: Raw ingredients & packaged products
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3">
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

export default FoodUpload
