import { AirdropFrontierItem, AirdropFrontierTaskItem } from '@/apis/airdrop-actvitiy'
import RewardBgIcon from '@/assets//task/reward-bg-icon.png'
import { Avatar, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Clock, Users2 } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import AirdropTagIcon from '@/assets/frontier/home/airdrop-tag-icon.svg?react'
import ActivityTagIcon from '@/assets/frontier/home/activity-tag-icon.svg?react'

import RewardIcon from '@/assets/airdrop-activity/diamond.webp'

import { useAirdropActivityStore } from '@/stores/airdrop-activity.store'
import React from 'react'

const RewardTag = ({ reward }: { reward: { score: number; icon: string } }) => (
  <div
    className="relative flex size-[50px] items-center justify-center"
    style={{
      backgroundImage: `url(${RewardBgIcon})`,
      backgroundSize: 'contain'
    }}
  >
    <Avatar src={reward.icon} size={42} shape="square" />
    <p className="absolute bottom-px right-px rounded-bl-none rounded-br-md rounded-tl-md rounded-tr-none bg-[#5734BB] px-[3px] text-xs leading-[15px]">
      {reward.score}
    </p>
  </div>
)

export default function AirdropActivityFrontierCard({ frontier }: { readonly frontier: AirdropFrontierItem }) {
  const navigate = useNavigate()

  const { currentAirdropInfo } = useAirdropActivityStore()

  const isFinished = useMemo(() => {
    if (!currentAirdropInfo) return false
    try {
      // Parse format: "2025-10-27T09:00:00+00:00.000Z"
      const endTimeStr = currentAirdropInfo.end_time.replace(/\+00:00/, '')
      const endTime = new Date(endTimeStr).getTime()

      // Validate if the timestamp is valid
      if (isNaN(endTime)) {
        console.error('Invalid end_time:', endTimeStr)
        return false
      }

      const now = new Date().getTime()
      return now > endTime
    } catch (error) {
      console.error('Error parsing end_time:', error)
      return false
    }
  }, [currentAirdropInfo])

  const goToForm = (task: AirdropFrontierTaskItem) => {
    navigate(`/frontier/project/${task.template_id}/${task.task_id}`)
  }

  const rewardImage = useMemo(() => {
    if (frontier.reward_type === 'USDT') return <USDTIcon className="size-6"></USDTIcon>
    if (frontier.reward_type === 'XnYCoin') return <XnyIcon className="size-6"></XnyIcon>
    return <></>
  }, [frontier.reward_type])

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1C1C26] text-white">
      {/* Challenge Overview Section */}
      <div className="bg-[#252532] p-6">
        {/* <a href={`/app/frontier/${frontier.frontier_id}`}> */}
        <h1 className="mb-2 inline text-xl font-bold text-white transition-all hover:cursor-pointer hover:text-primary">
          {frontier.name}
        </h1>
        {/* </a> */}
        <p className="my-3 text-sm text-primary">{frontier.title}</p>
        <p className="mb-3 text-sm leading-relaxed text-gray-400">{frontier.description}</p>
        <div className="flex flex-wrap items-center gap-6">
          {/* Reward Button */}
          <div className="mr-auto">
            {frontier.reward_amount && (
              <a
                href={`/app/frontier/${frontier.frontier_id}`}
                className="flex items-center gap-2 rounded-full border-2 border-black bg-gradient-to-b from-[#FFEA98] to-[#FCC800] px-4 py-2"
              >
                <div className="flex size-4 items-center justify-center rounded-full bg-black">
                  <span className="text-xs font-bold text-yellow-400">{rewardImage}</span>
                </div>
                <span className="text-sm font-bold text-black">{frontier.reward_amount.toLocaleString()}</span>
              </a>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-6">
            {frontier.reward_amount && (
              <div className="flex items-center gap-2">
                <Clock size={16}></Clock>
                <span className="text-white">{frontier.duration_days} days</span>
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center gap-2">
              <Users2 size={16}></Users2>
              <span className="text-white">{frontier.participants} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quest List Section */}
      <div className="mt-8 space-y-7 px-6 pb-5">
        {frontier.tasks.map((task) => (
          <div key={task.task_id} className="rounded-2xl border border-[#FFFFFF10]">
            <div className="relative mt-px flex items-center justify-between gap-6 rounded-2xl bg-[#1C1C26] p-5">
              <div className="absolute left-5 top-[-12px] flex items-center gap-2">
                {task.tags?.map((tag: string) => (
                  <React.Fragment key={tag}>
                    {tag === 'airdrop' && (
                      <Tooltip title="Airdrop">
                        <AirdropTagIcon className="size-6" />
                      </Tooltip>
                    )}
                    {tag === 'activity' && (
                      <Tooltip title="Activity">
                        <ActivityTagIcon className="size-6" />
                      </Tooltip>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {/* Quest Icon with Points */}
                <div className="relative">
                  <RewardTag reward={{ score: task.score, icon: RewardIcon }}></RewardTag>
                </div>

                {/* Quest Title */}
                <h3 className="line-clamp-2 font-medium text-white">{task.name}</h3>
              </div>

              {/* Submit Button */}
              {task.status === 2 && <span className="text-white/40">Task Completed</span>}
              {task.status !== 2 && (
                <button
                  disabled={isFinished || task.status === 0}
                  onClick={() => goToForm(task)}
                  className="w-[120px] rounded-full bg-primary px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {task.task_type_name ? task.task_type_name : 'Complete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
