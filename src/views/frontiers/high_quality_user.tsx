import { useParams } from 'react-router-dom'

import Header from '@/components/frontier/high-quality-user/header'

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()

  console.log(taskId, questId)
  return (
    <div>
      <Header title="High Quality User" isMobile={true} />
      {/* <h1>High Quality User</h1> */}
    </div>
  )
}
