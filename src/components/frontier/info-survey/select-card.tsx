import { motion } from 'framer-motion'
import { cn } from '@udecode/cn'
import { CircleCheck } from 'lucide-react'

import { type Option, type AnswerKey } from './quiz'

interface SelectCardProps {
  title: string
  question: string
  options: Option[]
  selectedKey: AnswerKey
  showCheck?: boolean
  onChange: (selectedKey: AnswerKey) => void
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function SelectCard({ title, question, options, selectedKey, onChange, className }: SelectCardProps) {
  const handleSelect = (selectedKey: AnswerKey) => {
    onChange(selectedKey)
  }

  return (
    <motion.div
      className={cn('w-full text-base', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className="mb-2 font-bold text-white" variants={itemVariants}>
        {title}
      </motion.h3>
      <motion.div
        className="rounded-xl border border-[#00000029] bg-[#252532] px-4 py-3 md:px-6 md:py-5 md:text-sm"
        variants={itemVariants}
      >
        <motion.p className="text-[#BBBBBE]" variants={itemVariants}>
          {question}
        </motion.p>
        <motion.ul className="mt-3 space-y-3 md:mt-4 md:space-y-4" variants={itemVariants}>
          {options.map((option, i) => {
            const isSelected = selectedKey === option.value
            const isDisabled = selectedKey !== ''
            // const optionPrefix = String.fromCharCode(65 + i) // A, B, C...

            return (
              <motion.li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-xl border border-solid border-[#FFFFFF1F] bg-transparent px-4 py-[10px] transition-colors md:rounded-lg md:py-3',
                  {
                    'border-white bg-white !text-[#252532]': isSelected
                  }
                )}
              >
                {option.label}
                {isSelected ? (
                  <CircleCheck className="ml-2 hidden md:block" fill="black" stroke="white" size={20} />
                ) : (
                  <span />
                )}
              </motion.li>
            )
          })}
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}
