import { AirdropFrontierItem, AirdropFrontierTaskItem } from '@/apis/airdrop-actvitiy'
import RewardBgIcon from '@/assets//task/reward-bg-icon.png'
import { Avatar, Tooltip, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Clock, Users2 } from 'lucide-react'
import { cn } from '@udecode/cn'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import AirdropTagIcon from '@/assets/frontier/home/airdrop-tag-icon.svg?react'
import ActivityTagIcon from '@/assets/frontier/home/activity-tag-icon.svg?react'

import RewardIcon from '@/assets/airdrop-activity/diamond.webp'

import { airdropActivityActions, useAirdropActivityStore } from '@/stores/airdrop-activity.store'
import React from 'react'

import StakeModel, { TaskStakeConfig } from '@/components/settings/token-stake-modal'
import ToStakeModal from '@/components/settings/to-stake-modal'
import { TaskStakeInfo } from '@/apis/frontiter.api'

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

  const { currentAirdropInfo, currentAirdropSeasonId } = useAirdropActivityStore()

  const [stakeTaskId, setStakeTaskId] = useState('')
  const [toStakeModalOpen, setToStakeModalOpen] = useState(false)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const [taskUrl, setTaskUrl] = useState('')
  const [taskStakeConfig, setTaskStakeConfig] = useState<TaskStakeConfig>()

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

  const handleTaskClick = (task: AirdropFrontierTaskItem) => {
    const url = `/frontier/project/${task.template_id}/${task.task_id}`
    if (task.user_reputation_flag === 0) {
      setTaskUrl(url)
      setStakeTaskId(task.task_id)
      setToStakeModalOpen(true)
      return
    }

    if (task.user_reputation_flag === 2) {
      message.error('Reputation not met!')
      return
    }
    navigate(url)
  }

  const handleStake = (stakeInfo: TaskStakeInfo) => {
    setToStakeModalOpen(false)
    setStakeModalOpen(true)
    setTaskStakeConfig({
      ...stakeInfo,
      taskUrl
    })
  }

  const handleStakeSuccess = () => {
    if (currentAirdropSeasonId) {
      airdropActivityActions.getAirdropFrontierList(currentAirdropSeasonId, 1, 20)
    }
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
            <div
              className={cn(
                'relative flex items-center justify-between gap-6 rounded-t-2xl p-5',
                task.user_reputation_flag === 2 ? 'bg-[#FFFFFF1F]' : 'bg-[#1C1C26]'
              )}
            >
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
                  disabled={isFinished || task.status === 0 || task.user_reputation_flag === 2}
                  onClick={() => handleTaskClick(task)}
                  className="w-[120px] rounded-full bg-primary px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {task.task_type_name ? task.task_type_name : 'Complete'}
                </button>
              )}
            </div>
            <div className="flex rounded-b-2xl bg-[#252532] px-5 py-3">
              {task.user_reputation_flag === 0 ? (
                <div className="flex h-[26px] items-center rounded-lg bg-[#D92B2B1F] px-2 text-sm text-[#D92B2B]">
                  Reputation: Too low
                </div>
              ) : (
                <div className="flex h-[26px] items-center rounded-lg bg-[#875DFF1F] px-2 text-sm text-[#875DFF]">
                  Reputation: {task.reputation ?? 0}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <ToStakeModal
        open={toStakeModalOpen}
        onClose={() => setToStakeModalOpen(false)}
        taskId={stakeTaskId}
        onStake={handleStake}
      />
      {stakeModalOpen && (
        <StakeModel
          open={true}
          onClose={() => setStakeModalOpen(false)}
          onSuccess={handleStakeSuccess}
          taskStakeConfig={taskStakeConfig}
        />
      )}
    </div>
  )
}
