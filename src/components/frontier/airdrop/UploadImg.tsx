import React, { useState, useRef } from 'react'
import { Plus, X, Eye, AlertCircle } from 'lucide-react'
import { message, Spin } from 'antd'
import { cn } from '@udecode/cn'

import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'

export interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
  file?: File // Keep the original file object for preview
}

interface UploadProps {
  value: UploadedImage[]
  allUploadedImages?: UploadedImage[] // All images for cross-validation
  error?: string
  description?: string | React.ReactNode
  className?: string
  onChange: (value: UploadedImage[]) => void
  maxCount?: number
}

const Upload: React.FC<UploadProps> = ({
  value = [],
  allUploadedImages = [],
  onChange,
  error,
  description,
  className,
  maxCount = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const processFiles = async (files: FileList) => {
    if (value.length + files.length > maxCount) {
      message.error(`You can only upload a maximum of ${maxCount} images.`)
      return
    }

    const existingHashes = new Set(allUploadedImages.map((img) => img.hash))
    const filesToProcess = Array.from(files).slice(0, maxCount - value.length)
    const newUploadingImages: UploadedImage[] = []
    const filesToUpload: File[] = []

    for (const file of filesToProcess) {
      try {
        const hash = await calculateFileHash(file)
        if (existingHashes.has(hash)) {
          message.error(`Image ${file.name} has already been uploaded.`)
          continue // Skip this file
        }

        // Add to list for processing
        newUploadingImages.push({
          url: URL.createObjectURL(file),
          hash: `uploading-${file.name}-${Date.now()}`,
          status: 'uploading',
          file
        })
        filesToUpload.push(file)
        existingHashes.add(hash) // Add new hash to prevent duplicate uploads in the same batch
      } catch (err) {
        message.error(err instanceof Error ? err.message : `Failed to process ${file.name}.`)
      }
    }

    if (newUploadingImages.length === 0) return

    // Add files to state with 'uploading' status first
    onChange([...value, ...newUploadingImages])

    // Process each file
    let currentImages = [...value, ...newUploadingImages]
    for (const image of newUploadingImages) {
      try {
        if (!image.file) throw new Error('File not found')

        if (image.file.size > 10 * 1024 * 1024) throw new Error(`Image ${image.file.name} size must be less than 10MB`)

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (!allowedTypes.includes(image.file.type.toLowerCase()))
          throw new Error(`Image ${image.file.name} must be in PNG, JPEG, or JPG format.`)

        const hash = await calculateFileHash(image.file)
        const res = await commonApi.uploadFile(image.file)

        // Update the specific image from 'uploading' to 'done'
        currentImages = currentImages.map((img) =>
          img.hash === image.hash ? { ...img, url: res.file_path, hash, status: 'done', file: undefined } : img
        )
        onChange(currentImages)
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An unknown error occurred.')
        // Update the specific image to 'error' status
        currentImages = currentImages.map((img) => (img.hash === image.hash ? { ...img, status: 'error' } : img))
        onChange(currentImages)
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  const removeImage = (hashToRemove: string) => {
    onChange(value.filter((image) => image.hash !== hashToRemove))
  }

  const handlePreview = (image: UploadedImage) => {
    setPreviewImage(image.url)
    setPreviewOpen(true)
  }

  const uploadButton = (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        'flex aspect-[1/1] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#FFFFFF1F] px-3 text-center text-[#606067] transition-colors hover:border-[#875DFF]',
        !value.length && 'aspect-auto block border-solid py-6',
        error && 'border-red-500'
      )}
    >
      <Plus className="mx-auto mb-2 block size-6" />
      <div className="text-xs">{description || 'Upload'}</div>
    </div>
  )

  return (
    <>
      {value.length ? (
        <div className={cn('grid grid-cols-3 gap-4 md:grid-cols-5', className)}>
          {value.map((image) => (
            <div key={image.hash} className="group relative aspect-[1/1] w-full overflow-hidden rounded-lg">
              <img src={image.url} className="size-full object-cover" alt="upload preview" />

              {/* Centered Preview Icon on Hover */}
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handlePreview(image)}
              >
                <Eye className="size-6 text-white" />
              </div>

              {/* Top-right Delete Icon on Hover */}
              <button
                type="button"
                onClick={() => removeImage(image.hash)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-all hover:bg-red-500 group-hover:opacity-100"
              >
                <X className="size-4" />
              </button>

              {image.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <Spin />
                </div>
              )}

              {image.status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 text-white">
                  <AlertCircle className="size-6" />
                  <span className="mt-1 text-xs">Error</span>
                </div>
              )}
            </div>
          ))}

          {value.length < maxCount && uploadButton}
        </div>
      ) : (
        uploadButton
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleImageUpload}
        className="hidden"
        multiple
      />

      {/* Full-screen preview modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewOpen(false)}
        >
          <img src={previewImage} className="max-h-[90vh] max-w-[90vw] object-contain" alt="Preview" />
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            className="group absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
          >
            <X className="size-6 text-white" />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </>
  )
}

export default Upload
