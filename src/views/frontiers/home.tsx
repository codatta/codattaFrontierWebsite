import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import TaskList from '@/components/robotics/task-list'

export default function Component() {
  const navigate = useNavigate()
  const { state } = useLocation()
  console.log(state)
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
          <div className="mb-3 mt-6 flex items-center justify-between">
            <div className="text-xl font-bold">{state.name}</div>
          </div>
          <div className="text-white/55">{state.desc}</div>
        </div>
        <div className="flex flex-col gap-6">
          <TaskList showHistory={false} />
        </div>
      </div>
    </TransitionEffect>
  )
}
