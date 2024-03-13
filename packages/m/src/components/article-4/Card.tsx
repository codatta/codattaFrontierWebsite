import img1 from '../../assets/images/article-4/progress-1.svg'
import img2 from '../../assets/images/article-4/progress-2.svg'
import img3 from '../../assets/images/article-4/progress-3.svg'

import './Card.scss'

type TProps = {
  t1: string
  t2: string
  des: string
  progressType: number
  num1?: number
  num2?: number
  des2?: string
}

const Card = ({ t1, t2, des, progressType, num1, num2, des2 }: TProps) => {
  return (
    <div className="w-288px h-219px card-border-3 box-border p-24px card mt-16px">
      <div className="h-72px">
        <h4 className="font-bold color-#fff text-sm">
          {t1}
          {t2 && '('}
          <span className="text-xs">{t2}</span>
          {t2 && ')'}
        </h4>
        <p className="text-xs mt-12px color-#fff opacity-65">{des}</p>
      </div>
      <img
        src={progressType === 1 ? img1 : progressType === 2 ? img2 : img3}
        className="w-236px"
      />
      {!des2 ? (
        <div className="linear mt-2px text-3xl font-medium">
          {num1}% <span className="text-base">Earned (+{num2}%)</span>
        </div>
      ) : (
        <div className="linear mt-2px text-3xl font-medium flex items-center">
          <span className="icon"></span>
          {des2}
        </div>
      )}
    </div>
  )
}

export default Card
