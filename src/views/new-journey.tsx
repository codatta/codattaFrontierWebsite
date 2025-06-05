import TransitionEffect from '@/components/common/transition-effect'
import JourneyLevels from '@/components/journey/journey-levels'
import JourneyPoints from '@/components/journey/journey-points'
import JourneyQuest from '@/components/journey/journey-quest'
import JourneyReferral from '@/components/journey/journey-referral'

export default function UserJourney() {
  return (
    <TransitionEffect className="box-border flex flex-col text-sm font-semibold">
      <div className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">New Journey</h2>
        <JourneyLevels />
      </div>
      <div className="mb-10">
        <h2 className="mb-6 text-2xl font-bold">Quests</h2>
        <JourneyQuest />
      </div>
      <div>
        <h2 className="mb-1 text-2xl font-bold">Referral</h2>
        <p className="mb-6 text-sm text-gray-500">
          Once your valid referral count is reached, you'll earnthe event tier.
        </p>
        <JourneyReferral />
      </div>
      <JourneyPoints />
    </TransitionEffect>
  )
}
