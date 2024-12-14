import { Form, Radio } from 'antd'

import actionsSprite from '@/assets/robotics/actions-sprite.png'

interface Action {
  id: string
  name: string
  spritePosition: {
    x: number
    y: number
  }
  spriteSize: {
    width: number | string
    height: number | string
  }
  description: string
}

interface ActionsChoiceProps {
  selectedAction?: string
  onSelect?: (actionId: string) => void
}

const actions: Action[] = [
  {
    id: 'lift',
    name: 'Lift',
    spritePosition: { x: 2, y: 10 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Lift the object'
  },
  {
    id: 'twist',
    name: 'Twist',
    spritePosition: { x: -92, y: 8 },
    spriteSize: { width: 350, height: 'auto' },
    description: 'Twist the object'
  },
  {
    id: 'wrap-grasp',
    name: 'Wrap-grasp',
    spritePosition: { x: -158, y: 0 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Wrap and grasp the object'
  },
  {
    id: 'lever',
    name: 'Lever',
    spritePosition: { x: -243, y: -3 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Lever the object'
  },
  {
    id: 'press',
    name: 'Press',
    spritePosition: { x: 2, y: -108 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Press the object'
  },
  {
    id: 'handle-grasp',
    name: 'Handle-grasp',
    spritePosition: { x: -83, y: -108 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Grasp the handle'
  },
  {
    id: 'support',
    name: 'Support',
    spritePosition: { x: -165, y: -108 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Support the object'
  },
  {
    id: 'pull',
    name: 'Pull',
    spritePosition: { x: -247, y: -117 },
    spriteSize: { width: 330, height: 'auto' },
    description: 'Pull the object'
  }
]

const ActionsChoice: React.FC<ActionsChoiceProps> = ({ onSelect }) => {
  return (
    <Form.Item
      name="actionType"
      label={
        <h2 className="text-base text-white">
          3. Choose a robot action from the following actions.
        </h2>
      }
      rules={[{ required: true, message: 'Please select one option.' }]}
    >
      <Radio.Group
        className="w-full"
        onChange={(e) => {
          console.log('onSelect?.(e.target.value)', e.target.value)
          onSelect?.(e.target.value)
        }}
      >
        <div className="grid grid-cols-4 gap-[30px]">
          {actions.map((action) => (
            <div className="relative">
              <div
                className="relative cursor-pointer text-white hover:border-blue-300"
                onClick={() => {
                  const radio = document.querySelector(
                    `input[type="radio"][value="${action.id}"]`
                  ) as HTMLInputElement
                  if (radio) {
                    radio.click()
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center rounded-xl border-[0.6px] border-[#FFFFFF1F]">
                  <div
                    className="h-[120px] w-[90px] bg-no-repeat"
                    style={{
                      backgroundImage: `url(${actionsSprite})`,
                      backgroundPosition: `${action.spritePosition.x}px ${action.spritePosition.y}px`,
                      backgroundSize: `${
                        action.spriteSize.width === 'auto'
                          ? 'auto'
                          : action.spriteSize.width + 'px'
                      } ${
                        action.spriteSize.height === 'auto'
                          ? 'auto'
                          : action.spriteSize.height + 'px'
                      }`
                    }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center text-white">
                <Radio key={action.id} value={action.id} />
                <span className="text-nowrap text-sm font-medium">
                  {action.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Radio.Group>
    </Form.Item>
  )
}

export default ActionsChoice
