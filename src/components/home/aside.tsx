import { cn } from '@udecode/cn'

import UserInfoSection from './aside-user-info'
import CheckinSection from './aside-checkin'
import RewardSection from './aside-reward'

type TProps = {
  className?: string
}

export default function Aside({ className }: TProps) {
  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden rounded-2xl border border-y-0 border-transparent md:w-[284px]',
        className
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.125) 0%, rgba(255, 255, 255, 0) 100%)'
      }}
    >
      <div className="flex size-full flex-col bg-gray-100 pb-8">
        <div className="absolute left-0 top-0 size-full bg-[#252532]"></div>
        <UserInfoSection />
        <CheckinSection />
        <RewardSection />
      </div>
    </div>
  )
}
