import { useMemo, useState } from 'react'
import { Pagination } from './pagination'
import { Button } from './button'

import { type DataITemIntro } from './types'

export function IntroCard({
  introList,
  onComplete,
  completeText = 'Task Completed'
}: {
  introList: DataITemIntro[]
  onComplete: () => void
  completeText?: string
}) {
  const [introIndex, setIntroIndex] = useState(0)
  const intro = useMemo(() => introList[introIndex], [introList, introIndex])
  const total = useMemo(() => introList.length, [introList])

  const onClickButton = () => {
    if (introIndex < total - 1) {
      setIntroIndex(introIndex + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div>
      <Card {...intro} index={introIndex} total={total} />
      <Button
        index={introIndex}
        text={introIndex < total - 1 ? 'Continue' : completeText}
        onClick={onClickButton}
        seconds={5}
      />
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
