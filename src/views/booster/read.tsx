import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { type DataITemIntro } from '@/components/booster/types'

import { Data } from '@/components/booster/read.data'
import { getTaskInfo, submitTask, useBoosterStore } from '@/stores/booster.store'
import { Loading } from '@/components/booster/loading'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()

  const [introList, setIntroList] = useState<DataITemIntro[]>([])
  const { pageLoading, status } = useBoosterStore()

  const onComplete = useCallback(() => {
    submitTask(`task-${week}-read`)
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

  useEffect(() => {
    if (status === 2) {
      navigate('/app/booster/result')
    }

    console.log('complete', status)
  }, [status, navigate])

  return (
    <div>
      <AnimatePresence>{pageLoading && <Loading />}</AnimatePresence>
      <Header title="Codatta Introduction" />
      <IntroCard introList={introList} onComplete={onComplete} />
    </div>
  )
}
