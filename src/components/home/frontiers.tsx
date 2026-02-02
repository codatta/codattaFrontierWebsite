import { message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import XNYCoinIcon from '@/assets/home/xyn-coin-icon.svg?react'
import USDTCoinIcon from '@/assets/home/usdt-coin-icon.svg?react'
import StarImage from '@/assets/frontier/home/stars.png'

import { frontierStoreActions, useFrontierStore } from '@/stores/frontier.store'
import { formatNumber } from '@/utils/str'
import { useUserStore } from '@/stores/user.store'

const Frontiers = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const { frontierList } = useFrontierStore()
  const { info } = useUserStore()

  const displayFrontiers = useMemo(() => {
    return frontierList.map((item) => {
      const activity =
        item.activities?.find((activity) => {
          return activity.status === 'ACTIVE'
        }) || null

      return {
        frontier: item,
        activity: activity
      }
    })
  }, [frontierList])

  async function getFrontiers(channel: string) {
    setLoading(true)
    try {
      await frontierStoreActions.getFrontierList(channel)
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFrontierClick(frontier_id: string) {
    if (frontier_id === 'Crypto') {
      navigate('/app/crypto')
    } else if (frontier_id === 'Fashion') {
      navigate('/app/frontier/fashion')
    } else if (frontier_id === 'Healthcare') {
      window.open('https://healthcare.codatta.io')
    } else {
      navigate(`/app/frontier/${frontier_id}`)
    }
  }

  useEffect(() => {
    getFrontiers(info?.user_data?.channel || '')
  }, [info])

  return (
    <div className="">
      <h2 className="mb-3 text-lg font-bold">Recent Frontiers</h2>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {displayFrontiers.map(({ frontier, activity }) => (
            <div
              key={frontier.frontier_id}
              className="group relative aspect-[446/298] cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => handleFrontierClick(frontier.frontier_id)}
            >
              <img
                src={frontier.logo_url}
                alt={frontier.title}
                className="size-full object-cover transition-all group-hover:scale-[1.2]"
              />
              <div
                className="absolute top-0 flex size-full flex-col justify-end gap-1.5 p-4"
                style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 44.79%, #000000 100%)' }}
              >
                {activity && (
                  <div className="flex items-center gap-1 self-start rounded-3xl bg-black/20 p-1.5 backdrop-blur-sm">
                    {activity.reward_asset_type === 'USDT' && <USDTCoinIcon className="size-6" />}
                    {activity.reward_asset_type === 'XnYCoin' && <XNYCoinIcon className="size-6" />}
                    <div className="text-base font-bold text-[#FCC800]">
                      {formatNumber(activity.total_asset_amount || 0, 2)}
                    </div>
                  </div>
                )}
                <div className="mt-auto truncate text-base font-bold lg:text-lg">{frontier.title}</div>
                <div className="flex">
                  <div className="flex items-center">
                    {frontier.avatars.map((item, index) => {
                      return (
                        <div
                          key={item}
                          className={`relative ${index > 0 ? '-ml-2' : ''} flex size-6 shrink-0 items-center justify-center rounded-full border border-white`}
                        >
                          <img src={item} className="size-full rounded-full object-cover" />
                        </div>
                      )
                    })}
                    <div className="ml-1.5 text-sm">{frontier.participants_show}</div>
                  </div>
                  {frontier.difficulty_level && (
                    <div className="ml-auto flex items-center">
                      {Array.from({ length: Math.floor(frontier.difficulty_level) }).map((_) => (
                        <img className="mx-px size-[17px]" src={StarImage} alt="star" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  )
}

export default Frontiers
