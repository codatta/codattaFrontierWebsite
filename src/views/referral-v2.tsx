import ReferralInvite from '@/components/referral/referral-invite'
import ReferralRecord from '@/components/referral/referral-record'
import TransitionEffect from '@/components/common/transition-effect'
import ReferralProgress from '@/components/referral/referral-progress'

export default function Component() {
  return (
    <TransitionEffect className="flex flex-col text-white/85">
      <h2 className="mb-6 text-3xl font-bold">Referral</h2>
      <div className="pb-[100px]">
        <ReferralProgress />
        <ReferralInvite className="mb-6" />
        <ReferralRecord />
      </div>
    </TransitionEffect>
  )
}
