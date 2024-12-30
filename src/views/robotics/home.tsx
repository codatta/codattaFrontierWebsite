import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import GetRewardGuide from '@/components/robotics/rewards-guide'
import TaskList from '@/components/robotics/task-list'

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
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xl font-bold">Robotics</div>
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
