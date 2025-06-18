import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import Header from '@/components/booster/header'
import { IntroCard } from '@/components/booster/intro-card'
import { Data } from '@/components/booster/quiz.data'

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
      <Header title="Quiz" />
      <IntroCard introList={[]} onComplete={onComplete} />
    </div>
  )
}
