import { motion } from 'framer-motion'
import { mapToRange } from '@/utils/util'

import useInViewWithAnimate from '@/hooks/useInViewWithAnimate'
import './Card2.scss'

type TProps = {
  t1: string
  t2: string
  des: string
  num1?: number
  num2?: number
  des2?: string
  bar: number
}

const Bar = ({ bar }: { bar: number }) => {
  return (
    <div className="bar">
      <motion.div
        className="w-full h-full rounded-8px inner"
        style={{ width: `${mapToRange(bar, 10, 100)}%` }}
      ></motion.div>
    </div>
  )
}

const Card = ({ t1, t2, des, num1, num2, des2, bar }: TProps) => {
  const { ref, progress } = useInViewWithAnimate()

  return (
    <div
      className="w-288px h-219px card-border-3 box-border p-24px card mt-16px"
      ref={ref}
    >
      <div className="h-72px">
        <h4 className="font-bold color-#fff text-sm">
          {t1}
          {t2 && '('}
          <span className="text-xs">{t2}</span>
          {t2 && ')'}
        </h4>
        <p className="text-xs mt-12px color-#fff opacity-65">{des}</p>
      </div>
      <Bar bar={bar * progress} />
      {!des2 ? (
        <div className="linear mt-24px text-3xl font-medium">
          {(progress * num1).toFixed(0)}%{' '}
          <span className="text-base">
            Earned (+{(num2 * progress).toFixed(0)}%)
          </span>
        </div>
      ) : (
        <div className="linear mt-24px text-3xl font-medium flex items-center">
          <span className="icon"></span>
          {des2}
        </div>
      )}
    </div>
  )
}

export default Card
