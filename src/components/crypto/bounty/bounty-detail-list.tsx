import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import SubmissionProgressCompact from '@/components/crypto/submission/submission-progress-compact'
import { shortenAddress } from '@/utils/wallet-address'
import { cn } from '@udecode/cn'
import { ChevronDown } from 'lucide-react'
import BountyItemDetail from '@/components/crypto/bounty/bounty-item-detail'
import CustomEmpty from '@/components/common/empty'
import { TSubmissionDetail } from '@/api-v1/submission.api'

const tableColumns = [
  { title: 'Time', key: 'time' },
  { title: 'Network', key: 'network' },
  { title: 'Address', key: 'address' },
  { title: 'Category', key: 'category' },
  { title: 'Status', key: 'status' },
  { title: 'Reward', key: 'reward' },
  { title: '', key: 'expand' }
]

function BountTableItem(props: { bounty: TSubmissionDetail }) {
  const { bounty } = props
  const [expand, setExpand] = useState(false)

  const displayTime = dayjs(bounty.time).format('YYYY/MM/DD')
  const basicInfo = bounty.basic_info
  const reward = bounty.reward
  const completed = bounty.status === 'Completed'

  return (
    <>
      <tr className="cursor-pointer bg-black/0 transition-all hover:bg-black/10" onClick={() => setExpand(!expand)}>
        <td className="truncate p-4">{displayTime}</td>
        <td className="truncate p-4">{basicInfo.network}</td>
        <td className="truncate p-4">
          <Tooltip title={basicInfo.address}>{shortenAddress(basicInfo.address, 12)}</Tooltip>
        </td>
        <td className="truncate p-4">{basicInfo.category}</td>
        <td className="truncate p-4">
          <SubmissionProgressCompact reward={reward} />
        </td>
        <td className="truncate p-4">
          <div className="inline-block rounded-full bg-primary/15 px-2 py-1 text-primary">
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
              expand ? 'min-h-50 h-auto py-4 opacity-100' : 'h-0 min-h-0 py-0 opacity-0'
            )}
          >
            <BountyItemDetail submissionId={bounty.submission_id} />
          </div>
        </td>
      </tr>
    </>
  )
}

export default function BountyDetailList(props: { list: TSubmissionDetail[] }) {
  const list = props.list || []

  return (
    <>
      {list.length === 0 ? (
        <CustomEmpty></CustomEmpty>
      ) : (
        <table className="w-full min-w-0 border-collapse rounded-2xl bg-gray-100 text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              {tableColumns.map((item) => {
                return (
                  <td key={item.key} className="p-4 text-gray-700">
                    {item.title}
                  </td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              return <BountTableItem key={item.submission_id} bounty={item} />
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
