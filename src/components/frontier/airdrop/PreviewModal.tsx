import React from 'react'
import { X } from 'lucide-react'

interface PreviewModalProps {
  open: boolean
  image: string
  onClose: () => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, image, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <img src={image} className="max-h-[90vh] max-w-[90vw] object-contain" alt="Preview" />
      <button
        type="button"
        onClick={onClose}
        className="group absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
      >
        <X className="size-6 text-white" />
      </button>
    </div>
  )
}

export default PreviewModal
