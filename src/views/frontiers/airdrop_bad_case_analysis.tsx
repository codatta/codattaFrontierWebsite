import { useParams } from 'react-router-dom'

export default function AirdropBadCaseAnalysis({ templateId }: { templateId: string }) {
  const { taskId } = useParams()

  return <div>AirdropBadCaseAnalysis</div>
}
