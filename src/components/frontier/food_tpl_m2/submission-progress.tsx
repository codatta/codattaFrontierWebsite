export default function SubmissionProgress(props: { current: number; target: number }) {
  const { current = 0, target = 0 } = props
  return (
    <div className="flex h-[26px] flex-wrap items-center justify-center bg-[#252532] text-center text-sm leading-[26px]">
      <span className="text-[#5DDD22]">{Math.min(current, target)}</span>/<span>{target}</span>
      <span className="ml-3">Days Submitted/Required Days</span>
    </div>
  )
}
