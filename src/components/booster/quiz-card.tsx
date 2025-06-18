import TimeForQuizIcon from '@/assets/booster/time-for-quiz.svg?react'
import { Button } from '@/components/booster/button'
import { Pagination } from '@/components/booster/pagination'
import { motion } from 'framer-motion'

import { DataItemQuiz } from './types'
import { useState } from 'react'
import { cn } from '@udecode/cn'

export function QuizStart({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <div>
      <TimeForQuizIcon className="mx-auto mt-[80px]" />
      <h2 className="mt-8 text-center text-2xl font-bold leading-9">Time for a Quiz</h2>
      <p className="mt-6 text-center text-base text-[#BBBBBE]">{count} questions</p>
      <Button text="Continue" onClick={onClick} className="mt-8" />
    </div>
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
    <div>
      {quizIndex === -1 && <QuizStart count={quizList.length} onClick={() => setQuizIndex(0)} />}
      {quizIndex >= 0 && (
        <Quiz
          key={quizIndex}
          quiz={quizList[quizIndex]}
          index={quizIndex}
          total={quizList.length}
          onComplete={onNext}
        />
      )}
    </div>
  )
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
    <div>
      <div className="mx-auto mt-4 h-7 w-[100px] rounded-lg bg-[#BDA6FF] px-2 text-center text-base font-bold leading-7 text-[#1C1C26]">
        Step {index + 1} of {total}
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold leading-9">{quiz.question}</h2>
      <Pagination index={index} total={total} />
      <ul className="mt-4 space-y-3">
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
      </ul>
      <Button text="Continue" onClick={onSubmit} className={cn('mt-8')} disabled={selectedIndex === -1} />
    </div>
  )
}
