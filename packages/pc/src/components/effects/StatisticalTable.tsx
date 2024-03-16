import asideLine from '@/assets/images/aside-line.svg'
import asideLine2 from '@/assets/images/aside-line-2.svg'

import styled from 'styled-components'

const SplitLine = styled.div`
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.1)
  );
`

type TProps = {
  label: string
  list: { t1: string; t2?: string; t3?: string }[]
}

const StatisticalTable = ({ label, list }: TProps) => {
  return (
    <div className="flex justify-between items-center mt-100px">
      <img
        src={list.length > 1 ? asideLine : asideLine2}
        className="w-64px h-362px ml--40px mr-12px"
      />
      {list.length > 1 ? (
        <div className="relative h-192px flex-1 card-border-1">
          <div className="h-full box-content flex p-0 items-center">
            {list.map((item, index) => (
              <div className="flex flex-1" key={item.t1}>
                {index > 0 && <SplitLine />}
                <div className="ml-56px">
                  <div className="title-1">{item.t1}</div>
                  <div className="color-#F838AB bold leading-56px">
                    <span className="text-48px">{item.t2} </span>
                    <span>{item.t3}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl p-8px border border-white border-solid block absolute top--74px color-#fff">
            {label}
          </div>
        </div>
      ) : (
        <div className="relative flex-1">
          <div className="text-5xl font-bold color-#3857F8 h-56px">
            {list[0].t1}
          </div>
          <div className="rounded-3xl p-8px border border-white border-solid block absolute top--74px color-#fff">
            {label}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatisticalTable
