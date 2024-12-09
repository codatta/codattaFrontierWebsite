import { FormInstance } from 'antd'
import RelationCard from './relation-card'

export default function TaskCard({ form }: { form: FormInstance }) {
  return (
    <RelationCard
      form={form}
      name="Task"
      title="Task"
      des="Based on your understanding, describe the actions in the material."
      defaultInputs={['a']}
      maxWords={300}
    />
  )
}
