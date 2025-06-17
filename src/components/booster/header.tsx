import ArrowLeftIcon from '@/assets/booster/arrow-left-s-line.svg?react'

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-3 py-3">
      <ArrowLeftIcon />
      <span className="text-base font-bold">{title}</span>
    </header>
  )
}
