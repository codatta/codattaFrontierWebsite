import { Button } from 'antd'

import { useCountdown } from '@/hooks/use-countdown'

export default function Read({ onNext }: { onNext: () => void }) {
  const [count] = useCountdown(6)
  const canSubmit = count === 0

  const items = [
    {
      title: 'Factual Q&A:',
      des: 'Must have one verifiable answer (e.g., math, science). No open-ended or opinion-based questions.'
    },
    {
      title: 'English Only: ',
      des: "Question and AI's answer must be in English"
    },
    {
      title: 'Exclusive Rewards:',
      des: (
        <>
          <p>
            🏆 S-Grade Bonus: Claim your <span className="text-[#FFA800]">extra xny reward</span> on Codatta within 15
            days!
          </p>
          <p className="mt-2">
            🔓 Premium Access: Unlock future high-value tasks with greater rewards on Codatta WebApp!
          </p>
        </>
      )
    }
  ]

  return (
    <div className="md:mt-[80px] md:bg-[#252532]">
      <h2 className="mt-4 text-center text-2xl font-bold md:mt-6">Find the AI's Mistake</h2>
      <div className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] text-center text-base md:mt-6 md:border md:border-[#FFFFFF1F] md:px-3 md:py-[22px]">
        Discover a question that LLM Model answers incorrectly. Earn rewards for finding factual errors in AI models!
      </div>
      <div className="mt-4 rounded-xl bg-[#252532] p-4 md:border md:border-[#FFFFFF1F]">
        <ul className="mt-3 space-y-3 text-base">
          {items.map((item, index) => (
            <li key={'read-item-' + index}>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-[#BBBBBE]">{item.des}</p>
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="primary"
        disabled={!canSubmit}
        className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
        onClick={onNext}
      >
        I Understand{!canSubmit ? `(${count}s)` : ''}
      </Button>
    </div>
  )
}
