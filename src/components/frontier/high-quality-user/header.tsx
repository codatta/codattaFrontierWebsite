import { ArrowLeft } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-is-mobile'

export default function Header({ title }: { title: string }) {
  const isMobile = useIsMobile()
  const onBack = () => {
    window.history.back()
  }

  return (
    <div className="relative z-10 border-[#FFFFFF1F] py-3 md:border-b md:py-6">
      <h1 className="mx-auto flex max-w-[1272px] items-center justify-between px-6 text-center text-base font-bold">
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
