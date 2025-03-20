import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import TaskList from '@/components/robotics/task-list'
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
  const { state } = useLocation()
  const { frontier_id } = useParams()
  const [frontierInfo, setFrontierInfo] = useState<FrontierItemType | null>(null)
  const [loading, setLoading] = useState(true)
  console.log(state, frontier_id)

  useEffect(() => {
    if (!frontier_id) return
    frontierApi
      .getFrontierInfo(frontier_id)
      .then((res) => {
        console.log(res)
        if (res.errorCode === 0) {
          setFrontierInfo(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [frontier_id])

  return (
    <TransitionEffect>
      <Spin spinning={loading}>
        <div className="">
          <div className="mb-6 flex items-center gap-2">
            <ArrowLeft size={14} onClick={() => navigate(-1)} className="cursor-pointer" />
            <h1>Back</h1>
          </div>
          <div className="mb-12">
            {frontierInfo?.banner && <img src={frontierInfo?.banner} alt="" />}
            <div className="mb-3 mt-6 flex items-center justify-between">
              <div className="text-xl font-bold">{frontierInfo?.name}</div>
              <div className="flex gap-3">
                {frontierInfo?.media_link?.map((item) => {
                  const icon =
                    item.name === MediaName.DOC
                      ? DocIcon
                      : item.name === MediaName.WEBSITE
                        ? WebIcon
                        : item.name === MediaName.TWITTER
                          ? XIcon
                          : item.name === MediaName.TELEGRAM
                            ? TgIcon
                            : item.name === MediaName.DISCORD
                              ? DiscordIcon
                              : ''
                  return (
                    <a href={item.value} target="_blank">
                      <img className="cursor-pointer" src={icon} alt="" />
                    </a>
                  )
                })}
              </div>
            </div>
            <div className="text-white/55">{frontierInfo?.description}</div>
          </div>
          <div className="flex flex-col gap-6">
            <GetRewardGuide videos={frontierInfo?.videos ?? []} />
            <TaskList />
          </div>
        </div>
      </Spin>
    </TransitionEffect>
  )
}
