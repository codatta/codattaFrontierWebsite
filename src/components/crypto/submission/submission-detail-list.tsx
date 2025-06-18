import { Tooltip } from 'antd'
import { forwardRef, LegacyRef, useState } from 'react'
import SubmissionProgressCompact from '@/components/crypto/submission/submission-progress-compact'
import { shortenAddress } from '@/utils/wallet-address'
import { cn } from '@udecode/cn'
import { ChevronDown } from 'lucide-react'
import SubmissionItemDetail from '@/components/crypto/submission/submission-item-detail'
import CustomEmpty from '@/components/common/empty'
import NetworkIcon from '@/components/common/network-icon'
import { TSubmissionItem } from '@/api-v1/submission.api'

const tableColumns = [
  { title: 'Address', key: 'address' },
  { title: 'Category', key: 'category' },
  { title: 'Progress', key: 'Progress' },
  { title: 'Reward', key: 'reward' },
  { title: '', key: 'expand' }
]

export const SubmissionTableItem = forwardRef(TableItem)

function TableItem(props: { item: TSubmissionItem }, ref?: LegacyRef<HTMLTableRowElement>) {
  const { item } = props
  const [expand, setExpand] = useState(false)

  const basicInfo = item
  const reward = item.reward
  const completed = item.status === 'Completed'

  return (
    <>
      <tr
        className="cursor-pointer bg-black/0 transition-all hover:bg-black/10"
        onClick={() => setExpand(!expand)}
        ref={ref}
      >
        <td className="truncate p-4">
          <div className="flex items-center gap-2">
            <NetworkIcon type={basicInfo.network} size={16} />
            <Tooltip title={basicInfo.address}>{shortenAddress(basicInfo.address, 12)}</Tooltip>
          </div>
          {basicInfo.entity && <div className="mt-2 truncate">{basicInfo.entity}</div>}
        </td>
        <td className="w-1/5 max-w-[200px] overflow-hidden truncate break-words p-4">{basicInfo.category}</td>
        <td className="truncate p-4">
          <SubmissionProgressCompact reward={reward} />
        </td>
        <td className="truncate p-4">
          <div className={cn('inline-block rounded-full bg-primary/15 px-2 py-1 text-primary')}>
            {completed ? reward.current_point : reward.total_point} points
          </div>
        </td>
        <td>
          <div
            className={cn(
              'inline-block origin-center p-1 text-gray-400 transition-all',
              expand ? 'rotate-180' : 'rotate-0'
            )}
          >
            <ChevronDown size={16} />
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={tableColumns.length}>
          <div
            className={cn(
              'overflow-hidden px-4 transition-all',
              expand ? 'min-h-50 h-auto pb-4 opacity-100' : 'h-0 min-h-0 pb-0 opacity-0'
            )}
          >
            <SubmissionItemDetail submissionId={expand ? item.submission_id : ''} />
          </div>
        </td>
      </tr>
    </>
  )
}

export default function SubmissionDetailList(props: { list: readonly TSubmissionItem[] }) {
  const list = props.list || []

  return (
    <div className="overflow-scroll">
      {list.length === 0 ? (
        <CustomEmpty></CustomEmpty>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              {tableColumns.map((item, index) => {
                return (
                  <td key={`${item.key}-${index}`} className="p-4 text-gray-700">
                    {item.title}
                  </td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              return <SubmissionTableItem key={item.submission_id} item={item} />
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
