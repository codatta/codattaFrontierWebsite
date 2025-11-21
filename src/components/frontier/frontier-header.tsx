import { cn } from '@udecode/cn'
import { ArrowLeft } from 'lucide-react'

interface FrontierHeaderProps {
  title: string
  left?: React.ReactNode
  className?: string
}

export default function FrontierHeader(props: FrontierHeaderProps) {
  const { title, left, className } = props
  return (
    <div className={cn('flex h-[84px] items-center justify-between border-b border-white/10 px-6 py-4', className)}>
      <div
        className="flex w-[80px] cursor-pointer items-center gap-2 text-white"
        onClick={() => {
          window.history.back()
        }}
      >
        <ArrowLeft className="text-white"></ArrowLeft> Back
      </div>
      <div className="font-bold">{title}</div>
      <div className="flex w-[80px] items-center justify-end">{left}</div>
    </div>
  )
}
