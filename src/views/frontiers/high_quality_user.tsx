import { useParams } from 'react-router-dom'

import Header from '@/components/frontier/high-quality-user/header'
import Access from '@/components/frontier/high-quality-user/access'

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()

  console.log(taskId, questId)
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header title="High Quality User" isMobile={true} />
      <Access isGranted={true} onStart={() => {}} />
      {/* <h1>High Quality User</h1> */}
    </div>
  )
}
