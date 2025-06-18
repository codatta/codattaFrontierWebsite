import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { QuizCard } from '@/components/booster/quiz-card'
import { Data } from '@/components/booster/quiz.data'

import type { DataITemIntro, DataItemQuiz } from '@/components/booster/types'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()
  const [introList, setIntroList] = useState<DataITemIntro[]>([])
  const [quizList, setQuizList] = useState<DataItemQuiz[]>([])
  const [step, setStep] = useState<'intro' | 'quiz'>('intro')

  useEffect(() => {
    if (!week || !Data[Number(week) - 1]) {
      navigate('/app/booster/not-found')
    } else {
      setIntroList(Data[Number(week) - 1].intro)
      setQuizList(Data[Number(week) - 1].quiz)
    }
  }, [week, navigate, setIntroList, setQuizList])

  return (
    <div>
      <Header title="Introduction and Quiz" />
      {step === 'intro' && (
        <IntroCard introList={introList} onComplete={() => setStep('quiz')} completeText="Continue" />
      )}
      {step === 'quiz' && <QuizCard quizList={quizList} onComplete={() => navigate('/app/booster/result')} />}
    </div>
  )
}
