import { ArrowLeft } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@udecode/cn'

export default function Header({ title, className }: { title: string; className?: string }) {
  const isMobile = useIsMobile()
  const onBack = () => {
    window.history.back()
  }

  return (
    <div className="relative z-10 mb-12 border-[#FFFFFF1F] py-3 md:border-b md:py-6">
      <h1
        className={cn(
          'mx-auto flex max-w-[1352px] items-center justify-between px-10 text-center text-base font-bold',
          className
        )}
      >
        {!isMobile ? (
          <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
            <ArrowLeft size={18} /> Back
          </div>
        ) : (
          <span></span>
        )}
        {title}
        <span></span>
      </h1>
    </div>
  )
}
