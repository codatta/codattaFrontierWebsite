import { cn } from '@udecode/cn'
import { Button, Form, FormInstance } from 'antd'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import AutoInput from './autoinput'

interface RelationsCardProps {
  name: string
  title: string
  des: string
  buttonText?: string
  maxInputs?: number
  maxWords?: number
  defaultInputs?: string[]
  form: FormInstance
}

export default function RelationsCard({
  name,
  title,
  des,
  buttonText,
  maxInputs = 8,
  maxWords = 45,
  form,
  defaultInputs = ['a']
}: RelationsCardProps) {
  const countRef = useRef(0)
  const [inputs, setInputs] = useState<string[]>(defaultInputs)
  const handleAdd = () => {
    countRef.current += 1
    setInputs([...inputs, countRef.current.toString()])
  }
  const handleDelete = (index: number) => {
    const newInputs = [...inputs]
    newInputs.splice(index, 1)
    setInputs(newInputs)
  }

  const handleDescriptionChange = (value: string, inputName: string) => {
    form.setFieldsValue({
      [inputName]: value
    })
  }

  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mb-6 mt-2 p-0 text-sm text-white text-opacity-60">{des}</p>
      <div className="mb-4 flex flex-col gap-4">
        {inputs.map((input, index) => (
          <div className="flex items-center" key={`${name}-${input}`}>
            <Form.Item
              name={`${name}:${input}`}
              className="mb-0 flex-1"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <AutoInput
                autoComplete={false}
                onChange={(val) => handleDescriptionChange(val, `${name}:${input}`)}
                placeholder="Description Text"
                maxLength={maxWords}
                showCount={false}
              />
            </Form.Item>
            <Button
              icon={<X className=""></X>}
              onClick={() => (inputs.length == 1 ? null : handleDelete(index))}
              color="danger"
              type="text"
              className={cn(
                'border-none bg-transparent text-white hover:bg-transparent hover:text-[#ea580c]',
                inputs.length == 1 && 'invisible'
              )}
            ></Button>
          </div>
        ))}
      </div>

      {inputs.length < maxInputs && buttonText && (
        <Button
          className="flex items-center rounded-full bg-transparent px-4 py-2 text-sm text-white"
          onClick={handleAdd}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}
