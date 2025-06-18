import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Header from '@/components/booster/header'

import { Data, type DataITemIntro } from './read.data'

export default function Component() {
  const { week } = useParams()
  const [data, setData] = useState<DataITemIntro[]>([])

  useEffect(() => {
    console.log(week, Data)

    if (week && Data[Number(week) - 1]?.intro) {
      setData(Data[Number(week) - 1].intro)
    }
  }, [week])

  return (
    <div>
      <Header title="Codatta Introduction" />
      <Result />
    </div>
  )
}

function Result() {
  return <div className="absolute left-0 top-0 h-screen w-screen"></div>
}
