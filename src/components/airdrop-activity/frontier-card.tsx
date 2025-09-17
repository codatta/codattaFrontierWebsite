import { TaskReward } from '@/apis/task.api'
import RewardBgIcon from '@/assets//task/reward-bg-icon.png'
import { Avatar } from 'antd'

const RewardTag = ({ reward }: { reward: TaskReward }) => (
  <div
    className="relative flex size-[50px] items-center justify-center"
    style={{
      backgroundImage: `url(${RewardBgIcon})`,
      backgroundSize: 'contain'
    }}
  >
    <Avatar
      className="absolute z-[1]"
      src={reward.reward_icon}
      size={30}
      shape="square"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
    <p className="absolute bottom-px right-px rounded-bl-none rounded-br-md rounded-tl-md rounded-tr-none bg-[#5734BB] px-[3px] text-xs leading-[15px]">
      {reward.reward_value}
    </p>
  </div>
)

export default function AirdropActivityFrontierCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1C1C26] text-white">
      {/* Challenge Overview Section */}
      <div className="bg-[#252532] p-6">
        <h1 className="mb-2 text-xl font-bold text-white">Machine Learning Research</h1>
        <p className="mb-3 text-sm text-primary">Deep Learning & Neural Networks</p>

        <p className="mb-3 text-sm leading-relaxed text-gray-400">
          Complete all quests within the "Start your codatta journey: How to perform validation" to unlock.Complete all
          quests within the "Start your codatta journey: How to perform validation" to unlock.Complete all quests within
          the "Start your codatta journey: How to perform validation" to unlock.
        </p>

        <div className="flex items-center gap-6">
          {/* Reward Button */}
          <div className="flex items-center gap-2 rounded-full border-2 border-black bg-gradient-to-b from-[#FFEA98] to-[#FCC800] px-4 py-2">
            <div className="flex size-4 items-center justify-center rounded-full bg-black">
              <span className="text-xs font-bold text-yellow-400">N</span>
            </div>
            <span className="text-sm font-bold text-black">3,000,000</span>
          </div>

          {/* Duration */}
          <div className="ml-auto flex items-center gap-2">
            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">30days</span>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-white">123,456 participants</span>
          </div>
        </div>
      </div>

      {/* Quest List Section */}
      <div className="px-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center justify-between border-b border-white/10 py-4 last:border-b-0">
            <div className="flex items-center gap-4">
              {/* Quest Icon with Points */}
              <div className="relative">
                <RewardTag reward={{ reward_icon: '', reward_value: 100, reward_type: '' }}></RewardTag>
              </div>

              {/* Quest Title */}
              <h3 className="font-medium text-white">Neural Architecture Search</h3>
            </div>

            {/* Submit Button */}
            <button className="rounded-full bg-primary px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary">
              Submit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
