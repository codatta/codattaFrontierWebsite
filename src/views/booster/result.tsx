import Header from '@/components/booster/header'

import completeBg from '@/assets/booster/task-complete-bg.png'
import QuizIcon from '@/assets/booster/quiz-success.svg?react'

export default function Result() {
  return (
    <div className="h-screen">
      <div className="relative z-10">
        <Header title="Introduction and Quiz" />
        <QuizIcon className="mx-auto mt-[80px]" />
        <h2 className="mt-8 text-center text-xl font-bold leading-9">Task Completed!</h2>
      </div>
      <div
        className="absolute left-0 top-0 h-screen w-screen bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${completeBg})` }}
      />
    </div>
  )
}
