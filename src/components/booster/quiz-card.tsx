import TimeForQuizIcon from '@/assets/booster/time-for-quiz.svg?react'
import { Button } from '@/components/booster/button'
import { DataItemQuiz } from './types'

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

export function QuizCard({ quizList }: { quizList: DataItemQuiz[] }) {
  const onClickStart = () => {
    console.log('onClickStart')
  }

  return (
    <div>
      <QuizStart count={quizList.length} onClick={onClickStart} />
    </div>
  )
}
