import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { QuizCard } from '@/components/booster/quiz-card'
import { Data } from '@/components/booster/quiz.data'
import { Loading } from '@/components/booster/loading'
import Result from '@/components/booster/result'

import type { DataITemIntro, DataItemQuiz } from '@/components/booster/types'

import { getTaskInfo, submitTask, useBoosterStore } from '@/stores/booster.store'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()
  const [introList, setIntroList] = useState<DataITemIntro[]>([])
  const [quizList, setQuizList] = useState<DataItemQuiz[]>([])
  const [step, setStep] = useState<'intro' | 'quiz'>('intro')

  const { pageLoading, status } = useBoosterStore()

  useEffect(() => {
    if (!week || !Data[Number(week) - 1]) {
      navigate('/app/booster/not-found')
    } else {
      setIntroList(Data[Number(week) - 1].intro)
      setQuizList(Data[Number(week) - 1].quiz)
    }
  }, [week, navigate, setIntroList, setQuizList])

  const onComplete = useCallback(() => {
    submitTask(`task-${week}-quiz`).then((success) => {
      if (!success) {
        toast.error('Submission failed!')
      }
    })
  }, [week])

  useEffect(() => {
    getTaskInfo(`task-${week}-quiz`)
  }, [week])

  const variants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' }
  }

  return status === 2 ? (
    <Result />
  ) : (
    <div className="overflow-hidden">
      <AnimatePresence>{pageLoading && <Loading />}</AnimatePresence>
      <Header title="Introduction and Quiz" />
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit">
            <IntroCard introList={introList} onComplete={() => setStep('quiz')} completeText="Continue" />
          </motion.div>
        )}
        {step === 'quiz' && (
          <motion.div key="quiz" variants={variants} initial="hidden" animate="visible" exit="exit">
            <QuizCard quizList={quizList} onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          }
        }}
      />
    </div>
  )
}
