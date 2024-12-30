import { useMemo } from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

import divisionMark from '@/assets/dataprofile/division-mark.svg'
import { MetaInfoHistory } from '@/api-v1/dataprofile'

const DataEvaluation = (props: { data: MetaInfoHistory[][] }) => {
  const waterLine = useMemo(() => {
    let max = 0
    props.data.map((group) =>
      group.map((item) => {
        if (item.count > max) {
          max = item.count
        }
      })
    )
    const unit = Math.ceil(max / 5)
    return [unit * 5, unit * 4, unit * 3, unit * 2, unit * 1, 0]
  }, [props.data])

  const minWidth = useMemo(() => {
    let newMinWidth = 0
    props.data.map((group) => {
      newMinWidth = newMinWidth + group.length * 52 + (group.length - 1) * 8
    })
    newMinWidth = newMinWidth + (props.data.length - 1) * 60 + 160
    return newMinWidth
  }, [props.data])

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div className="z-50 mb-4 flex items-center">
          <h2 className="font-mona text-xl font-bold leading-relaxed">Data Evaluation</h2>
          <Tooltip
            title="Mainly displays the trend of changes in address labels and the number of submitters for each label"
            className="ml-2 cursor-pointer"
          >
            <QuestionCircleOutlined className="text-xl" />
          </Tooltip>
        </div>
        <div className="flex">
          <div className="ml-10 flex items-center">
            <div className="mr-2 size-3 rounded-xl bg-[#F3EEFF]"></div>
            <span className="text-sm text-[#BBBBBE]">Submitters</span>
          </div>
          <div className="ml-10 flex items-center">
            <div className="mr-2 size-3 rounded-xl bg-[#BDA6FF]"></div>
            <span className="text-sm text-[#BBBBBE]">Category</span>
          </div>
          <div className="ml-10 flex items-center">
            <div className="mr-2 size-3 rounded-xl bg-[#6E47DD]"></div>
            <span className="text-sm text-[#BBBBBE]">Entity</span>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl bg-[#252532] px-6 py-14" style={{ minWidth }}>
        <div>
          {waterLine.map((item) => (
            <div className="mb-9 flex items-center">
              <div className="w-8 pr-2 text-right text-xs text-[#8D8D93]">{item}</div>
              <div className="flex-auto border-b border-b-[#404049]/50"></div>
            </div>
          ))}
        </div>
        <div
          className={cn(
            '-top-19 absolute flex h-full w-full items-end justify-between p-6 px-20',
            props?.data?.length === 2 && `w-${minWidth}`
          )}
        >
          {props?.data?.map((group, index) => (
            <>
              {index !== 0 && (
                <div className="min-w-[60px]">
                  <div className="relative flex-auto">
                    <div className="absolute flex w-full justify-center pt-5">
                      <img src={divisionMark} alt="" className="w-6" />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-end gap-2 text-center">
                {group?.map((item) => (
                  <div key={item.name} className="relative flex w-[52px] flex-col items-center">
                    <div className="mb-1 text-xs font-bold">{item.count}</div>
                    <div
                      className={cn(
                        'w-9 rounded-md',
                        item.type === 0 && 'bg-[#F3EEFF]',
                        item.type === 1 && 'bg-[#BDA6FF]',
                        item.type === 2 && 'bg-[#6E47DD]'
                      )}
                      style={{ height: `${(260 / waterLine?.[0]) * item.count}px` }}
                    ></div>
                    <div className="relative w-full text-center">
                      <div className="absolute w-[42px] break-all pt-3 text-center text-xs">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DataEvaluation
