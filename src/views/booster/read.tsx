import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { type DataITemIntro } from '@/components/booster/types'

import { Data } from '@/components/booster/read.data'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()

  const [introList, setIntroList] = useState<DataITemIntro[]>([])

  useEffect(() => {
    if (!week || !Data[Number(week) - 1]?.intro) {
      navigate('/app/booster/not-found')
    } else {
      setIntroList(Data[Number(week) - 1].intro)
    }
  }, [week, navigate, setIntroList])

  const onComplete = () => {
    console.log('onComplete')
    navigate('/app/booster/result')
  }

  return (
    <div>
      <Header title="Codatta Introduction" />
      <IntroCard introList={introList} onComplete={onComplete} />
    </div>
  )
}
