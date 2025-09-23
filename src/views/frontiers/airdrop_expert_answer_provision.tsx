import { useParams } from 'react-router-dom'

export default function AirdropExpertAnswerProvision({ templateId }: { templateId: string }) {
  const { taskId } = useParams()

  return <div>AirdropExpertAnswerProvision</div>
}
