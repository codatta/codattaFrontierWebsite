import arrowRight from '@/assets/icons/arrow-right.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { FrontierListItem } from '@/apis/frontiter.api'
import { frontierStoreActions, useFrontierStore } from '@/stores/frontier.store'
import { message, Spin } from 'antd'

const Frontiers = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const { frontierList } = useFrontierStore()

  const displayFrontiers = useMemo(() => {
    return frontierList.filter((item) => {
      return !['FOOD_TPL_000002', 'FOOD_TPL_000003', 'FOOD_TPL_000004', 'FOOD_TPL_000005'].includes(
        item.template_ext?.template_id || ''
      )
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
              className="group relative aspect-[269/243] w-full cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => handleFrontierClick(item)}
            >
              <img
                src={item.logo_url}
                alt=""
                className="size-full object-cover transition-all group-hover:scale-[1.2]"
              />
              <div
                className="absolute top-0 flex size-full flex-col justify-end gap-3 p-4"
                style={{
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 21.88%, #000000 100%)'
                }}
              >
                <div>
                  <h2 className="mb-2 text-base font-bold">{item.title}</h2>
                  <div className="line-clamp-2 text-[#A4A4A8]">{item.description.frontier_desc}</div>
                </div>
                <div className="flex h-8 w-[104px] flex-none cursor-pointer flex-row items-center justify-center rounded-full bg-primary">
                  <span>Start</span>
                  <img src={arrowRight} alt="" />
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
