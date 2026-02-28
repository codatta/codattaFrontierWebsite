import { useRef, useState } from 'react'
import { Image, Spin, message } from 'antd'
import { Plus, X, Eye } from 'lucide-react'
import { cn } from '@udecode/cn'

import commonApi from '@/api-v1/common.api'
import { calculateFileHash } from '@/utils/file'

interface CertificateUploadProps {
  value?: string
  onChange?: (url: string) => void
}

export function CertificateUpload({ value, onChange }: CertificateUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>('')

  async function processFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      message.error('Image size must be less than 10MB')
      return
    }
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type.toLowerCase())) {
      message.error('Please upload a PNG, JPEG or JPG image')
      return
    }
    setUploading(true)
    try {
      await calculateFileHash(file)
      const res = await commonApi.uploadFile(file)
      setPreview(URL.createObjectURL(file))
      onChange?.(res.file_path)
    } catch (err) {
      message.error((err as Error).message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleRemove() {
    setPreview('')
    onChange?.('')
  }

  const uploaded = !!(value || preview)

  return (
    <Spin spinning={uploading}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={handleInput}
      />

      {uploaded ? (
        <div className="relative inline-block">
          <div className="size-[120px] overflow-hidden rounded-lg border border-[rgba(255,255,255,0.12)]">
            <Image
              src={preview || value}
              alt="certificate"
              wrapperClassName="!block !size-full"
              className="!size-full !object-cover"
              preview={{
                mask: (
                  <div className="flex items-center justify-center text-white">
                    <Eye className="size-5" />
                  </div>
                )
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'flex h-[130px] cursor-pointer flex-col items-center justify-center gap-2',
            'rounded-lg border border-[rgba(255,255,255,0.12)] text-[#606067]',
            'transition-colors hover:border-dashed hover:border-[#875DFF]'
          )}
        >
          <Plus className="size-6" />
          <div className="flex flex-col items-center text-sm">
            <span>Click to upload or drag and drop</span>
            <span className="text-xs">PNG / JPEG, max 10 MB</span>
          </div>
        </div>
      )}
    </Spin>
  )
}
