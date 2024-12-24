import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@udecode/cn'
import { Quest, QuestOption } from '@/api-v1/task.api'

function OptionItem(props: {
  option: QuestOption
  onSelect: (option: string) => void
  selected: boolean
  checkAction: number
  answer: string[]
}) {
  const { option, onSelect, selected, answer, checkAction } = props
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!answer.includes(option.key) && checkAction && selected) {
      setShake(true)
    }
  }, [checkAction])

  function handleShakeEnd() {
    setShake(false)
    onSelect('')
  }

  return (
    <button
      className={cn(
        `flex w-full items-center gap-5 rounded-lg border px-4 py-2 text-left text-sm transition-all`,
        selected && shake
          ? 'animate animate-shake border-[rgba(217,43,43,0.88)] bg-[rgba(217,43,43,0.88)] text-white animate-duration-100 animate-twice'
          : '',
        selected && !shake ? 'bg-white text-black' : ''
      )}
      onAnimationEnd={handleShakeEnd}
      onClick={() => onSelect(option.key)}
    >
      <span>{option.statement}</span>
      <div
        className={cn(
          'w-18px h-18px ml-auto flex shrink-0 items-center justify-center rounded-full border-[1px] border-white',
          selected ? 'border-black' : ' '
        )}
      >
        <Check size={12} className={selected ? 'text-black' : `text-transparent`}></Check>
      </div>
    </button>
  )
}

export default function QuestSelect(props: { quest: Quest; indicator?: React.ReactNode; onSuccess: () => void }) {
  const { quest, indicator, onSuccess } = props
  const [current, setCurrent] = useState<string>()
  const [checkAction, setCheckAction] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  function handleSelect(key: string) {
    setCurrent(key)
    setCheckAction(0)
  }

  function handleSubmit() {
    const correct = quest.answer?.includes(current || '')
    if (correct) onSuccess()
    else {
      setCheckAction(checkAction + 1)
      setErrorMessage(quest.errorMessage || 'Incorrect answer')
    }
  }

  return (
    <div className="mx-auto max-w-screen-lg text-center">
      <div className="mb-6">
        <h1 className="mb-6 text-xl font-bold sm:text-[36px]">{quest.title}</h1>
        {indicator}
      </div>
      <div className="mb-6">{quest.content && <div dangerouslySetInnerHTML={{ __html: quest.content }}></div>}</div>
      <div className="mx-auto mb-6 max-w-[600px]">
        <div className="mb-6 flex flex-col gap-4">
          {quest.options.map((option, index) => {
            return (
              <OptionItem
                key={index}
                option={option}
                onSelect={handleSelect}
                selected={current === option.key}
                answer={quest.answer || []}
                checkAction={checkAction}
              />
            )
          })}
        </div>
        <div
          className={`text-left text-sm text-red-500 transition-all duration-300 ${errorMessage ? 'max-h-[auto]' : 'max-h-0'}`}
        >
          {errorMessage}
        </div>
      </div>
      <button className="h-[42px] w-[240px] rounded-lg bg-primary text-sm text-white" onClick={handleSubmit}>
        OK
      </button>
    </div>
  )
}
