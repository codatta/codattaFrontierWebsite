import { cn } from '@udecode/cn'
import { Button, Collapse, CollapseProps, Form, Input } from 'antd'
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, X } from 'lucide-react'
import { useRef, useState } from 'react'
// import { KEYWORDS } from '@/config'

export default function RelationsCard() {
  const maxInputs = 10
  const countRef = useRef(3)
  const [inputs, setInputs] = useState<string[]>(['1', '2'])
  const [showExample, setShowExample] = useState(false)
  const handleAdd = () => {
    countRef.current += 1
    setInputs([...inputs, countRef.current.toString()])
  }
  const handleDelete = (index: number) => {
    if (inputs.length === 1) {
      return
    }
    const newInputs = [...inputs]
    newInputs.splice(index, 1)
    setInputs(newInputs)
  }
  const toggleExample = () => {
    setShowExample((pre) => !pre)
  }

  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <h2 className="text-base font-semibold text-white">Relations</h2>
      <p className="mb-4 mt-2 text-gray-400">
        Describe the relationship between any two targets among
        objects,agents_type,and environmental elements.
      </p>
      <div className="">
        {inputs.map((input, index) => (
          <div
            className="flex items-center justify-between"
            key={'relations' + input}
          >
            <RelationCard name={'relations:' + input} className="flex-1" />
            {inputs.length > 1 && (
              <Button
                type="text"
                className="border-none bg-transparent text-white hover:bg-transparent hover:text-[#ea580c]"
                icon={<X />}
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        ))}

        <div className="mt-3 flex items-center justify-between">
          {inputs.length < maxInputs ? (
            <Button
              icon={<PlusIcon />}
              className="flex items-center rounded-full bg-transparent px-4 py-2 text-sm font-normal text-white"
              onClick={handleAdd}
            >
              + Add More Relations
            </Button>
          ) : (
            <div></div>
          )}

          <div
            onClick={toggleExample}
            className="flex cursor-pointer items-center text-white"
          >
            Example
            {showExample ? (
              <ChevronUpIcon className="ml-1" />
            ) : (
              <ChevronDownIcon className="ml-1" />
            )}
          </div>
        </div>
        <div
          className={cn(
            'transition-all duration-300',
            showExample ? 'h-auto opacity-100' : 'h-0 overflow-hidden opacity-0'
          )}
        >
          <RelationsExampleCard />
        </div>
      </div>
    </div>
  )
}

function RelationCard({
  name,
  className
}: {
  name: string
  className: string
}) {
  return (
    <div className={cn('flex flex-nowrap gap-6', className)}>
      <div>
        <div className="mb-2 text-xs">target A</div>
        <Form.Item
          name={`${name}-a`}
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'target A is required' }]}
        >
          <Input
            placeholder="target A"
            // className="mt-2 border border-white text-center text-white placeholder-[#404049] focus:text-black focus:placeholder-[#BBBBBE]"
            variant="filled"
            maxLength={40}
          />
        </Form.Item>
      </div>
      <div>
        <div className="mb-2 text-xs">&nbsp;</div>
        <Form.Item
          name={`${name}-prep`}
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'prep is required' }]}
        >
          <Input
            placeholder="prep for relation"
            className="rounded-none border border-transparent border-b-white text-center"
            variant="filled"
            maxLength={40}
          />
        </Form.Item>
      </div>
      <div>
        <div className="mb-2 text-xs">target B</div>
        <Form.Item
          name={`${name}-b`}
          style={{ flex: 1 }}
          rules={[{ required: true, message: 'target B is required' }]}
        >
          <Input
            placeholder="target B"
            // className="mt-2 border border-white text-center text-white placeholder-[#404049] focus:text-black focus:placeholder-[#BBBBBE]"
            variant="filled"
            maxLength={40}
          />
        </Form.Item>
      </div>
    </div>
  )
}

function RelationsExampleCard() {
  const items: CollapseProps['items'] = [
    {
      key: 'verb',
      label: 'Verb',
      children: (
        <div className="flex flex-wrap gap-4">
          {/* {KEYWORDS.filter((item) => item.type === 'Verb')
            .flatMap((item) => item.keywords)
            .sort()
            .map((word, index) => (
              <Typography.Text
                copyable={true}
                className="mr-4 flex items-center rounded-full border border-[#FFFFFF1F] px-4 py-1 text-white"
                key={word + index}
              >
                {word}
              </Typography.Text>
            ))} */}
        </div>
      )
    },
    {
      key: 'prep',
      label: 'Prep',
      children: (
        <div className="flex flex-wrap gap-4">
          {/* {KEYWORDS.filter((item) => item.type === 'Prep')
            .flatMap((item) => item.keywords)
            .sort()
            .map((word, index) => (
              <Typography.Text
                copyable={true}
                className="mr-4 flex items-center rounded-full border border-[#FFFFFF1F] px-4 py-1 text-white"
                key={word + index}
              >
                {word}
              </Typography.Text>
            ))} */}
        </div>
      )
    }
  ]
  return (
    <div className="mt-6 max-w-[640px] rounded-xl border border-solid border-[#FFFFFF1F] p-4">
      <Collapse
        ghost
        items={items}
        style={{ color: 'red' }}
        defaultActiveKey={['verb', 'prep']}
        collapsible={'header'}
        expandIconPosition="end"
        size="small"
        className="text-white [&_.ant-collapse-expand-icon]:text-white [&_.ant-collapse-header-text]:text-white"
      />
      <div className="my-3 h-[1px] w-full bg-[#FFFFFF1F]"></div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="text-xs text-[#BBBBBE]">target A</div>
          <div className="mt-2 cursor-not-allowed rounded-lg border border-white text-center text-sm font-semibold leading-8 text-white">
            Apple
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-transparent">On</div>
          <div className="mt-2 cursor-not-allowed border border-transparent border-b-white text-center text-sm font-semibold leading-8 text-white">
            On
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-[#BBBBBE]">target B</div>
          <div className="mt-2 cursor-not-allowed rounded-lg border border-white text-center text-sm font-semibold leading-8 text-white">
            Table
          </div>
        </div>
      </div>
    </div>
  )
}
