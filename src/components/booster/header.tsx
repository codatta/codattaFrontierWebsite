import { motion } from 'framer-motion'
// import ArrowLeftIcon from '@/assets/booster/arrow-left-s-line.svg?react'
import { cn } from '@udecode/cn'

export default function Header({ title, className }: { title: string; className?: string }) {
  const headerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  }

  return (
    <motion.header className={cn('flex items-center justify-center gap-3 py-3', className)} variants={headerVariants}>
      {/* <motion.div variants={itemVariants}>
        <ArrowLeftIcon />
      </motion.div> */}
      <motion.span className="text-base font-bold" variants={itemVariants}>
        {title}
      </motion.span>
    </motion.header>
  )
}
