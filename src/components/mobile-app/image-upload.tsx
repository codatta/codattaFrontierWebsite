import { useState, ReactNode } from 'react'
import { Camera, X } from 'lucide-react'
import { cn } from '@udecode/cn'

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
  allUploadedImages: _allUploadedImages = [],
  onChange,
  maxCount = 1,
  label,
  description,
  itemClassName,
  className,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should not exceed 10MB')
      return
    }

    setUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string

        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

        const newImage: UploadedImage = { url: imageUrl, hash }

        if (maxCount === 1) {
          onChange([newImage])
        } else {
          onChange([...value, newImage].slice(0, maxCount))
        }
        setUploading(false)
      }
      reader.onerror = () => {
        alert('Failed to read file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
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
              'relative cursor-pointer transition-colors',
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
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="size-6 animate-spin rounded-full border-2 border-[#999999] border-t-transparent" />
                <span className="text-xs text-[#999999]">Uploading...</span>
              </div>
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
