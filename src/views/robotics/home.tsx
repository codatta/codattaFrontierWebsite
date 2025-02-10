import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import GetRewardGuide from '@/components/robotics/rewards-guide'
import TaskList from '@/components/robotics/task-list'
import XIcon from '@/assets/crypto/x-logo.svg'
// import TgIcon from '@/assets/crypto/tg-logo.svg'
// import DiscordIcon from '@/assets/crypto/discord-logo.svg'
// import UnknownIcon from '@/assets/crypto/unknown-logo.svg'
import WebIcon from '@/assets/crypto/web-logo.svg'
import DevInfoImage from '@/assets/robotics/dev-info-image.png'

export default function Component() {
  const navigate = useNavigate()

  return (
    <TransitionEffect>
      <div className="">
        {/* back */}
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft size={14} onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1>Back</h1>
        </div>
        {/* title */}
        <div className="mb-12">
          <a href="https://r6d9.ai/" target="_blank">
            <img src={DevInfoImage} alt="" />
          </a>
          <div className="mb-3 mt-6 flex items-center justify-between">
            <div className="text-xl font-bold">Robotics</div>
            <div className="flex gap-3">
              <a href="https://r6d9.ai/" target="_blank">
                <img className="cursor-pointer" src={WebIcon} alt="" />
              </a>
              <a href="https://x.com/Roboagent69" target="_blank">
                <img className="cursor-pointer" src={XIcon} alt="" />
              </a>

              {/* <img className="cursor-pointer" src={UnknownIcon} alt="" /> */}
              {/* <img className="cursor-pointer" src={DiscordIcon} alt="" /> */}
              {/* <img className="cursor-pointer" src={TgIcon} alt="" /> */}
            </div>
          </div>
          <div className="text-white/55">
            Visual data annotation is essential for training large AI models in robotics, especially for object
            recognition and spatial awareness. High-quality labeled data helps improve the accuracy of robotic vision,
            enabling robots to perform complex tasks with greater precision and adaptability.
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <GetRewardGuide />
          <TaskList />
        </div>
      </div>
    </TransitionEffect>
  )
}
