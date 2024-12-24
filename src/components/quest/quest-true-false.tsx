import { Quest, QuestOption } from '@/api-v1/task.api'
import { cn } from '@udecode/cn'
import { message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

function QuestTrueFalseItem(props: {
  option: QuestOption
  checkAction: number
  onResult: (result: boolean | null) => void
}) {
  const { option, checkAction, onResult } = props
  const [selected, setSelected] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [correct, setCorrect] = useState<boolean>()
  const [shake, setShake] = useState(false)

  function handleSelect(result: boolean) {
    setSelected(result)
    setCorrect(option.answer === result)
    onResult(result === option.answer)
  }

  useEffect(() => {
    if (checkAction) {
      setError(option.errorMessage || '')
    }
    if (checkAction && !correct) setShake(true)
  }, [checkAction])

  function hendleShakeEnd() {
    setShake(false)
    setSelected(null)
    onResult(null)
  }

  return (
    <div>
      <div
        className={cn(
          `mb-3 flex flex-col items-center gap-[60px] rounded-2xl border border-[rgba(0,0,0,0.08)] bg-gray-100 px-4 py-[20px] md:flex-row md:px-6 md:py-8`,
          shake ? 'animate animate-shake animate-duration-100 animate-twice' : ''
        )}
        onAnimationEnd={hendleShakeEnd}
      >
        <div className="">{option.statement}</div>
        <div className="flex shrink-0 items-center justify-center gap-6 md:ml-auto">
          <button
            className={`h-[42px] w-[120px] rounded-lg border text-sm transition-all ${!shake && selected == true ? 'bg-white text-black' : ''} ${shake && selected == true ? 'border-[rgba(217,43,43,0.88)] bg-[rgba(217,43,43,0.88)] text-white' : ''}`}
            onClick={() => handleSelect(true)}
          >
            True
          </button>
          <button
            className={`h-[42px] w-[120px] rounded-lg border text-sm transition-all ${!shake && selected == false ? 'bg-white text-black' : ''} ${shake && selected == false ? 'border-[rgba(217,43,43,0.88)] bg-[rgba(217,43,43,0.88)] text-white' : ''}`}
            onClick={() => handleSelect(false)}
          >
            False
          </button>
        </div>
      </div>
      <div className={`text-sm text-red-500 transition-all duration-300 ${error ? 'max-h-[60px]' : 'max-h-0'}`}>
        {error}
      </div>
    </div>
  )
}

export default function QuestTrueFalse(props: { quest: Quest; onSuccess: () => void; indicator: React.ReactNode }) {
  const { quest, indicator } = props
  const [checkAction, setCheckAction] = useState(0)
  const results = useRef(new Map<string, boolean | null>())

  useEffect(() => {
    quest.options.forEach((item) => {
      results.current.set(item.key, null)
    })
  }, [quest.options])

  function handleSubmit() {
    const answers = Array.from(results.current.values())
    const correctCount = answers.filter((item) => item === true).length
    const emptyCount = answers.filter((item) => item === null).length
    if (emptyCount > 0) {
      message.error('Please select an answer for all questions')
    } else if (correctCount === quest.options.length) {
      props.onSuccess()
    } else {
      setCheckAction(checkAction + 1)
    }
  }

  function handleResult(questOption: QuestOption, result: boolean) {
    results.current.set(questOption.key, result)
  }

  return (
    <div className="mx-auto max-w-[1440px] text-center text-base">
      <div className="mb-12">
        <h1 className="mb-6 text-2xl font-bold sm:text-4xl">{quest.title}</h1>
        {indicator}
      </div>
      <div className="mb-12 flex flex-col gap-4 text-left sm:gap-6">
        {quest.options.map((item) => (
          <QuestTrueFalseItem
            option={item}
            key={item.key}
            checkAction={checkAction}
            onResult={(result) => handleResult(item, result || false)}
          />
        ))}
      </div>
      <button className="h-[42px] w-[240px] rounded-lg bg-primary text-sm text-white" onClick={handleSubmit}>
        OK
      </button>
    </div>
  )
}
