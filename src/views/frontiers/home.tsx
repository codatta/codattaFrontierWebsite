import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import FrontierTaskList from '@/components/robotics/task-list'
import ActivityInfo from '@/components/home/activity-info'

import { useEffect, useState } from 'react'
import frontierApi, { FrontierItemType, MediaName } from '@/apis/frontiter.api'
import XIcon from '@/assets/robotics/x-logo.svg'
import TgIcon from '@/assets/robotics/tg-logo.svg'
import DiscordIcon from '@/assets/robotics/discord-logo.svg'
import DocIcon from '@/assets/robotics/doc-logo.svg'
import WebIcon from '@/assets/robotics/web-logo.svg'
import GetRewardGuide from '@/components/robotics/rewards-guide'
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
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!frontier_id) return
    getFrontierInfo(frontier_id)
  }, [frontier_id])

  return (
    <TransitionEffect>
      <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} />
        <h1>Back</h1>
      </div>
      <Spin spinning={loading}>
        <div className="mb-12">
          <div className="overflow-hidden rounded-lg">
            {frontierInfo?.banner && <img src={frontierInfo?.banner} alt="" />}
          </div>
          <div className="mb-3 mt-6 flex items-center justify-between">
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
          </div>
          <div className="text-white/55">{frontierInfo?.description}</div>
          <ActivityInfo className="mb-6" />
        </div>
        <div className="mb-6">
          <GetRewardGuide videos={frontierInfo?.videos ?? []} />
        </div>
      </Spin>
      <div>
        <FrontierTaskList />
      </div>
    </TransitionEffect>
  )
}
