import { InputNumber, Form, FormInstance, Button } from 'antd'
import { useEffect } from 'react'
import { X } from 'lucide-react'

import AutoInput from '@/components/robotics/autoinput'

interface SegmentCardProps {
  start: number
  end: number
  max: number
  id: string
  description?: string
  form: FormInstance
  showClose?: boolean
  onClose: () => void
  onEndChange: (value: number) => void
}
export default function SegmentCard({
  start = 0,
  end = 0,
  max = 0,
  description,
  id,
  form,
  showClose = true,
  onClose,
  onEndChange
}: SegmentCardProps) {
  useEffect(() => {
    form.setFieldsValue({
      [`${id}:start`]: start,
      [`${id}:end`]: end
    })
  }, [start, end, id, form])

  useEffect(() => {
    form.setFieldsValue({
      [`${id}:des`]: description
    })
  }, [description, form, id])

  const handleEndChange = (value: number | null) => {
    if (value !== null) {
      form.setFieldsValue({
        [`${id}:end`]: value
      })
      onEndChange(value)
    }
  }

  const handleDescriptionChange = (value: string, inputName: string) => {
    form.setFieldsValue({
      [inputName]: value
    })
  }

  return (
    <div className="relative rounded-2xl bg-[#252532] p-6 text-base text-white shadow-md">
      {showClose && (
        <Button
          type="text"
          className="absolute right-2 top-2 border-none bg-transparent text-white hover:bg-[#3a3a4a] focus:bg-[#3a3a4a]"
          icon={<X />}
          onClick={onClose}
        />
      )}
      <div className="mb-3">Time</div>
      <div className="mb-4 flex h-[50px] items-center text-sm leading-[50px]">
        <Form.Item name={`${id}:start`} className="mb-0 h-8">
          <InputNumber placeholder="1" className="cursor-not-allowed" readOnly />
        </Form.Item>
        <span className="mx-2 block h-[2px] w-6 bg-[#404049]"></span>
        <Form.Item
          name={`${id}:end`}
          className="mb-0 h-8"
          rules={[
            { required: true, message: 'End time is required' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue(`${id}:start`) <= value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('End time must be greater than start time'))
              }
            })
          ]}
        >
          <InputNumber placeholder="1" min={start} max={max} onChange={handleEndChange} />
        </Form.Item>
      </div>
      <div className="mb-3 mt-6">Description</div>

      <Form.Item className="h-8" name={`${id}:des`} rules={[{ required: true, message: 'Description is required' }]}>
        <AutoInput
          autoComplete={false}
          onChange={(val) => handleDescriptionChange(val, `${id}:des`)}
          maxLength={200}
          showCount={false}
        />
      </Form.Item>
    </div>
  )
}
