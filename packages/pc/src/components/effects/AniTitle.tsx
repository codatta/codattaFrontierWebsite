import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniTitle.scss'

const AniTitle: React.FC<{
  t1: string
  t2?: string
  des?: React.ReactNode | string
  color?: string
}> = ({ t1, t2, des, color = '#fff' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-title ${isInView && 'ani'}`} ref={ref}>
      <div className="text-#fff text-lg font-bold tracking-tight mb-16px">
        {t1.split(' ').map((text, index) => (
          <span key={text + index}>{text}&nbsp;</span>
        ))}
      </div>
      <div className={`text-2xl font-bold tracking-tight color-${color}`}>
        {t2.split(' ').map((text, index) => (
          <span key={text + index + 100}>{text}&nbsp;</span>
        ))}
      </div>

      {des && <div className="mt-16px des">{des}</div>}
    </div>
  )
}

export default AniTitle
