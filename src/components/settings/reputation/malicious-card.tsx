import { cn } from '@udecode/cn'

interface MaliciousCardProps {
  score?: number | null
  description: string
  className?: string
}

const Icon = ({ size = 48 }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#404049" />
    <rect
      x="0.5"
      y="0.5"
      width="47"
      height="47"
      rx="7.5"
      stroke="url(#paint0_linear_44987_31656)"
      stroke-opacity="0.14"
    />
    <path
      d="M27.936 14.5L33.501 20.065V27.935L27.936 33.5H20.0659L14.501 27.935V20.065L20.0659 14.5H27.936ZM23.0002 26.9992V28.9992H25.0002V26.9992H23.0002ZM23.0002 18.9993V24.9992H25.0002V18.9993H23.0002Z"
      fill="#FFA800"
    />
    <defs>
      <linearGradient
        id="paint0_linear_44987_31656"
        x1="2"
        y1="3.22858e-07"
        x2="48"
        y2="48"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="0.265" stop-color="#CCCCCC" stop-opacity="0" />
        <stop offset="0.6325" stop-color="#B3B3B3" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
    </defs>
  </svg>
)

export default function MaliciousCard({ score, description, className }: MaliciousCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border border-[#FFFFFF1F] bg-[#1C1C26] p-6',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Icon size={48} />
        <div>
          <div className="mb-1 text-lg font-bold text-white">Malicious Behavior</div>
          <div className="text-xs text-[#BBBBBE]">{description}</div>
        </div>
      </div>
      <div className="rounded-full bg-[#FFFFFF1F] px-3 text-2xl font-semibold leading-[44px] text-white">
        {score === undefined || score === null ? '--' : <>{score === 0 ? '0.0' : `-${Math.abs(score).toFixed()}`}</>}
      </div>
    </div>
  )
}
