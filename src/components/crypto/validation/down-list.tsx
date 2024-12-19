import { cn } from '@udecode/cn'
import { Tooltip } from 'antd'

import TransitionEffect from '@/components/common/transition-effect'
import Network from '@/components/common/network-icon'
import Copy from '@/components/common/copy'
import CountdownAction from '@/components/crypto/validation/countdown-action'
import type1 from '@/assets/crypto/validation-type-1.png'
import type3 from '@/assets/crypto/validation-type-3.png'
import type4 from '@/assets/crypto/validation-type-4.png'

import { shortenAddress } from '@/utils/wallet-address'

import { setSelectedItem, setOpen } from '@/stores/validation-details.store'
import { TValidationItem } from '@/api-v1/validation.api'

export const DownList = ({
  list,
  groupOne
}: {
  list: TValidationItem[]
  groupOne?: boolean
}) => {
  return (
    <TransitionEffect className="">
      <div>
        <div className="grid grid-cols-3 gap-4 transition-all">
          {list.map((item, index) => (
            <Card data={item} index={index} groupOne={groupOne} />
          ))}
        </div>
      </div>
    </TransitionEffect>
  )
}

function RewardPoint(props: {
  point?: number
  status: string
  send_point?: number
}) {
  const { point, status } = props
  const send_point = props.send_point || 0
  const showPoint = status === 'Completed' ? send_point : point
  return (
    <div
      className={cn(
        'ml-2 h-[26px] flex-none rounded-2xl bg-primary/20 px-2 py-[2px] text-primary',
        status === 'Completed' &&
          send_point < 1 &&
          'bg-[#404049] text-[#77777D]'
      )}
    >
      {showPoint || 0} {showPoint && showPoint > 1 ? 'Points' : 'Point'}
    </div>
  )
}

export const Card = ({
  data
}: {
  data: TValidationItem
  index?: number
  groupOne?: boolean
}) => {
  function handleCardClick(item: TValidationItem) {
    setOpen(true)
    setSelectedItem(item)
  }
  const standbyImg: { [key: string]: string } = {
    SUBMISSION_PRIVATE: type1,
    SUBMISSION_IMAGE_ADDRESS: type3,
    SUBMISSION_IMAGE_ENTITY: type4
  }

  return (
    <>
      <div onClick={() => handleCardClick(data)} className="h-full">
        <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
          <div className="p-4 pb-3">
            <div className="relative w-full overflow-hidden rounded-xl pt-[69%]">
              <div className="absolute top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24]">
                <img
                  className="max-h-full max-w-full object-contain"
                  src={
                    (data?.submission_evidence &&
                      JSON.parse(data?.submission_evidence)?.files?.[0]
                        ?.path) ||
                    standbyImg[data?.task_type || '']
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="mb-4 mt-3 flex">
              <div className="flex-auto text-base font-bold">
                {data.task_type === 'SUBMISSION_PRIVATE' &&
                  'Is the image sourced from third-party publicly available data?'}
                {data.task_type === 'SUBMISSION_IMAGE_ADDRESS' &&
                  'Is the image or description related to the address?'}
                {data.task_type === 'SUBMISSION_IMAGE_ENTITY' &&
                  'Is the image or description related to the Entity?'}
              </div>
              <RewardPoint {...data} />
            </div>

            <div className="flex flex-wrap justify-between">
              {['SUBMISSION_IMAGE_ADDRESS', 'SUBMISSION_IMAGE_ENTITY'].includes(
                data.task_type!
              ) && (
                <div>
                  <div className="flex items-center gap-[6px] text-sm">
                    <Network size={16} type={data.network} />
                    <Tooltip title={data.address}>
                      {shortenAddress(data.address, 10)}
                    </Tooltip>
                    {data.address && (
                      <Copy
                        size={13}
                        className="w-[13px] shrink-0 cursor-pointer text-white"
                        content={data.address}
                      />
                    )}
                  </div>
                </div>
              )}
              {data.task_type === 'SUBMISSION_IMAGE_ENTITY' && (
                <div>
                  <span className="mt-3 text-[#84828E]">Entity:</span>
                  <span className="ml-[6px] text-sm">
                    <Tooltip title={data.entity}>{data.entity || '-'}</Tooltip>
                  </span>
                </div>
              )}
            </div>
          </div>

          {data.status === 'OnHold' && (
            <div className="flex h-[46px] items-center justify-center gap-1 bg-gray-200">
              <CountdownAction gmt={data.gmt_expiration} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
