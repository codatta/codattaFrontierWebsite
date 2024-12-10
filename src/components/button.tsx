import { cn } from '@udecode/cn'
import DynamicSvg from '@/components/dynamic-svg'

export default function Button({
  children,
  className,
  isLight,
  hasArrow,
  disable,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  isLight?: boolean
  hasArrow?: boolean
  disable?: boolean
  onClick?: () => void
}) {
  return (
    <button
      disabled={disable}
      className={cn(
        'px-3 py-3 border border-[#000000] border-solid flex items-center justify-center rounded-xl text-base cursor-pointer tracking-tight',
        isLight ? 'bg-white text-black' : 'bg-black text-white',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
    >
      {children}
      {hasArrow && (
        <DynamicSvg
          iconName="arrow-up-right"
          className="w-[14px] h-[14px] m-[5px]"
        />
      )}
    </button>
  )
}
