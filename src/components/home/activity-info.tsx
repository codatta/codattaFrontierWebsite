import { cn } from '@udecode/cn'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { ChevronUp } from 'lucide-react'

import { formatNumber } from '@/utils/str'
import frontierApi, { FrontierActivityInfoItem } from '@/apis/frontiter.api'
import XNYCoinIcon from '@/assets/home/xyn-coin-icon.svg?react'
import USDTCoinIcon from '@/assets/home/usdt-coin-icon.svg?react'
import FrontierActivityMarkdown from '../frontier/frontier-activity-markdown'

export default function ActivityInfo({ className }: { className?: string }) {
  const { frontier_id } = useParams()
  const [activityInfoList, setActivityInfoList] = useState<FrontierActivityInfoItem[] | []>([])

  async function getFrontierActivityInfo(frontier_id: string) {
    const res = await frontierApi.getFrontierActivityInfo({ frontier_id })
    if (res.errorCode === 0) {
      setActivityInfoList(res.data)
      console.log(res.data)
    }
  }
  useEffect(() => {
    if (!frontier_id) return
    getFrontierActivityInfo(frontier_id)
  }, [frontier_id])

  return (
    <div className={cn('mt-4', activityInfoList.length > 0 ? 'block' : 'hidden', className)}>
      <ul className="space-y-4">
        {activityInfoList.map((item) => (
          <li key={item.activity_id} className="rounded-2xl border border-[#FFFFFF1F] p-5">
            <header
              className={cn(
                'grid grid-cols-4 gap-4 rounded-xl p-3 text-xs',
                item.status === 'COMPLETED' ? 'bg-[#252532]' : 'bg-[#875DFF]'
              )}
            >
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
                <div className="flex items-center gap-1 text-base font-bold">
                  {item.reward_asset_type == 'USDT' ? (
                    <div className="flex items-center gap-1">
                      <USDTCoinIcon></USDTCoinIcon>
                    </div>
                  ) : null}
                  {item.reward_asset_type == 'XNY' ? (
                    <div>
                      <XNYCoinIcon></XNYCoinIcon>
                    </div>
                  ) : null}
                  <div className="text-lg font-bold text-[#FCC800]">{formatNumber(item.total_asset_amount || 0)}</div>
                </div>
              </div>
              {item.reward_mode === 'EQUAL_SPLIT_ON_END' ? (
                <div>
                  <div className="mb-[2px] text-[#FFFFFF/75]">Total Qualified Submissions</div>
                  <div className="text-base font-bold">{formatNumber(item.submissions || 0)}</div>
                </div>
              ) : (
                <div>
                  <div className="mb-[2px] text-[#FFFFFF/75]">Target</div>
                  <div className="flex items-center gap-[6px] text-base font-bold">
                    <svg width="166" height="8" viewBox="0 0 166 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="166" height="8" rx="4" fill="white" />
                      <rect
                        width={(item.submissions / item.max_reward_count) * 166}
                        height="8"
                        rx="4"
                        fill="url(#paint0_linear_37683_29699)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_37683_29699"
                          x1="0"
                          y1="4"
                          x2="128.451"
                          y2="4"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#58E6F3" />
                          <stop offset="0.348675" stop-color="#79A5FC" />
                          <stop offset="0.671472" stop-color="#D35BFC" />
                          <stop offset="1" stop-color="#FEBCCC" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {formatNumber(item.submissions || 0)}/{formatNumber(item.max_reward_count || 0)}
                  </div>
                </div>
              )}
            </header>
            <ActivityDetail activity={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ActivityRules({ activity }: { activity: FrontierActivityInfoItem }) {
  const rules = [
    <p>
      <strong>Reward Share</strong>: The rewards will be divided among all qualified submissions. Multiple valid
      submissions will increase your share.
    </p>,
    <p>
      <strong>Minimum Quality</strong>: Submissions must meet a minimum quality of Grade {activity.min_ranking_grade} to
      qualify for the main reward.
    </p>,
    <p>
      <strong>Points Reward</strong>: Submissions that do not meet the Grade {activity.min_ranking_grade} standard will
      receive a points reward.
    </p>,
    <p>
      <strong>Quality Assessment</strong>: Quality is assessed based on accuracy and completeness.
    </p>,
    activity.reward_mode === 'FIRST_COME_FIRST_SERVE' ? (
      <p>
        <strong>First-Come, First-Served</strong>: Main rewards are distributed on a first-come, first-served basis
        until the reward pool is depleted. Submissions after this point will still earn a points reward.
      </p>
    ) : (
      <p>
        <strong>Divide and Share</strong>: The total reward pool for this activity will be shared among all qualified
        submissions when the event ends.{' '}
      </p>
    )
  ]

  return (
    <div>
      <strong className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span>📋 Activity Rules</span>{' '}
      </strong>

      <ul
        className={cn(
          'list-outside list-disc overflow-hidden pl-5 text-sm leading-[22px] text-[#BBBBBE] transition-all'
        )}
      >
        {rules?.map((rule, index) => <li key={index}>{rule}</li>)}
      </ul>
    </div>
  )
}

function ActivityGuide(_props: { activity: FrontierActivityInfoItem }) {
  return (
    <div className="mb-4">
      <h4 className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span>💡 Hot Wallet Data Collection Guide</span>{' '}
      </h4>
      <div>
        <a
          className="underline"
          href="https://available-gallimimus-50c.notion.site/Codatta-CEX-Hot-Wallet-Data-Collection-Guide-242b989417fe8070a0c7d1c9adf679ed"
        >
          Click here and follow our easy step-by-step tutorial to complete the task.
        </a>
      </div>
    </div>
  )
}

function ActivityTime({ activity }: { activity: FrontierActivityInfoItem }) {
  return (
    <div className="mb-4">
      <h4 className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span>📅 Event Time</span>{' '}
      </h4>

      <div className="overflow-hidden text-sm leading-[22px] text-[#BBBBBE] transition-all">
        {/* Format the start_time and end_time to 'YYYY-MM-DD HH:mm:ss' in UTC */}
        {new Date(activity.start_time).toISOString().replace('T', ' ').substring(0, 19)} UTC to{' '}
        {new Date(activity.end_time).toISOString().replace('T', ' ').substring(0, 19)} UTC
      </div>
    </div>
  )
}

function ActivityDetail({ activity }: { activity: FrontierActivityInfoItem }) {
  const [showRules, setShowRules] = useState(true)

  return (
    <div className="mt-4 rounded-xl bg-[#252532] p-4">
      <h3
        className="flex cursor-pointer items-center justify-between text-base font-semibold"
        onClick={() => setShowRules(!showRules)}
      >
        <span>Activity Details</span>{' '}
        <ChevronUp size={24} className={cn('cursor-pointer transition-all', showRules ? 'rotate-180' : '')} />
      </h3>
      <div className={cn(showRules ? 'h-auto pt-4' : 'h-0 overflow-hidden')}>
        {activity.description ? (
          <FrontierActivityMarkdown>{activity.description}</FrontierActivityMarkdown>
        ) : (
          <>
            <ActivityGuide activity={activity}></ActivityGuide>
            <ActivityTime activity={activity}></ActivityTime>
            <ActivityRules activity={activity}></ActivityRules>
          </>
        )}
      </div>
    </div>
  )
}
