import { useRef, useState, ReactNode } from 'react'
import { Camera, X } from 'lucide-react'
import { cn } from '@udecode/cn'
import { message, Spin } from 'antd'
import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file'

export interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
  fileName?: string
  fileSize?: number
}

type ImageUploadLayout = 'flex' | 'grid'

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxCount?: number
  layout?: ImageUploadLayout
  label?: string
  description?: string | ReactNode
  error?: string
  itemClassName?: string
  className?: string
  disabled?: boolean
  /**
   * Pass the combined list of all already-uploaded images (across all slots)
   * to enable cross-slot duplicate detection by hash.
   */
  allUploadedImages?: UploadedImage[]
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
const MAX_FILE_SIZE = 10 * 1024 * 1024

async function uploadImageFile(file: File): Promise<UploadedImage> {
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(`Image ${file.name} must be in PNG, JPEG, or JPG format.`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Image ${file.name} size must be less than 10MB.`)
  }
  const hash = await calculateFileHash(file)
  const res = await commonApi.uploadFile(file)
  if (!res?.file_path) throw new Error('Failed to upload image')
  return { url: res.file_path, hash, status: 'done', fileName: file.name, fileSize: file.size }
}

export default function ImageUpload({
  value = [],
  onChange,
  maxCount = 1,
  layout = 'flex',
  label,
  description,
  error,
  itemClassName,
  className,
  disabled = false,
  allUploadedImages
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const canUploadMore = value.length < maxCount
  const isMultiple = maxCount > 1

  const getDedupeSet = () => {
    const base = allUploadedImages ?? value
    return new Set(base.map((img) => img.hash))
  }

  const handleFiles = async (files: FileList) => {
    if (!files.length) return

    if (isMultiple) {
      // Batch upload for multi-file mode
      if (value.length + files.length > maxCount) {
        message.error(`You can only upload a maximum of ${maxCount} images.`)
        return
      }
      const existingHashes = getDedupeSet()
      const filesToProcess = Array.from(files).slice(0, maxCount - value.length)
      setUploading(true)
      for (const file of filesToProcess) {
        try {
          const hash = await calculateFileHash(file)
          if (existingHashes.has(hash)) {
            message.error(`Image ${file.name} has already been uploaded.`)
            continue
          }
          const uploaded = await uploadImageFile(file)
          onChange([...value, uploaded])
          existingHashes.add(hash)
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'An unknown error occurred.')
        }
      }
      setUploading(false)
    } else {
      // Single file with preview for single-file mode
      const file = files[0]
      const blobUrl = URL.createObjectURL(file)
      setPreviewUrl(blobUrl)
      setUploading(true)
      try {
        const hash = await calculateFileHash(file)
        const existingHashes = getDedupeSet()
        if (existingHashes.has(hash)) {
          message.error('This image has already been uploaded.')
          return
        }
        const uploaded = await uploadImageFile(file)
        onChange(maxCount === 1 ? [uploaded] : [...value, uploaded].slice(0, maxCount))
        URL.revokeObjectURL(blobUrl)
        setPreviewUrl('')
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Failed to upload image')
        URL.revokeObjectURL(blobUrl)
        setPreviewUrl('')
      } finally {
        setUploading(false)
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  const handleRemove = (hash: string) => {
    onChange(value.filter((img) => img.hash !== hash))
  }

  const triggerInput = () => fileInputRef.current?.click()

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      onChange={handleChange}
      multiple={isMultiple}
      disabled={uploading || disabled}
      className="hidden"
    />
  )

  const removeButton = (hash: string) => (
    <button
      type="button"
      onClick={() => handleRemove(hash)}
      className="absolute -right-1.5 -top-1.5 flex size-[26px] items-center justify-center rounded-full bg-[#999999]/80 text-white transition-colors hover:bg-[#999999]"
    >
      <X size={15} strokeWidth={2.5} />
    </button>
  )

  const addTrigger = isMultiple ? (
    <Spin spinning={uploading}>
      <div
        onClick={triggerInput}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#F5F5F5] transition-opacity hover:opacity-80',
          layout === 'grid' ? 'aspect-[1/1]' : cn('size-[107px]', itemClassName || ''),
          error && 'border border-red-400'
        )}
      >
        <Camera className="size-9 text-[#999999]" strokeWidth={1.5} />
      </div>
    </Spin>
  ) : (
    <label
      className={cn(
        'relative cursor-pointer overflow-hidden transition-colors',
        layout === 'grid'
          ? cn(
              'flex aspect-[1/1] items-center justify-center rounded-2xl bg-[#F5F5F5] hover:opacity-80',
              error && 'border border-red-400'
            )
          : cn('flex items-center rounded-[20px] bg-[#F5F5F5] hover:bg-[#EBEBEB]', itemClassName || 'size-[107px]')
      )}
    >
      {hiddenInput}
      {uploading && previewUrl ? (
        <>
          <img src={previewUrl} alt="Uploading preview" className="absolute inset-0 size-full object-contain" />
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
  )

  if (layout === 'grid') {
    return (
      <div className={cn('', className)}>
        {isMultiple && hiddenInput}
        <div className="grid grid-cols-3 gap-2">
          {value.map((image) => (
            <div key={image.hash} className="relative">
              <div className="aspect-[1/1] overflow-hidden rounded-2xl bg-[#F5F5F5]">
                <img src={image.url} className="block size-full object-cover" alt={image.fileName} />
              </div>
              {!disabled && removeButton(image.hash)}
            </div>
          ))}
          {canUploadMore && !disabled && addTrigger}
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="block text-[15px] font-medium text-[#A0A0A0]">{label}</label>}
      {isMultiple && hiddenInput}
      <div className="flex flex-wrap gap-4">
        {value.map((image, index) => (
          <div key={image.hash || index} className="relative">
            <div className={cn('overflow-hidden', itemClassName || 'size-[120px] rounded-[20px]')}>
              <img src={image.url} alt={image.fileName || `Upload ${index + 1}`} className="size-full object-contain" />
            </div>
            {!disabled && removeButton(image.hash)}
          </div>
        ))}
        {canUploadMore && !disabled && addTrigger}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
}
