import { useState } from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { cn } from '@udecode/cn'
import { SubmissionAndValidationInfos } from '@/api-v1/dataprofile'

function ExpandArrow(props: { expand: boolean }) {
  const { expand } = props

  return (
    <div className="relative flex size-6 items-center justify-center">
      <div
        className={cn(
          'absolute h-[3px] w-3 translate-x-1/4 rounded-full bg-current transition-all',
          expand ? 'rotate-45' : 'rotate-[-45deg]'
        )}
      ></div>
      <div
        className={cn(
          'absolute h-[3px] w-3 -translate-x-1/4 rounded-full bg-current transition-all',
          expand ? 'rotate-[-45deg]' : 'rotate-[45deg]'
        )}
      ></div>
    </div>
  )
}

const Contributors = (props: {
  submitters: SubmissionAndValidationInfos[]
  validaters: SubmissionAndValidationInfos[]
}) => {
  const { submitters, validaters } = props
  const [submittersMore, setSubmittersMore] = useState(true)
  const [validatersMore, setValidatersMore] = useState(true)

  const changeSubmittersMore = () => {
    setSubmittersMore(!submittersMore)
  }
  const changeValidatersMore = () => {
    setValidatersMore(!validatersMore)
  }
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center">
        <h2 className="font-mona text-xl font-bold leading-relaxed">Contributors</h2>
        <Tooltip title="All users who have contributed to the address" className="ml-2 cursor-pointer">
          <QuestionCircleOutlined className="text-xl" />
        </Tooltip>
      </div>

      <div className="rounded-2xl bg-[#252532] p-6">
        <>
          <div className="flex justify-between">
            <div className="mb-4 flex items-center">
              <h2 className="font-mona text-base font-bold leading-relaxed">Submitters</h2>
              <Tooltip
                title="Users who have submitted label info of the address and successfully passed human intelligence verification"
                className="ml-2 cursor-pointer"
              >
                <QuestionCircleOutlined className="text-xl" />
              </Tooltip>
            </div>
            {/* {submitters.length > 1 && (
              <div className="flex cursor-pointer items-center gap-2 text-sm" onClick={changeSubmittersMore}>
                <span>See More</span>
                <ExpandArrow expand={!submittersMore} />
              </div>
            )} */}
          </div>
          <div
            className={cn(
              'border-1 border-[#FFFFFF]/12 rounded-3 flex p-4',
              !submittersMore ? 'flex-col items-center gap-6' : 'justify-between'
            )}
          >
            {submitters.length > 0 ? (
              <>
                <div className="grid w-full grid-cols-5 gap-x-6 gap-y-10">
                  {submitters.slice(0, submittersMore ? 1 : submitters.length).map((item) => (
                    <div className="flex">
                      <div className="relative mr-3 size-[30px] shrink-0 rounded-full">
                        <img
                          src={item.avatar ? item.avatar : 'https://file.b18a.io/default.png'}
                          className="absolute left-0 top-0 size-full shrink-0 grow-0 rounded-full"
                        />
                      </div>
                      <div className="flex-1 items-center overflow-hidden text-ellipsis text-left text-[#BBBBBE]">
                        {item.address || item.email}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex w-24 cursor-pointer text-sm" onClick={changeSubmittersMore}>
                  <div className="mr-1 w-16">See More</div>
                  <ExpandArrow expand={!submittersMore} />
                </div>
              </>
            ) : (
              <div className="flex w-full justify-center text-sm">No data</div>
            )}
          </div>
        </>
        <>
          <div className="flex justify-between">
            <div className="mb-4 mt-10 flex items-center">
              <h2 className="font-mona text-base font-bold leading-relaxed">Validators</h2>
              <Tooltip
                title="Users who have verified the address and whose decision was accepted by the platform"
                className="ml-2 cursor-pointer"
              >
                <QuestionCircleOutlined className="text-xl" />
              </Tooltip>
            </div>
            {/* {validaters.length > 1 && (
              <div className="flex cursor-pointer items-center gap-2 text-sm" onClick={changeValidatersMore}>
                <span>See More</span>
                <ExpandArrow expand={!validatersMore} />
              </div>
            )} */}
          </div>
          <div
            className={cn(
              'border-1 border-[#FFFFFF]/12 rounded-3 flex p-4',
              !validatersMore ? 'flex-col items-center gap-6' : 'justify-between'
            )}
          >
            {validaters.length > 0 ? (
              <>
                <div className="grid w-full grid-cols-5 gap-x-6 gap-y-10">
                  {validaters.slice(0, validatersMore ? 1 : validaters.length).map((item) => (
                    <div className="flex">
                      <div className="relative mr-3 size-[30px] shrink-0 rounded-full">
                        <img
                          src={item.avatar ? item.avatar : 'https://file.b18a.io/default.png'}
                          className="absolute left-0 top-0 size-full shrink-0 grow-0 rounded-full"
                        />
                      </div>
                      <div className="flex-1 items-center overflow-hidden text-ellipsis text-left text-[#BBBBBE]">
                        {item.address || item.email}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex w-24 cursor-pointer text-sm" onClick={changeValidatersMore}>
                  <div className="mr-1 w-16">See More</div>
                  <ExpandArrow expand={!validatersMore} />
                </div>
              </>
            ) : (
              <div className="flex w-full justify-center text-sm">No data</div>
            )}
          </div>
        </>
      </div>
    </div>
  )
}

export default Contributors
