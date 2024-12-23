import React from 'react'
import { Checkbox, Form } from 'antd'

interface ViewOption {
  value: string
  label: string
}

interface ViewSelectorProps {
  name: string
  title?: string | React.ReactNode
  des: string
  options: ViewOption[]
}

const ChoicesCard: React.FC<ViewSelectorProps> = ({ name, title, des, options }) => {
  return (
    <div className="relative rounded-2xl bg-[#252532] p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mb-4 text-sm text-gray-400">{des}</p>
      <Form.Item
        name={name}
        valuePropName="value"
        className="mb-0"
        initialValue={[]}
        rules={[
          {
            type: 'array',
            required: true,
            message: 'Please select at least one view'
          }
        ]}
      >
        <Checkbox.Group className="grid grid-cols-3 gap-4 text-white" options={options}></Checkbox.Group>
      </Form.Item>
    </div>
  )
}

export default ChoicesCard
