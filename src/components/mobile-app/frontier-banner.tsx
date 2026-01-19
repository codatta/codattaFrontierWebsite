import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import frontierApi, { FrontierItemType } from '@/apis/frontiter.api'

export default function MobileAppFrontierBanner({ frontieId, isFeed }: { frontieId?: string; isFeed?: boolean }) {
  const [frontierInfo, setFrontierInfo] = useState<FrontierItemType | null>(null)
  console.log('isFeed', isFeed, frontieId)

  if (!frontieId) {
    console.error('frontier_id is missing!')
  }

  async function getFrontierInfo(frontieId: string) {
    const res = await frontierApi.getFrontierInfo(frontieId)
    if (res.errorCode === 0) {
      setFrontierInfo(res.data)
      console.log('frontierInfo', res.data)
    }
  }

  useEffect(() => {
    if (!frontieId || !isFeed) return
    getFrontierInfo(frontieId)
  }, [frontieId, isFeed])
  return frontierInfo ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="px-4 pb-6"
    >
      <div className="flex rounded-[26px] bg-white p-4 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]">
        <div className={frontierInfo.logo_url ? 'mr-3 size-[56px] overflow-hidden rounded-xl' : 'w-0'}>
          <img src={frontierInfo.logo_url} alt="" className="size-full object-contain" />
        </div>
        <div>
          <div className="text-xl font-bold text-black">{frontierInfo.name}</div>
          <div className="mt-1 text-[15px] leading-[18px] text-[#999999]">{frontierInfo.description}</div>
        </div>
      </div>
    </motion.div>
  ) : null
}
