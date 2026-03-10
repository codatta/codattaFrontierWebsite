import XIcon from '@/assets/common/close-icon.svg?react'
import { cn } from '@udecode/cn'

export default function CloseIcon({ onClick, className }: { onClick: () => void; className?: string }) {
  console.log('yes')
  return (
    <div
      className={cn(
        'flex size-[44px] cursor-pointer items-center justify-center rounded-full bg-white backdrop-blur-[20px]',
        className
      )}
      onClick={onClick}
    >
      <XIcon />
    </div>
  )
}
