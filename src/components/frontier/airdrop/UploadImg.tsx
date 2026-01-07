import React, { useState, useRef } from 'react'
import { Plus, Trash, Eye, AlertCircle, FileText } from 'lucide-react'
import { message, Spin, Modal } from 'antd'
import { cn } from '@udecode/cn'

import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file-hash'

export interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
  file?: File // Keep the original file object for preview
  fileType?: string // Store file type for rendering
  fileName?: string // Store file name
  fileSize?: number // Store file size in bytes
}

export type UploadChangeType = 'uploading' | 'done' | 'error' | 'removed'

export interface UploadChangeContext {
  type: UploadChangeType
  item?: UploadedImage
}

interface UploadProps {
  value: UploadedImage[]
  allUploadedImages?: UploadedImage[] // All images for cross-validation
  error?: string
  description?: string | React.ReactNode
  supportPdf?: boolean
  className?: string
  itemClassName?: string
  onChange: (value: UploadedImage[], context?: UploadChangeContext) => void
  maxCount?: number
}

const Upload: React.FC<UploadProps> = ({
  value = [],
  allUploadedImages = [],
  onChange,
  error,
  description,
  supportPdf = false,
  maxCount = 5,
  className,
  itemClassName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewFileType, setPreviewFileType] = useState('')

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
          file,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size
        })
        filesToUpload.push(file)
        existingHashes.add(hash) // Add new hash to prevent duplicate uploads in the same batch
      } catch (err) {
        message.error(err instanceof Error ? err.message : `Failed to process ${file.name}.`)
      }
    }

    if (newUploadingImages.length === 0) return

    // Add files to state with 'uploading' status first
    onChange([...value, ...newUploadingImages], {
      type: 'uploading',
      item: newUploadingImages[0]
    })

    // Process each file
    let currentImages = [...value, ...newUploadingImages]
    for (const image of newUploadingImages) {
      try {
        if (!image.file) throw new Error('File not found')

        if (image.file.size > 10 * 1024 * 1024) throw new Error(`Image ${image.file.name} size must be less than 10MB`)

        const allowedTypes = supportPdf
          ? ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
          : ['image/png', 'image/jpeg', 'image/jpg']
        if (!allowedTypes.includes(image.file.type.toLowerCase()))
          throw new Error(`Image ${image.file.name} must be in ${supportPdf ? 'PDF, ' : ''}PNG, JPEG, or JPG format.`)

        const hash = await calculateFileHash(image.file)
        const res = await commonApi.uploadFile(image.file)

        // Update the specific image from 'uploading' to 'done'
        let updatedItem: UploadedImage | undefined
        currentImages = currentImages.map((img) => {
          if (img.hash === image.hash) {
            updatedItem = {
              ...img,
              url: res.file_path,
              hash,
              status: 'done',
              file: undefined, // Free memory
              fileType: image.file?.type,
              fileName: image.fileName,
              fileSize: image.fileSize
            }
            return updatedItem
          }
          return img
        })
        onChange(currentImages, { type: 'done', item: updatedItem })
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An unknown error occurred.')
        // Remove the failed image from the list
        const failedItem = currentImages.find((img) => img.hash === image.hash)
        const errorItem = failedItem ? { ...failedItem, status: 'error' as const } : undefined

        currentImages = currentImages.filter((img) => img.hash !== image.hash)
        onChange(currentImages, { type: 'error', item: errorItem })
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
    const removedItem = value.find((image) => image.hash === hashToRemove)
    onChange(
      value.filter((image) => image.hash !== hashToRemove),
      { type: 'removed', item: removedItem }
    )
  }

  const handlePreview = (image: UploadedImage) => {
    setPreviewImage(image.url)
    setPreviewFileType(image.fileType || '')
    setPreviewOpen(true)
  }

  const isPdf = (fileType?: string) => fileType === 'application/pdf'

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const UploadButton = () => (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        'flex h-[130px] min-w-[212px] flex-1 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#FFFFFF1F] px-3 text-center text-[#606067] transition-colors hover:border-[#875DFF]',
        !value.length && 'aspect-auto border-solid py-6',
        error && 'border-red-500',
        itemClassName
      )}
    >
      <div>
        <Plus className="mx-auto mb-2 block size-6" />
        <div className="text-xs">{description || 'Upload'}</div>
      </div>
    </div>
  )

  return (
    <>
      <div className={cn('flex items-center gap-4', className)}>
        {value.map((image) => (
          <div
            key={image.hash}
            className={cn(
              'group relative h-[130px] w-[212px] overflow-hidden rounded-lg border border-[#FFFFFF1F]',
              itemClassName
            )}
          >
            {isPdf(image.fileType) ? (
              <div className="flex size-full flex-col items-center justify-center gap-2 bg-gray-800 p-3">
                <FileText className="size-12 text-gray-400" />
                <div className="w-full text-center">
                  <p className="truncate text-xs text-gray-300" title={image.fileName}>
                    {image.fileName}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.fileSize)}</p>
                </div>
              </div>
            ) : (
              <img src={image.url} className="size-full object-contain" alt="upload preview" />
            )}

            {/* Centered Preview Icon on Hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Eye className="size-6 cursor-pointer text-white" onClick={() => handlePreview(image)} />{' '}
              <Trash className="size-4 cursor-pointer text-white" onClick={() => removeImage(image.hash)} />
            </div>

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
        {value.length < maxCount && <UploadButton />}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={`image/png,image/jpeg,image/jpg${supportPdf ? ',application/pdf' : ''}`}
        onChange={handleImageUpload}
        className="hidden"
        multiple
        style={{ display: 'none' }}
      />

      {/* Preview modal */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={isPdf(previewFileType) ? '90vw' : '80vw'}
        centered
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: '85vh',
            overflow: 'hidden'
          }
        }}
      >
        {isPdf(previewFileType) ? (
          <iframe src={previewImage} className="h-[80vh] w-full" title="PDF Preview" />
        ) : (
          <img
            src={previewImage}
            className="max-h-[80vh] max-w-full object-contain"
            alt="Preview"
            style={{ display: 'block' }}
          />
        )}
      </Modal>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </>
  )
}

export default Upload
