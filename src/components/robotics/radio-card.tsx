import { Radio, Form, Input, RadioChangeEvent } from 'antd'
import { useState } from 'react'

export default function RadioCard({
  title,
  des,
  name,
  options,
  className
}: {
  title?: string | React.ReactNode
  des?: string | React.ReactNode
  name: string
  options: { value: string; label: string }[]
  className?: string
}) {
  const [showOther, setShowOther] = useState(false)

  const handleRadioChange = (e: RadioChangeEvent) => {
    setShowOther(e.target.value.toLowerCase() === 'other')
  }

  return (
    <div className={className}>
      {title && <h2 className="text-base font-semibold text-white">{title}</h2>}
      {des && <p className="mb-4 mt-2 text-gray-400">Describe the environment depicted in the material.</p>}
      <Form.Item
        name={name}
        className="mb-0"
        initialValue=""
        rules={[{ required: true, message: 'Please select one option.' }]}
      >
        <Radio.Group
          onChange={handleRadioChange}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          size="small"
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value} className="mx-0 text-sm text-white">
              {option.label || option.value}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {showOther && (
        <Form.Item
          name={name + '_other'}
          className="m-0 mt-2"
          rules={[{ required: true, message: 'Please input description.' }]}
        >
          <Input placeholder="Description Text" />
        </Form.Item>
      )}
    </div>
  )
}
