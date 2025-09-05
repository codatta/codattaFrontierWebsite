import { Button } from 'antd'

export default function Task2() {
  return (
    <>
      <Read onReaded={() => {}} />
    </>
  )

  function Read({ onReaded }: { onReaded: () => void }) {
    const items = [
      {
        title: 'Factual Q&A:',
        des: 'Must have one verifiable answer (e.g., math, science). No open-ended or opinion-based questions.'
      },
      {
        title: 'Find a Difference: ',
        des: 'ChatGPT-4o and Qwen-3 must disagree.'
      },
      {
        title: 'English Only: ',
        des: 'Questions and answers must be in English.'
      },
      {
        title: 'Your Gateway: ',
        des: "Success here is your path to qualifying for next week's high-value rewards."
      }
    ]
    return (
      <>
        <h2 className="mt-4 text-center text-2xl font-bold md:mt-6">
          Model Comparison
          <br className="md:hidden" /> Challenge
        </h2>
        <div className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] text-center text-base md:mt-6 md:border md:border-[#FFFFFF1F] md:px-3 md:py-[22px]">
          Find a question that <span className="font-bold">ChatGPT-4o</span> and{' '}
          <span className="font-bold">Qwen-3</span> answer differently.
        </div>
        <div className="mt-4 rounded-xl bg-[#252532] p-4 md:border md:border-[#FFFFFF1F]">
          <p className="rounded-lg bg-[#FFA80014] px-4 py-2 text-base text-[#FFA800]">
            ⚠️ ONE ATTEMPT ONLY!
            <br className="md:hidden" /> Follow all rules to qualify:
          </p>
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
          className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
          onClick={onReaded}
        >
          I Understand
        </Button>
      </>
    )
  }
}
