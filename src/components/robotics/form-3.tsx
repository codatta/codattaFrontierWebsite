import { Button, Form } from 'antd'
import { useState } from 'react'

import RelationsCard from './relations-card'
import TaskCard from './task-card'
import ObjectsCard from './objects-card'
import EnvironmentCard from './environment-card'
import AgentCard from './agent-card'
import ViewCard from './view-card'

export default function Component({
  onSubmit
}: {
  onSubmit: (data: object) => Promise<unknown>
}) {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const values = await form.validateFields()
      const data = convertObjectToArray(values)
      await onSubmit(data)
    } catch (e) {
      console.log('Validation failed:', e)
    }

    setIsSubmitting(false)
  }

  function convertObjectToArray(
    obj: Record<string, object>
  ): Record<string, object> {
    const result: Record<string, object> = {}
    const arrayFields: Record<string, object[]> = {}
    const agentType: Record<string, { [key: string]: object }> = {}
    const relations: Record<string, { [key: string]: object }> = {}

    Object.entries(obj).forEach(([key, value]) => {
      if (key.includes(':')) {
        const [baseKey, id] = key.split(':')
        const lowercasedKey = baseKey.toLowerCase()

        if (!arrayFields[lowercasedKey]) {
          arrayFields[lowercasedKey] = []
        }

        if (lowercasedKey === 'relation' || lowercasedKey === 'agent_type') {
          const [key, property] = id.split('-')

          if (lowercasedKey === 'relation') {
            relations[key] = relations[key] || {}
            relations[key][property] = value
          } else if (lowercasedKey === 'agent_type') {
            agentType[key] = agentType[key] || {}
            agentType[key][property] = value
          }
        } else {
          arrayFields[lowercasedKey].push(value)
        }
      } else {
        result[key] = value
      }
    })

    arrayFields.agent_type = Object.values(agentType)
    arrayFields.relation = Object.values(relations)

    return { ...result, ...arrayFields }
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Form
        name="form1"
        layout="vertical"
        className="flex flex-col gap-6"
        form={form}
      >
        <ObjectsCard form={form} />
        <EnvironmentCard />
        <AgentCard />
        <ViewCard />
        <RelationsCard />
        <TaskCard form={form} />

        <div className="flex justify-end">
          <Button
            className="w-[160px] rounded-full bg-primary"
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}
