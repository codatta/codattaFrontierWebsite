import { cn } from '@udecode/cn'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { ChevronUp } from 'lucide-react'

import { formatNumber } from '@/utils/str'
import frontierApi, { FrontierActivityInfoItem, SubmissionItem } from '@/apis/frontiter.api'
import XNYCoinIcon from '@/assets/home/xyn-coin-icon.svg?react'
import USDTCoinIcon from '@/assets/home/usdt-coin-icon.svg?react'
import ActivityIcon from '@/assets/home/activity-icon.svg?react'

import FrontierActivityMarkdown from '../frontier/frontier-activity-markdown'
import { Button } from 'antd'

type ActivityInfoItemType = FrontierActivityInfoItem & {
  submission_record: SubmissionItem
  validation_record: SubmissionItem
}

export default function ActivityInfo({ className }: { className?: string }) {
  const { frontier_id } = useParams()
  const [activityInfoList, setActivityInfoList] = useState<ActivityInfoItemType[]>([])

  async function getFrontierActivityInfo(frontier_id: string) {
    const res = await frontierApi.getFrontierActivityInfo({ frontier_id })
    if (res.errorCode === 0) {
      setActivityInfoList(
        res.data.map((item) => {
          const submission_record =
            item.submissions?.find((s) => s.task_type === 'submission') ?? ({ submission_count: 0 } as SubmissionItem)
          const validation_record =
            item.submissions?.find((s) => s.task_type === 'validation') ?? ({ submission_count: 0 } as SubmissionItem)
          return {
            ...item,
            submission_record,
            validation_record,
            max_reward_count:
              item.max_reward_count ||
              (item.task_reward_config?.submission?.reward_count ?? 0) +
                (item.task_reward_config?.validation?.reward_count ?? 0)
          }
        })
      )

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
            <Header activity={item} />
            <ActivityDetail activity={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Header({ activity }: { activity: ActivityInfoItemType }) {
  const [selectedType, setSelectedType] = useState<'submission' | 'validation' | ''>('submission')

  const handleTypeChange = (type: 'submission' | 'validation') => {
    setSelectedType((prevType) => (prevType === type ? '' : type))
  }

  return (
    <div className="mt-4 rounded-xl bg-[#875DFF] px-4 py-3">
      <div className="flex items-center gap-4">
        <ActivityIcon />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 justify-center">
              <div className="flex flex-col items-start">
                <span className="text-xs">Duration</span>
                <div className="mt-1 text-base font-bold">
                  {dayjs(activity.start_time).format('YYYY-MM-DD')} to {dayjs(activity.end_time).format('YYYY-MM-DD')}
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex flex-col items-start">
                <span className="text-xs">Type</span>
                <div className="mt-1 flex items-center gap-2 font-bold">
                  {activity.task_reward_config?.submission && (
                    <Button
                      type="text"
                      className={cn(
                        'w-[100px] rounded-full border border-white',
                        selectedType == 'submission' && 'bg-gradient-to-b from-[#D6CAFE] to-[#9E81FE]'
                      )}
                      ghost={true}
                      onClick={() => handleTypeChange('submission')}
                    >
                      Contribute
                    </Button>
                  )}
                  {activity.task_reward_config?.validation && (
                    <Button
                      type="text"
                      className={cn(
                        'w-[100px] rounded-full border border-white',
                        selectedType == 'validation' && 'bg-gradient-to-b from-[#D6CAFE] to-[#9E81FE]'
                      )}
                      ghost={true}
                      onClick={() => handleTypeChange('validation')}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex flex-col items-start">
                <span className="text-xs">Total Reward</span>
                <div className="mt-1 flex items-center gap-1 font-bold">
                  {activity.reward_asset_type == 'USDT' ? <USDTCoinIcon className="size-6"></USDTCoinIcon> : null}
                  {activity.reward_asset_type == 'XnYCoin' ? <XNYCoinIcon className="size-6"></XNYCoinIcon> : null}
                  <div className="text-lg text-[#FCC800]">{formatNumber(activity.total_asset_amount || 0, 2)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex flex-col items-start">
                <span className="text-xs">
                  {activity.reward_mode === 'FIRST_COME_FIRST_SERVE' ? 'Target' : 'Total Qualified Count'}
                </span>
                <div className="mt-1 flex items-center text-base font-bold">
                  <Progress
                    reward_mode={activity.reward_mode}
                    reward_count={
                      activity.submission_record?.submission_count + activity.validation_record?.submission_count
                    }
                    max_reward_count={
                      (activity.task_reward_config?.submission?.reward_count ?? 0) +
                      (activity.task_reward_config?.validation?.reward_count ?? 0)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {selectedType === 'submission' && (
          <div className="mt-3 flex items-center justify-between gap-4 rounded-lg border border-[#A281FF] bg-[#6E47DD] px-4 py-[10px]">
            <div className="flex items-center">
              <span className="mr-2 text-xs">Total Rewards</span>
              {activity.reward_asset_type == 'USDT' ? <USDTCoinIcon className="size-6"></USDTCoinIcon> : null}
              {activity.reward_asset_type == 'XnYCoin' ? <XNYCoinIcon className="size-6"></XNYCoinIcon> : null}
              <span className="ml-1 text-lg font-bold text-[#FCC800]">
                {activity.reward_mode === 'EQUAL_SPLIT_ON_END'
                  ? 'Dynamic'
                  : formatNumber(activity.task_reward_config?.submission?.asset_amount || 0, 2)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xs">Review Result</span>
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-r from-[#FEC53C] to-[#E7B231] text-xs font-semibold text-[#1C1C26]">
                {activity.task_reward_config?.submission?.min_ranking_grade || '-'}
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xs">
                {activity.reward_mode === 'FIRST_COME_FIRST_SERVE' ? 'Target' : 'Total Qualified Count'}
              </span>
              <Progress
                reward_mode={activity.reward_mode}
                reward_count={activity?.submission_record?.submission_count || 0}
                max_reward_count={activity.task_reward_config?.submission?.reward_count || 0}
              />
            </div>
          </div>
        )}
        {selectedType === 'validation' && (
          <div className="mt-3 flex items-center justify-between gap-4 rounded-lg border border-[#A281FF] bg-[#6E47DD] px-4 py-[10px]">
            <div className="flex items-center">
              <span className="mr-2 text-xs">Total Rewards</span>
              {activity.reward_asset_type == 'USDT' ? <USDTCoinIcon className="size-6"></USDTCoinIcon> : null}
              {activity.reward_asset_type == 'XnYCoin' ? <XNYCoinIcon className="size-6"></XNYCoinIcon> : null}
              <span className="ml-1 text-lg font-bold text-[#FCC800]">
                {activity.reward_mode === 'EQUAL_SPLIT_ON_END'
                  ? 'Dynamic'
                  : formatNumber(activity.task_reward_config?.validation?.asset_amount || 0, 2)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xs">Review Result</span>
              <div className="flex items-center justify-center rounded-full border border-[#FFFFFF1F] px-3 py-1 text-sm font-semibold text-[#FCC800]">
                Adopt
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xs">
                {activity.reward_mode === 'FIRST_COME_FIRST_SERVE' ? 'Target' : 'Total Qualified Count'}
              </span>
              <Progress
                reward_mode={activity.reward_mode}
                reward_count={activity?.validation_record?.submission_count || 0}
                max_reward_count={activity.task_reward_config?.validation?.reward_count || 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Progress({
  reward_mode,
  reward_count = 0,
  max_reward_count = 0
}: {
  reward_mode: string
  reward_count: number
  max_reward_count?: number
}) {
  return reward_mode === 'EQUAL_SPLIT_ON_END' ? (
    <div className="px-3 py-1">{reward_count}</div>
  ) : (
    <div className="flex items-center gap-[6px] text-base font-bold">
      <svg width="166" height="8" viewBox="0 0 166 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="166" height="8" rx="4" fill="white" />
        <rect
          width={(reward_count / max_reward_count) * 166}
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
      {formatNumber(reward_count)}/{formatNumber(max_reward_count)}
    </div>
  )
}

function ActivityRules({ activity }: { activity: ActivityInfoItemType }) {
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

function ActivityGuide(_props: { activity: ActivityInfoItemType }) {
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

function ActivityTime({ activity }: { activity: ActivityInfoItemType }) {
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

function ActivityDetail({ activity }: { activity: ActivityInfoItemType }) {
  const [showRules, setShowRules] = useState(true)

  return (
    <div className="mt-4 rounded-xl bg-[#252532] p-4">
      <h3
        className="flex cursor-pointer items-center justify-between text-base font-semibold"
        onClick={() => setShowRules(!showRules)}
      >
        <span>Activity Rules</span>{' '}
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
