import { cn } from '@udecode/cn'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import frontierApi, { FrontierActivityInfoItem } from '@/apis/frontiter.api'

export default function ActivityInfo({ className }: { className?: string }) {
  const { frontier_id } = useParams()
  const [activityInfoList, setActivityInfoList] = useState<FrontierActivityInfoItem[] | []>([])

  async function getFrontierActivityInfo(frontier_id: string) {
    const res = await frontierApi.getFrontierActivityInfo({ frontier_id })
    if (res.errorCode === 0) {
      setActivityInfoList(res.data[0])
      console.log(res.data)
    }
  }
  useEffect(() => {
    if (!frontier_id) return
    getFrontierActivityInfo(frontier_id)
  }, [frontier_id])
  return (
    <ul className={cn('mt-4 space-y-4', activityInfoList.length > 0 ? 'block' : 'hidden', className)}>
      {activityInfoList.map((item) => (
        <li key={item.activity_id} className="rounded-2xl border border-[#FFFFFF1F] p-5">
          <header className="grid grid-cols-4 rounded-xl bg-[#875DFF] p-3 text-xs">
            <div>
              <div className="mb-[2px] text-[#FFFFFF/75]">Duration</div>
              <div className="text-base font-bold">
                {dayjs(item.start_time).format('YYYY-MM-DD')} to {dayjs(item.end_time).format('YYYY-MM-DD')}
              </div>
            </div>
            <div>
              <div className="mb-[2px] text-[#FFFFFF/75]">Min Quality</div>
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-r from-[#FEC53C] to-[#E7B231] text-xs font-semibold text-[#1C1C26]">
                {item.min_ranking_grade}
              </div>
            </div>
            <div>
              <div className="mb-[2px] text-[#FFFFFF/75]">Total Rewards</div>
              <div className="text-base font-bold">
                {item.total_asset_amount}
                {item.reward_asset_type}
              </div>
            </div>
            <div>
              <div className="mb-[2px] text-[#FFFFFF/75]">Total Submissions</div>
              <div className="text-base font-bold">{item.submissions}</div>
            </div>
          </header>
        </li>
      ))}
    </ul>
  )
}
