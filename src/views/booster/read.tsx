import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { type DataITemIntro } from '@/components/booster/types'

import { Loading } from '@/components/booster/loading'
import Result from '@/components/booster/result'

import { Data } from '@/components/booster/read.data'
import { getTaskInfo, submitTask, useBoosterStore } from '@/stores/booster.store'
import { TRACK_CATEGORY, trackEvent } from '@/utils/track'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()

  const [introList, setIntroList] = useState<DataITemIntro[]>([])
  const { pageLoading, status } = useBoosterStore()

  const onComplete = useCallback(() => {
    trackEvent(TRACK_CATEGORY.SUBMIT_CLICK, { method: 'click', contentType: `booster-task-${week}-read` })
    submitTask(`task-${week}-read`).then((success) => {
      console.log('submitTask', success)
      if (!success) {
        toast.error('Submission failed!')
        trackEvent(TRACK_CATEGORY.SUBMIT_CLICK, { method: 'fail', contentType: `booster-task-${week}-read` })
      } else {
        trackEvent(TRACK_CATEGORY.SUBMIT_CLICK, { method: 'success', contentType: `booster-task-${week}-read` })
      }
    })
  }, [week])

  useEffect(() => {
    if (!week || !Data[Number(week) - 1]?.intro) {
      navigate('/app/booster/not-found')
    } else {
      setIntroList(Data[Number(week) - 1].intro)
    }
  }, [week, navigate, setIntroList])

  useEffect(() => {
    getTaskInfo(`task-${week}-read`)
  }, [week])

  return status === 2 ? (
    <Result title="Codatta Introduction" />
  ) : (
    <div>
      <AnimatePresence>{pageLoading && <Loading />}</AnimatePresence>
      <Header title="Codatta Introduction" />
      <IntroCard introList={introList} onComplete={onComplete} />
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
