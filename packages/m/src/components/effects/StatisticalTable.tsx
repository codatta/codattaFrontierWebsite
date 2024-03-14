import asideLine from '@/assets/images/aside-line.svg'
import asideLine2 from '@/assets/images/aside-line-2.svg'
import useInViewWithAnimate from '@/hooks/useInViewWithAnimate'
import { motion } from 'framer-motion'

type TProps = {
  label: string
  list: { t1: string; t2?: string[]; t3?: string }[]
  className?: string
}

const isNum = (str: string) => String(+str) !== 'NaN'
const formatNumber = (num: number) => Math.round(num * 10) / 10

const StatisticalTable = ({ label, list, className }: TProps) => {
  const { ref, progress, isInView } = useInViewWithAnimate()

  return (
    <div
      className={`flex justify-between items-center ml--12px ${className}`}
      ref={ref}
    >
      <img
        src={list.length > 1 ? asideLine : asideLine2}
        className={`w-33px h-269px mr-12px aside-line ${isInView ? 'show' : ''}`}
      />
      {list.length > 1 ? (
        <div className="relative w-274px">
          {list.map((item, index) => (
            <div
              key={item.t1 + 'index'}
              className={`card-border-1 h-full box-content p-0  ${index > 0 ? 'mt-18px' : ''}`}
            >
              <div className="mt-32px ml-47px">
                <div className="text-base font-semibold color-#fff">
                  {item.t1}
                </div>
                <div className="color-#F838AB bold leading-56px">
                  <span className="text-38px">
                    {(item.t2 as string[]).map((i) =>
                      isNum(i) ? formatNumber(progress * +i) : i
                    )}
                  </span>
                  <span className="text-20px">{item.t3}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-24px p-6px border border-white border-solid block absolute top--54px left--30px color-#fff text-sm">
            {label}
          </div>
        </div>
      ) : (
        <div className="relative flex-1">
          <div className="text-20px leading-28px font-bold color-#3857F8">
            {list[0].t1}
          </div>
          <div className="rounded-24px p-6px border border-white border-solid block absolute top--54px color-#fff text-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatisticalTable
