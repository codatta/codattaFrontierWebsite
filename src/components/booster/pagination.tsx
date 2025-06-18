import { cn } from '@udecode/cn'

export function Pagination({ index, total }: { index: number; total: number }) {
  return (
    <ul className={cn('mt-6 flex items-center justify-center gap-6', total <= 1 ? 'hidden' : '')}>
      {Array.from({ length: total }, (_, i) => i + 1).map((_, index2) => (
        <li
          key={'pagination-' + index2}
          className={cn('h-[2px] w-[48px] rounded-full', index2 === index ? 'bg-[#875DFF]' : 'bg-[#252532]')}
        ></li>
      ))}
    </ul>
  )
}
