import { useParams } from 'react-router-dom'

import Header from '@/components/frontier/high-quality-user/header'
import Access from '@/components/frontier/high-quality-user/access'
import Task1 from '@/components/frontier/high-quality-user/task-1'

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()

  console.log(taskId, questId)
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header title="Join Exclusive Telegram Group" />
      <div className="mx-auto max-w-[600px] px-6 text-sm leading-[22px] text-white md:mt-[80px] md:rounded-2xl md:bg-[#252532] md:px-10 md:pb-12 md:pt-6">
        {/* <Access isGranted={true} onStart={() => {}} /> */}
        <Task1 />
      </div>
    </div>
  )
}
