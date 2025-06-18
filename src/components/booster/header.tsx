import ArrowLeftIcon from '@/assets/booster/arrow-left-s-line.svg?react'
import { cn } from '@udecode/cn'

export default function Header({ title, className }: { title: string; className?: string }) {
  return (
    <header className={cn('flex items-center gap-3 py-3', className)}>
      <ArrowLeftIcon />
      <span className="text-base font-bold">{title}</span>
    </header>
  )
}
