import { Button, Modal } from 'antd'

export function RulesModal({ show, onClose, usdt = 5 }: { show: boolean; onClose: () => void; usdt?: number }) {
  const rules: { title: string; list: { key: string; val: string }[] }[] = [
    {
      title: '🎯 Reward Rules',
      list: [
        {
          key: 'How to Earn',
          val: 'Complete all tasks for 2 consecutive days.Single-day completion ineligible. '
        },
        {
          key: 'Important',
          val: 'Skipping any day will make you ineligible for the reward'
        }
      ]
    },
    {
      title: '📍 Eligibility',
      list: [
        {
          key: 'Location',
          val: 'Must be based in the United States'
        },
        {
          key: 'User Status',
          val: 'Only new users are eligible'
        }
      ]
    },
    {
      title: '💸 Distribution',
      list: [
        {
          key: 'Processing Time',
          val: 'Rewards will be distributed within 7 days after approval'
        },
        {
          key: 'Task Reset',
          val: 'Daily at 00:00 UTC'
        }
      ]
    }
  ]

  return (
    <Modal
      open={show}
      cancelButtonProps={{ style: { display: 'none' } }}
      onCancel={onClose}
      closeIcon={false}
      footer={null}
      centered
      className="[&_.ant-modal-content]:w-[600px] [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:p-0"
    >
      <div className="pb-6 text-sm leading-[22px]">
        <header className="bg-[#FFA8001F] p-3 text-center text-[#FFA800]">
          Complete all tasks and pass the review to receive a 💎<span className="font-bold">${usdt} USDT</span> reward.
        </header>
        <h1 className="mt-3 text-center text-xl font-bold text-white">Task rules</h1>
        <div className="space-y-4 px-6 py-3">
          {rules.map((rule) => (
            <section key={rule.title}>
              <h3 className="text-base font-bold text-white">{rule.title}</h3>
              <ul className="mt-2 space-y-2 rounded-xl border border-[#FFFFFF1F] p-4">
                {rule.list.map((item) => (
                  <li key={item.key} className="flex items-start gap-2">
                    <span className="w-[110px] text-[#BBBBBE]">{item.key}</span>
                    <span className="flex-1 text-white">{item.val}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Button className="mx-auto mt-6 block h-[42px] w-[160px] rounded-full" type="primary" onClick={onClose}>
          Got It
        </Button>
      </div>
    </Modal>
  )
}
