import { useState, ReactNode } from 'react'
import { Camera, X } from 'lucide-react'
import { cn } from '@udecode/cn'
import { message } from 'antd'
import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'

interface UploadedImage {
  url: string
  hash: string
}

interface ImageUploadProps {
  value: UploadedImage[]
  allUploadedImages: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxCount?: number
  label?: string
  description?: string | ReactNode
  itemClassName?: string
  className?: string
  disabled?: boolean
}

export default function ImageUpload({
  value = [],
  allUploadedImages = [],
  onChange,
  maxCount = 1,
  label,
  description,
  itemClassName,
  className,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      message.error('Image must be in PNG, JPEG, or JPG format.')
      return
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      message.error('Image size must be less than 10MB')
      return
    }

    // Create preview URL immediately
    const blobUrl = URL.createObjectURL(file)
    setPreviewUrl(blobUrl)
    setUploading(true)

    try {
      // Calculate file hash
      const hash = await calculateFileHash(file)

      // Check for duplicates
      const existingHashes = new Set(allUploadedImages.map((img) => img.hash))
      if (existingHashes.has(hash)) {
        message.error('This image has already been uploaded.')
        setUploading(false)
        setPreviewUrl('')
        URL.revokeObjectURL(blobUrl)
        return
      }

      // Upload to CDN
      const res = await commonApi.uploadFile(file)
      if (!res || !res.file_path) {
        throw new Error('Failed to upload image')
      }

      const newImage: UploadedImage = {
        url: res.file_path, // Use CDN URL
        hash
      }

      if (maxCount === 1) {
        onChange([newImage])
      } else {
        onChange([...value, newImage].slice(0, maxCount))
      }

      // Clean up blob URL
      URL.revokeObjectURL(blobUrl)
      setPreviewUrl('')
      setUploading(false)
    } catch (error) {
      console.error('Upload error:', error)
      message.error(error instanceof Error ? error.message : 'Failed to upload image')
      URL.revokeObjectURL(blobUrl)
      setPreviewUrl('')
      setUploading(false)
    }

    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const canUploadMore = value.length < maxCount

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="block text-[15px] font-medium text-[#A0A0A0]">{label}</label>}

      <div className="flex flex-wrap gap-4">
        {value.map((image, index) => (
          <div key={index} className="relative">
            <div className={cn('overflow-hidden', itemClassName || 'size-[120px] rounded-[20px]')}>
              <img src={image.url} alt={`Upload ${index + 1}`} className="size-full object-cover" />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-[-8px] top-[-8px] flex size-[28px] items-center justify-center rounded-full bg-[#999999] text-white transition-colors hover:bg-[#666666]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        {canUploadMore && !disabled && (
          <label
            className={cn(
              'relative cursor-pointer overflow-hidden transition-colors',
              itemClassName || 'flex size-[107px] items-center rounded-[20px] bg-[#F5F5F5] hover:bg-[#EBEBEB]'
            )}
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              disabled={uploading || disabled}
              className="hidden"
            />
            {uploading && previewUrl ? (
              <>
                {/* Background image */}
                <img src={previewUrl} alt="Uploading preview" className="absolute inset-0 size-full object-cover" />
                {/* Loading overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              </>
            ) : description ? (
              description
            ) : (
              <Camera size={24} className="text-[#999999]" strokeWidth={1.5} />
            )}
          </label>
        )}
      </div>
    </div>
  )
}
