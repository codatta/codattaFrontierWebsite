import Head from '@/components/referral/referral-head'
import Table from '@/components/referral/referral-table'
import TransitionEffect from '@/components/common/transition-effect'

export default function Component() {
  return (
    <TransitionEffect className="flex flex-col text-white/85">
      <h2 className="text-3xl font-bold">Referral</h2>
      <div className="flex gap-8 pb-[100px]">
        <div className="">
          <Head />
          <Table />
        </div>
      </div>
    </TransitionEffect>
  )
}
