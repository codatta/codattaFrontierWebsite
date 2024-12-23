import bountyApi, { BountyType, TBounty } from '@/api-v1/bounty.api'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import BountyCard from './bounty-card'
// import BountyShareModal from './bounty-share-modal'

export default function RecommendBounty() {
  const [list, setList] = useState<TBounty[]>([])

  async function getRecommendBounty() {
    try {
      const res = await bountyApi.getBountyList(
        {
          listType: BountyType.Entity,
          status: 'NotStart',
          points_sort: 'DESC'
        },
        { current: 1, pageSize: 6 }
      )

      setList(res.data)
    } catch (err) {
      message.error(err.message)
    }
  }

  useEffect(() => {
    getRecommendBounty()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-6">
      {list.map((bounty, index) => (
        <BountyCard key={bounty.address + '-' + index} bounty={bounty}></BountyCard>
      ))}

      {/* <BountyShareModal open={!!shareItem} bounty={shareItem} type={BountyType.Entity} onClose={() => setShareItem(null)} /> */}
    </div>
  )
}
