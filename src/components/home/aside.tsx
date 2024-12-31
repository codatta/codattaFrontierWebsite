import { cn } from '@udecode/cn'

import UserInfoSection from './aside-user-info'
import CheckinSection from './aside-checkin'
// import RewardReputationSection from './aside/reward-reputation-section'
// import QuestSection from './aside/quest-section'

type TProps = {
  className?: string
}

export default function Aside({ className }: TProps) {
  return (
    <div className={cn('rounded-6 overflow-hidden bg-gray-100', className)}>
      <UserInfoSection />
      <CheckinSection />
      {/* <RewardReputationSection /> */}
      {/* <QuestSection /> */}
    </div>
  )
}
