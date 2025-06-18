import { motion } from 'framer-motion'
import { cn } from '@udecode/cn'

export function Pagination({ index, total }: { index: number; total: number }) {
  return (
    <ul className={cn('mt-6 flex items-center justify-center gap-6', total <= 1 ? 'hidden' : '')}>
      {Array.from({ length: total }, (_, i) => i + 1).map((_, index2) => (
        <li key={'pagination-' + index2} className={cn('relative h-[2px] w-[48px] rounded-full bg-[#252532]')}>
          {index2 === index && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#875DFF]"
              layoutId="pagination-active"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
