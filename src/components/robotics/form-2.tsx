import { Button, Form, message, Radio, RadioChangeEvent } from 'antd'
import { useState } from 'react'
import useImageLabelStore, { toggleFocusPoint } from '@/stores/image-label-store'
import CoordinateInput from './coordinate-input'
import ActionsChoice from './actions-choice'

export default function Component({ onSubmit }: { onSubmit: (data: object) => Promise<unknown> }) {
  const [form] = Form.useForm()
  const [hasContact, setHasContact] = useState<0 | 1>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { rect } = useImageLabelStore()

  const handleRadioChange = (e: RadioChangeEvent) => {
    setHasContact(e.target.value)
    toggleFocusPoint(e.target.value === 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const values = await form.validateFields()
      console.log('Form values:', values, rect)
      await onSubmit({ ...rect, ...values })
    } catch (e) {
      if ('errorFields' in e) message.error(e.errorFields[0].errors[0])
      else message.error(e.message)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex-1 text-white">
      <h2 className="mb-4 pr-6 text-2xl font-semibold">Complete the labeling tasks based on the left image.</h2>
      <Form name="form1" layout="vertical" className="flex flex-col gap-6 text-white" form={form} requiredMark={false}>
        <Form.Item
          label={<h2 className="text-base text-white">1. Is there any contact between the robot and the object?</h2>}
          name="hasContact"
          className="mb-0"
          initialValue=""
          rules={[{ required: true, message: 'Please select one option.' }]}
        >
          <Radio.Group onChange={handleRadioChange} className="flex gap-8" size="small">
            {[
              { value: 1, label: 'Yes' },
              { value: 0, label: 'No' }
            ].map((option) => (
              <Radio key={option.value} value={option.value} className="mx-0 text-sm text-white">
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {hasContact ? (
          <>
            <CoordinateInput />
            <ActionsChoice />
          </>
        ) : (
          <></>
        )}
        <Button className="w-full rounded-full bg-primary" type="primary" onClick={handleSubmit} loading={isSubmitting}>
          OK
        </Button>
      </Form>
    </div>
  )
}
