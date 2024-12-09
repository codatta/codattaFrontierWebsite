import { FormInstance } from 'antd'
import RelationCard from './relation-card'

export default function ObjectsCard({ form }: { form: FormInstance }) {
  return (
    <RelationCard
      form={form}
      name="Objects"
      title="Objects"
      des="Label out all objects that contact the agent,and have a direct connection with the touched objects."
      buttonText="+ Add More Objects"
      defaultInputs={['a', 'b', 'c', 'd']}
    />
  )
}
