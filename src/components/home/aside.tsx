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
        'relative flex w-[344px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-transparent bg-gray-100',
        className
      )}
    >
      <div className="absolute left-0 top-0 size-full bg-[#252532]"></div>
      <UserInfoSection />
      <CheckinSection />
      <RewardSection />
    </div>
  )
}
