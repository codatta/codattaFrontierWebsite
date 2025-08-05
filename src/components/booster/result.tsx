import { motion } from 'framer-motion'
import Header from '@/components/booster/header'

import completeBg from '@/assets/booster/task-complete-bg.png'
import QuizIcon from '@/assets/booster/quiz-success.svg?react'

export default function Result({ title = 'Introduction and Quiz' }: { title?: string }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.div className="relative z-10" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={headerVariants}>
          <Header title={title} />
        </motion.div>
        <motion.div
          className="mx-auto mt-[80px] w-fit"
          variants={iconVariants}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        >
          <QuizIcon />
        </motion.div>
        <motion.h2 className="mt-8 text-center text-xl font-bold leading-9" variants={textVariants}>
          Task Completed!
        </motion.h2>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-screen w-screen bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${completeBg})` }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}
