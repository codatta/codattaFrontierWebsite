import { useEffect, useState } from 'react'

const extractDaysFromString = (str?: string): number => {
  const match = str?.match(/-food(\d+)/)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 1
}

export default function SubmissionProgress(props: { questId: string; validatedDays: number }) {
  const { questId, validatedDays } = props
  const [maxValidateDays, setMaxValidateDays] = useState(0)

  useEffect(() => {
    setMaxValidateDays(extractDaysFromString(questId))
  }, [questId])

  return (
    <div className="flex h-[26px] flex-wrap items-center justify-center bg-[#252532] text-center text-sm leading-[26px]">
      <span className="text-[#5DDD22]">{Math.min(validatedDays, maxValidateDays)}</span>/<span>{maxValidateDays}</span>
      <span className="ml-3">Days Submitted/Required Days</span>
    </div>
  )
}
