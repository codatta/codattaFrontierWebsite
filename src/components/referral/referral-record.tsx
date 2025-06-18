import { InviteRecord } from '@/apis/user.api'
import Empty from '@/components/common/empty'
import { referralStoreActions, useReferralStore } from '@/stores/referral.store'
import { message, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import GrowthLeaderSBTIcon from '@/assets/referral/growth-leader-sbt.png'
import LinkStarterSBTIcon from '@/assets/referral/link-starter-sbt.png'

const SBTIconMap = [GrowthLeaderSBTIcon, LinkStarterSBTIcon]

function ReferralRewardDisplay({ item }: { item: InviteRecord }) {
  if (item.reward_type === 'score') {
    return (
      <div className="inline-block rounded-full bg-[#008573]/10 px-3 py-1 font-bold text-[#008573]">
        {item.reward_value} Points
      </div>
    )
  } else if (item.reward_type === 'nft') {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-[#008573]/10 px-3 py-1 font-bold text-[#008573]">
        <img className="block h-4" src={SBTIconMap[item.soul_id || 0]} alt="" /> SBT
      </div>
    )
  }
}

const Table = () => {
  const [loading, setLoading] = useState(false)

  const { referralList } = useReferralStore()

  const { validateNumber, totalNumber } = useMemo(() => {
    const validateNumber = referralList.length
    const totalNumber = 15
    return { validateNumber, totalNumber }
  }, [referralList])

  async function fetchReferralList() {
    setLoading(true)
    try {
      await referralStoreActions.getReferralList()
    } catch (error) {
      message.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReferralList()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold">Referral History</h2>
        <div className="flex items-center">
          <div
            className="text-center"
            style={{
              background: 'linear-gradient(122.61deg, #09B8EF 35.74%, #5DFF94 91.87%), #FFFFFF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <span className="text-xl font-bold">{validateNumber}</span> valid invitations,
          </div>
          <div>
            <span className="text-xl font-bold">{totalNumber}</span> in total
          </div>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="overflow-x-auto rounded-2xl bg-white/5 px-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="w-full py-4 font-semibold">Name</th>
                <th className="p-4 text-center font-semibold">Reward</th>
                <th className="py-4 text-right font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {referralList.length > 0 ? (
                referralList.map((item, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="whitespace-nowrap py-4">{item.name || 'Anonymous'}</td>
                    <td className="whitespace-nowrap p-4">
                      <ReferralRewardDisplay item={item} />
                    </td>
                    <td className="whitespace-nowrap py-4">{dayjs(item.time).format('YYYY-MM-DD HH:mm')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    <Empty text="No referral records found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Spin>
    </div>
  )
}

export default Table
