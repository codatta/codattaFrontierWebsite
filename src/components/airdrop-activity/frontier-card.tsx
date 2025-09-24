import { AirdropFrontierItem, AirdropFrontierTaskItem } from '@/apis/airdrop-actvitiy'
import RewardBgIcon from '@/assets//task/reward-bg-icon.png'
import { Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'
import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import { useMemo } from 'react'
import { Clock, Users2 } from 'lucide-react'
import RewardIcon from '@/assets/airdrop-activity/ponit-icon.webp'

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
        <h1 className="mb-2 text-xl font-bold text-white">{frontier.name}</h1>
        <p className="mb-3 text-sm text-primary">{frontier.title}</p>

        <p className="mb-3 text-sm leading-relaxed text-gray-400">{frontier.description}</p>

        <div className="flex flex-wrap items-center gap-6">
          {/* Reward Button */}
          <div className="mr-auto">
            {frontier.reward_amount && (
              <div className="flex items-center gap-2 rounded-full border-2 border-black bg-gradient-to-b from-[#FFEA98] to-[#FCC800] px-4 py-2">
                <div className="flex size-4 items-center justify-center rounded-full bg-black">
                  <span className="text-xs font-bold text-yellow-400">{rewardImage}</span>
                </div>
                <span className="text-sm font-bold text-black">{frontier.reward_amount}</span>
              </div>
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
      <div className="px-6">
        {frontier.tasks.map((task) => (
          <div
            key={task.task_id}
            className="flex items-center justify-between gap-6 border-b border-white/10 py-4 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              {/* Quest Icon with Points */}
              <div className="relative">
                <RewardTag reward={{ score: task.score, icon: RewardIcon }}></RewardTag>
              </div>

              {/* Quest Title */}
              <h3 className="line-clamp-2 font-medium text-white">{task.name}</h3>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => goToForm(task)}
              className="rounded-full bg-primary px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary"
            >
              Submit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
