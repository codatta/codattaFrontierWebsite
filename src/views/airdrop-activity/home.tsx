import AirdropActivityHero from '@/components/airdrop-activity/hero'
import AirdropActivityFrontierCard from '@/components/airdrop-activity/frontier-card'
import { useEffect, useState } from 'react'
import { airdropActivityActions, useAirdropActivityStore } from '@/stores/airdrop-activity.store'
import { message } from 'antd'
import TransitionEffect from '@/components/common/transition-effect'

export default function AirdropActivityHome() {
  const [page] = useState(1)
  const { currentAirdropSeasonId, currentAirdropFrontierList } = useAirdropActivityStore()

  const pageSize = 20

  async function fetchAirdropFrontierList(seasonId: string, page: number, pageSize: number) {
    try {
      await airdropActivityActions.getAirdropFrontierList(seasonId, page, pageSize)
      // setTotal(res.count)
    } catch (err) {
      message.error(err.message)
    }
  }

  useEffect(() => {
    if (!currentAirdropSeasonId) return
    fetchAirdropFrontierList(currentAirdropSeasonId, page, pageSize)
  }, [page, currentAirdropSeasonId])

  return (
    <TransitionEffect>
      <div className="mb-12">
        <AirdropActivityHero></AirdropActivityHero>
      </div>
      <h2 className="mb-6 text-xl font-bold">Frontier</h2>
      <div className="mb-6 flex flex-col gap-4">
        {currentAirdropFrontierList?.map((item) => (
          <AirdropActivityFrontierCard key={item.frontier_id} frontier={item} />
        ))}
      </div>
      {/* <div className='f'> */}
      {/* <Pagination total={total} pageSize={pageSize} current={page} onChange={(page) => setPage(page)}></Pagination> */}
      {/* </div> */}
    </TransitionEffect>
  )
}
