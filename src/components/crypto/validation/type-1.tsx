import { Tooltip } from 'antd'

import { cn } from '@udecode/cn'

import Network from '@/components/common/network-icon'
import Copy from '@/components/common/copy'
import type2old from '@/assets/crypto/validation-type-2-old.png'
import type2new from '@/assets/crypto/validation-type-2-new.png'

import { shortenAddress } from '@/utils/wallet-address'
import { setSelectedItem, setOpen } from '@/stores/validation.store'
import { setSelectedItem as setSelectedItemNew, setOpen as setOpenNew } from '@/stores/validation-details.store'
import { TaskType } from './enum'
import { TValidationItem } from '@/api-v1/validation.api'

function RewardPoint(props: { point?: number; status: string; send_point?: number }) {
  const { point, status } = props
  const send_point = props.send_point || 0
  const showPoint = status === 'Completed' ? send_point : point
  return (
    <div
      className={cn(
        'rounded-4 bg-#875DFF/20 ml-2 h-[26px] flex-none px-2 py-[2px] text-[#875DFF]',
        status === 'Completed' && send_point < 1 && 'bg-[#404049] text-[#77777D]'
      )}
    >
      {showPoint || 0} {showPoint && showPoint > 1 ? 'Points' : 'Point'}
    </div>
  )
}

const Index = ({ data }: { data: TValidationItem }) => {
  function handleCardClick(item: TValidationItem) {
    if (data.task_type === TaskType.SUBMISSION_HASH_ADDRESS) {
      setOpenNew(true)
      setSelectedItemNew(item)
    } else {
      setOpen(true)
      setSelectedItem(item)
    }
  }

  // const showPoint = data.status === 'Completed' ? data.send_point : data.point

  return (
    <div onClick={() => handleCardClick(data)} className="h-full">
      <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
        <div className="p-4 pb-3">
          <div className="relative w-full overflow-hidden rounded-xl pt-[69%]">
            <div
              className="absolute top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24] bg-cover bg-center"
              style={{
                backgroundImage: `url(${data.task_type === TaskType.SUBMISSION_HASH_ADDRESS ? type2new : type2old})`
              }}
            >
              {/* <img className="max-h-full max-w-full object-contain" src={type2} alt="" /> */}
            </div>
          </div>
          <div className="mb-4 mt-3 flex">
            <div className="flex-auto text-base font-bold">
              {data.task_type === TaskType.SUBMISSION_HASH_ADDRESS
                ? 'Does the address have any historical transcation data?'
                : 'Whether the information in this submitted data is accurate?'}
            </div>
            {/* <div
                  className={cn(
                    'rounded-4 bg-#875DFF/20 ml-2 h-[26px] flex-none px-2 py-[2px] text-[#875DFF]',
                    data.status === 'Completed' && 'bg-[#404049] text-[#77777D] ',
                  )}
                >
                  {data?.status === 'Completed' ? data?.send_point : data?.point} Points
                </div> */}
            <RewardPoint {...data} />
          </div>

          <div className="flex flex-wrap justify-between">
            <div>
              <div className="flex items-center gap-[6px] text-sm">
                <Network size={16} type={data.network} />
                <Tooltip title={data.address}>{shortenAddress(data.address, 10)}</Tooltip>
                {data.address && (
                  <Copy size={13} className="w-[13px] shrink-0 cursor-pointer text-white" content={data.address} />
                )}
              </div>
            </div>
            {/* <div>
              <span className="mt-3 text-[#84828E]">Entity:</span>
              <span className="ml-[6px] text-sm">
                <Tooltip title={data.entity}>{data.entity || '-'}</Tooltip>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
