import TimeForQuizIcon from '@/assets/booster/time-for-quiz.svg?react'
import { Button } from '@/components/booster/button'
import { Pagination } from '@/components/booster/pagination'
import { motion, AnimatePresence } from 'framer-motion'

import { DataItemQuiz } from './types'
import { useState } from 'react'
import { cn } from '@udecode/cn'
import { useBoosterStore } from '@/stores/booster.store'

const startContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.3 }
  }
}

const startItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function QuizStart({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.div variants={startContainerVariants} initial="hidden" animate="visible" exit="exit">
      <motion.div variants={startItemVariants}>
        <TimeForQuizIcon className="mx-auto mt-[80px]" />
      </motion.div>
      <motion.h2 className="mt-8 text-center text-2xl font-bold leading-9" variants={startItemVariants}>
        Time for a Quiz
      </motion.h2>
      <motion.p className="mt-6 text-center text-base text-[#BBBBBE]" variants={startItemVariants}>
        {count} questions
      </motion.p>
      <motion.div variants={startItemVariants}>
        <Button text="Continue" onClick={onClick} className="mt-8" />
      </motion.div>
    </motion.div>
  )
}

export function QuizCard({ quizList, onComplete }: { quizList: DataItemQuiz[]; onComplete: () => void }) {
  const [quizIndex, setQuizIndex] = useState<number>(-1)
  const onNext = () => {
    if (quizIndex < quizList.length - 1) {
      setQuizIndex(quizIndex + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {quizIndex === -1 && <QuizStart key="start" count={quizList.length} onClick={() => setQuizIndex(0)} />}
        {quizIndex >= 0 && (
          <Quiz
            key={quizIndex}
            quiz={quizList[quizIndex]}
            index={quizIndex}
            total={quizList.length}
            onComplete={onNext}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const quizContainerVariants = {
  hidden: { opacity: 0, x: '50%' },
  visible: {
    opacity: 1,
    x: '0%',
    transition: { staggerChildren: 0.1, ease: [0.4, 0, 0.2, 1], duration: 0.5 }
  },
  exit: { opacity: 0, x: '-50%', transition: { ease: [0.4, 0, 0.2, 1], duration: 0.5 } }
}

const quizItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function Quiz({
  quiz,
  index,
  total,
  onComplete
}: {
  quiz: DataItemQuiz
  index: number
  total: number
  onComplete: () => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const { loading } = useBoosterStore()

  const onSelect = (i: number) => {
    if (status === 'incorrect' && selectedIndex === i) {
      return
    }
    if (status === 'incorrect') {
      setStatus('idle')
    }
    setSelectedIndex(i)
  }

  const onSubmit = () => {
    if (selectedIndex === -1) return

    const isCorrect = quiz.answer[selectedIndex].right ?? false
    if (isCorrect) {
      setStatus('correct')
      setTimeout(() => {
        onComplete()
      }, 1000)
    } else {
      setStatus('incorrect')
    }
  }

  return (
    <motion.div variants={quizContainerVariants} initial="hidden" animate="visible" exit="exit">
      <motion.div
        variants={quizItemVariants}
        className="mx-auto mt-4 h-7 w-[100px] rounded-lg bg-[#BDA6FF] px-2 text-center text-base font-bold leading-7 text-[#1C1C26]"
      >
        Step {index + 1} of {total}
      </motion.div>
      <motion.h2 className="mt-6 text-center text-2xl font-bold leading-9" variants={quizItemVariants}>
        {quiz.question}
      </motion.h2>
      <motion.div variants={quizItemVariants}>
        <Pagination index={index} total={total} />
      </motion.div>
      <motion.ul className="mt-4 space-y-3" variants={quizItemVariants}>
        {quiz.answer.map((item, i) => {
          const isSelected = selectedIndex === i
          const isCorrectAnswer = status === 'correct' && isSelected
          const isIncorrectAnswer = status === 'incorrect' && isSelected

          return (
            <motion.li
              key={'quiz-li' + i}
              onClick={() => onSelect(i)}
              className={cn('cursor-pointer rounded-xl border border-solid bg-[#252532] px-4 py-[10px]', {
                'border-[#252532]': !isSelected,
                'border-[#875DFF]': isSelected && status === 'idle',
                'border-green-500': isCorrectAnswer,
                'border-red-500': isIncorrectAnswer
              })}
              animate={isIncorrectAnswer ? 'shake' : undefined}
              variants={{
                shake: {
                  x: [0, -8, 8, -8, 8, 0],
                  transition: { duration: 0.4 }
                }
              }}
            >
              {item.des}
            </motion.li>
          )
        })}
      </motion.ul>
      <motion.div variants={quizItemVariants}>
        <Button
          text="Continue"
          onClick={onSubmit}
          className={cn('mt-8')}
          disabled={selectedIndex === -1}
          loading={loading}
        />
      </motion.div>
    </motion.div>
  )
}
