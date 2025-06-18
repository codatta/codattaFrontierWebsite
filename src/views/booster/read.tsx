import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '@udecode/cn'

import Header from '@/components/booster/header'

import { useCountdown } from '@/hooks/use-countdown'
import { Data, type DataITemIntro } from './read.data'

export default function Component() {
  const navigate = useNavigate()
  const { week } = useParams()
  const [introList, setIntroList] = useState<DataITemIntro[]>([])
  const [introIndex, setIntroIndex] = useState(0)
  const intro = useMemo(() => introList[introIndex], [introList, introIndex])
  const total = useMemo(() => introList.length, [introList])

  useEffect(() => {
    if (week && Data[Number(week) - 1]?.intro?.length) {
      setIntroList(Data[Number(week) - 1].intro)
    } else {
      navigate('/app/booster/not-found')
    }
  }, [week, navigate])

  const onClickButton = () => {
    if (introIndex < total - 1) {
      setIntroIndex(introIndex + 1)
    } else {
      navigate('/app/booster/result')
    }
  }

  return (
    <div>
      <Header title="Codatta Introduction" />
      <Card {...intro} index={introIndex} total={total} />
      <Button index={introIndex} total={total} onClick={onClickButton} />
    </div>
  )
}

function Card({ title, des, banner, index, total }: DataITemIntro & { index: number; total: number }) {
  return (
    <div>
      {banner && <img src={banner} alt="" className="mt-4 h-auto w-full" />}
      {title && <h2 className="mt-4 text-center text-2xl font-bold leading-9">{title}</h2>}
      <Pagination index={index} total={total} />
      <div className="mt-4 space-y-2 rounded-xl bg-[#252532] p-4 text-lg">
        {des?.map((item, index) => {
          if (item.type === 'p') {
            return <p key={'p' + index}>{item.content}</p>
          } else if (item.type === 'ul') {
            return (
              <ul key={'ul' + index}>
                {item.content.map((item, index2) => (
                  <li key={'ul' + index + '-' + index2} className="flex gap-3">
                    <span className="mt-3 block size-1 shrink-0 rounded-full bg-white"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          } else if (item.type === 'h4') {
            return (
              <h4 key={'h4' + index} className="text-lg font-bold">
                {item.content}
              </h4>
            )
          } else if (item.type === 'light') {
            return (
              <p key={'light' + index} className="text-[#BBBBBE]">
                {item.content}
              </p>
            )
          }
        })}
      </div>
    </div>
  )
}

function Pagination({ index, total }: { index: number; total: number }) {
  return (
    <ul className={cn('mt-6 flex items-center justify-center gap-6', total <= 1 ? 'hidden' : '')}>
      {Array.from({ length: total }, (_, i) => i + 1).map((_, index2) => (
        <li
          key={'pagination-' + index2}
          className={cn('h-[2px] w-[48px] rounded-full', index2 === index ? 'bg-[#875DFF]' : 'bg-[#252532]')}
        ></li>
      ))}
    </ul>
  )
}

function Button({ index, total, onClick }: { index: number; total: number; onClick: () => void }) {
  const [seconds, ended, restart] = useCountdown(5)

  useEffect(() => {
    restart()
  }, [index, restart])
  return (
    <button
      disabled={!ended}
      className={cn(
        'mt-8 h-[44px] w-full rounded-full bg-[#875DFF] p-0 px-4 text-center text-base font-bold leading-[44px] text-white',
        !ended ? 'opacity-25' : ''
      )}
      onClick={onClick}
    >
      {index < total - 1 ? 'Continue' : 'Task Completed'}
      {!ended && `(${seconds}s)`}
    </button>
  )
}
