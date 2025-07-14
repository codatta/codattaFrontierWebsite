export default function SubmissionProgress(props: { maxValidateDays: number; validatedDays: number }) {
  const { maxValidateDays, validatedDays } = props

  return (
    <div className="flex h-[26px] flex-wrap items-center justify-center bg-[#252532] text-center text-sm leading-[26px]">
      <span className="text-[#5DDD22]">{Math.min(validatedDays, maxValidateDays)}</span>/<span>{maxValidateDays}</span>
      <span className="ml-3">Days Submitted/Required Days</span>
    </div>
  )
}
