import RadioCard from './radio-card'

export default function AgentCard() {
  const options = [
    {
      name: 'Agent_type:1-handCount',
      title: (
        <div className="mb-4 text-sm font-semibold">
          Select one from the following five options.
        </div>
      ),
      options: [
        { value: '1', label: 'gripper' },
        { value: '2', label: 'two-finger hand' },
        { value: '3', label: 'three-finger hand' },
        { value: '4', label: 'four-finger hand' },
        { value: '5', label: 'five-finger hand' }
      ]
    },
    {
      name: 'Agent_type:1-armCount',
      title: (
        <div className="mb-4 text-sm font-semibold">
          The material contains either 1 or 2 arms?
        </div>
      ),
      options: [
        { value: '1', label: '1 arm' },
        { value: '2', label: '2 arms' }
      ]
    },
    {
      name: 'Agent_type:1-status',
      title: (
        <div className="mb-4 text-sm font-semibold">
          Is this arm mobile or static?
        </div>
      ),
      options: [
        { value: 'mobile', label: 'mobile arm' },
        { value: 'static', label: 'static arm' }
      ]
    }
  ]

  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <h2 className="text-base font-semibold text-white">Agent_type</h2>
      <p className="mb-4 mt-2 text-gray-400">
        Identify the main subject of the action in as detailed modules as
        possible.
      </p>
      <div className="flex flex-col gap-4">
        {options.map((item, index) => (
          <RadioCard
            key={index}
            className="rounded-lg border border-[#FFFFFF1F] bg-[#252532] p-6"
            title={
              <div className="mb-4 text-sm font-semibold">{item.title}</div>
            }
            name={item.name}
            options={item.options}
          />
        ))}
      </div>
    </div>
  )
}
