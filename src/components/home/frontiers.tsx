import { message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import arrowRight from '@/assets/icons/arrow-right.svg#file'
import badgeIcon from '@/assets/home/badge.svg#file'
import Hourglass from '@/assets/home/hourglass.svg?react'
import XNYCoinIcon from '@/assets/home/xyn-coin-icon.svg?react'
import USDTCoinIcon from '@/assets/home/usdt-coin-icon.svg?react'

import { FrontierListItem } from '@/apis/frontiter.api'
import { frontierStoreActions, useFrontierStore } from '@/stores/frontier.store'
import { formatNumber } from '@/utils/str'

const Frontiers = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const { frontierList } = useFrontierStore()

  const displayFrontiers = useMemo(() => {
    return frontierList
      .filter((item) => {
        return (
          !['FOOD_TPL_000002', 'FOOD_TPL_000003', 'FOOD_TPL_000004', 'FOOD_TPL_000005'].includes(
            item.template_ext?.template_id || ''
          ) && !item.description.hide
        )
      })
      .map((item) => {
        return {
          ...item,
          activities:
            item.activities?.filter((activity) => {
              return activity.status === 'ACTIVE'
            }) || []
        }
      })
  }, [frontierList])

  async function getFrontiers() {
    setLoading(true)
    try {
      await frontierStoreActions.getFrontierList()
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFrontierClick(frontier: FrontierListItem) {
    if (frontier.frontier_id === 'Crypto') {
      navigate('/app/crypto')
    } else if (frontier.frontier_id === 'Fashion') {
      navigate('/app/frontier/fashion')
    } else if (frontier.frontier_id === 'Healthcare') {
      window.open('https://healthcare.codatta.io')
    } else {
      navigate(`/app/frontier/${frontier.frontier_id}`)
    }
  }

  useEffect(() => {
    getFrontiers()
  }, [])

  return (
    <div className="">
      <h2 className="mb-3 text-lg font-bold">Recent Frontiers</h2>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {displayFrontiers.map((item) => (
            <div
              key={item.title}
              className="group relative aspect-[269/243] cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => handleFrontierClick(item)}
            >
              <img
                src={item.logo_url}
                alt=""
                className="size-full object-cover transition-all group-hover:scale-[1.2]"
              />
              <div
                className="absolute top-0 flex size-full flex-col justify-end gap-3 py-2"
                style={{
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 21.88%, #000000 100%)'
                }}
              >
                {item.activities?.[0] && (
                  <div
                    className="absolute right-4 top-2 flex size-8 items-center justify-center bg-cover bg-center text-base font-bold text-white"
                    style={{ backgroundImage: `url(${badgeIcon})` }}
                  >
                    {item.activities?.[0].min_ranking_grade || 'S'}
                  </div>
                )}
                <div>
                  <h2 className="mb-2 flex items-center justify-between px-4 text-base font-bold">
                    <span>{item.title}</span>
                    {item.activities?.[0] ? (
                      <div className="flex items-center text-sm font-normal">
                        <Hourglass className="mr-1" />
                        <span>{item.activities?.[0].days_left || 0}</span>D
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </h2>
                  <div className="relative bg-[#0000000A] px-4 py-2">
                    <div className="absolute inset-0 size-full blur-sm" />
                    <div className="relative flex items-center justify-between gap-5">
                      {item.activities?.[0] ? (
                        <div className="flex w-full flex-none cursor-pointer items-center justify-between gap-1 rounded-full bg-primary px-3 py-[6px] text-xs">
                          <div className="flex items-center gap-[2px]">
                            {item.activities?.[0].reward_asset_type === 'XnYCoin' && <XNYCoinIcon className="size-7" />}
                            {item.activities?.[0].reward_asset_type === 'USDT' && <USDTCoinIcon className="size-7" />}
                            <span className="text-lg font-bold text-[#FCC800]">
                              {formatNumber(item.activities?.[0].total_asset_amount || 0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-[2px] text-xs">
                            <span>Start</span>
                            <img src={arrowRight} alt="" className="size-[14px]" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="line-clamp-2 text-[#A4A4A8]">{item.description.frontier_desc}</div>
                          <div className="flex h-[30px] w-[98px] flex-none cursor-pointer items-center justify-center gap-1 rounded-full bg-primary text-xs">
                            <span>Start</span>
                            <img src={arrowRight} alt="" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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
