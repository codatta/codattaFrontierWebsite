import { ChevronLeft, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import frontierApi, { FrontierItemType } from '@/apis/frontiter.api'

interface MobileAppFrontierHeaderProps {
  title: string | React.ReactNode
  frontieId?: string
  canSubmit: boolean
  showSubmitButton: boolean
  onBack?: () => void
  onSubmit?: () => void
}

export default function MobileAppFrontierHeader(props: MobileAppFrontierHeaderProps) {
  const { title, canSubmit, showSubmitButton, onBack, onSubmit } = props

  return (
    <div className="text-black">
      <div className="h-[76px]"></div>
      <div className="fixed top-0 z-10 grid w-full grid-cols-[44px_1fr_44px] bg-gradient-to-b from-[#F8F8F8] via-[#F8F8F8BB] to-[#F8F8F800] p-4 text-[17px]">
        <button
          onClick={onBack}
          className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
        >
          <ChevronLeft size={24}></ChevronLeft>
        </button>
        <div className="flex items-center justify-center">{title}</div>
        {showSubmitButton && (
          <button
            className="flex size-[44px] items-center justify-center rounded-full bg-[#40E1EF]/90 text-white shadow-app-btn backdrop-blur-sm transition-all disabled:bg-black/5 disabled:text-[#bbb]"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            <ArrowUp size={24}></ArrowUp>
          </button>
        )}
      </div>
      <MobileAppFrontierBanner frontieId={props.frontieId} />
    </div>
  )
}

export function MobileAppFrontierBanner({ frontieId }: { frontieId?: string }) {
  const isFeed = location.search.includes('feed=1')
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
          <div className="text-xl font-bold">{frontierInfo.name}</div>
          <div className="text-[15px] leading-[18px] text-[#999999]">{frontierInfo.description}</div>
        </div>
      </div>
    </motion.div>
  ) : null
}
