import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import FrontierTaskList from '@/components/robotics/task-list'
import ActivityInfo from '@/components/home/activity-info'
import QualificationList from '@/components/home/qualification-list'

import { useEffect, useState } from 'react'
import frontierApi, { FrontierItemType, MediaName } from '@/apis/frontiter.api'
import XIcon from '@/assets/robotics/x-logo.svg'
import TgIcon from '@/assets/robotics/tg-logo.svg'
import DiscordIcon from '@/assets/robotics/discord-logo.svg'
import DocIcon from '@/assets/robotics/doc-logo.svg'
import WebIcon from '@/assets/robotics/web-logo.svg'
import GetRewardGuide from '@/components/robotics/rewards-guide'
import XNYCoinIcon from '@/assets/home/xyn-coin-icon.svg?react'
import USDTCoinIcon from '@/assets/home/usdt-coin-icon.svg?react'
import PointsIcon from '@/assets/userinfo/reward-icon.svg?react'

import { Spin } from 'antd'

export default function Component() {
  const navigate = useNavigate()
  const { frontier_id } = useParams()
  const [frontierInfo, setFrontierInfo] = useState<FrontierItemType | null>(null)
  const [loading, setLoading] = useState(true)

  async function getFrontierInfo(frontier_id: string) {
    setLoading(true)
    const res = await frontierApi.getFrontierInfo(frontier_id)
    if (res.errorCode === 0) {
      setFrontierInfo(res.data)
      console.log('frontierInfo', res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!frontier_id) return
    getFrontierInfo(frontier_id)
  }, [frontier_id])

  return (
    <TransitionEffect>
      <div className="min-w-[900px]">
        <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
          <h1>Back</h1>
        </div>
        <Spin spinning={loading}>
          <div className="mb-12">
            <div className="overflow-hidden rounded-lg">
              {frontierInfo?.banner && <img src={frontierInfo?.banner} alt="" />}
            </div>
            <div className="mb-3 mt-6 flex items-center gap-6">
              <div className="text-xl font-bold">{frontierInfo?.name}</div>
              <div className="flex gap-3">
                {frontierInfo?.media_link
                  ?.filter((item) => item.value !== '')
                  ?.map((item) => {
                    const mediaIconMap = {
                      [MediaName.DOC]: DocIcon,
                      [MediaName.WEBSITE]: WebIcon,
                      [MediaName.TWITTER]: XIcon,
                      [MediaName.TELEGRAM]: TgIcon,
                      [MediaName.DISCORD]: DiscordIcon
                    }
                    const icon = mediaIconMap[item.name] || ''
                    return (
                      <a href={item.value} target="_blank">
                        <img className="cursor-pointer" src={icon} alt="" />
                      </a>
                    )
                  })}
              </div>
              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  Your Approvals{' '}
                  <strong className="text-base text-white">{frontierInfo?.adopt_count.toLocaleString()}</strong>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  Your Reward{' '}
                  {frontierInfo?.rewards
                    .filter((item) => item.reward_type !== 'POINTS')
                    .map((item) => {
                      return (
                        <div className="flex items-center gap-1" key={item.reward_type}>
                          {item.reward_type === 'XnYCoin' && <XNYCoinIcon className="size-6" />}
                          {item.reward_type === 'USDT' && <USDTCoinIcon className="size-6" />}
                          <strong className="text-base text-white">{item.reward_value.toLocaleString()}</strong>
                        </div>
                      )
                    })}
                  <div className="flex items-center gap-1">
                    <PointsIcon className="size-6" />
                    <strong className="text-base text-white">
                      {frontierInfo?.rewards
                        .find((item) => item.reward_type === 'POINTS')
                        ?.reward_value.toLocaleString() || 0}
                    </strong>
                  </div>
                </div>
                {frontierInfo?.dataset_url && (
                  <>
                    <div className="h-6 w-px bg-white/10"></div>
                    <a
                      href={frontierInfo.dataset_url}
                      className="block w-[104px] cursor-pointer rounded-3xl bg-white py-1.5 text-center text-black hover:bg-primary hover:text-white"
                      target="_blank"
                    >
                      Dataset
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="text-white/55">{frontierInfo?.description}</div>
            <ActivityInfo className="mb-6" />
          </div>
          <QualificationList task_ids={frontierInfo?.qualification ?? ''} />
          <div className="mb-6">
            <GetRewardGuide videos={frontierInfo?.videos ?? []} />
          </div>
        </Spin>
        <div>
          <FrontierTaskList />
        </div>
      </div>
    </TransitionEffect>
  )
}
