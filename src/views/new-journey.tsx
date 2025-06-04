import TransitionEffect from '@/components/common/transition-effect'
import JourneyLevels from '@/components/journey/journey-levels'
import JourneyPoints from '@/components/journey/journey-points'
import JourneyQuest from '@/components/journey/journey-quest'
import JourneyReferral from '@/components/journey/journey-referral'

export default function UserJourney() {
  return (
    <TransitionEffect className="box-border flex flex-col text-sm font-semibold">
      <div>
        <JourneyLevels />
        <JourneyPoints />
        <JourneyQuest />
        <JourneyReferral />
      </div>
    </TransitionEffect>
  )
}
