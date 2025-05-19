import arrowRight from '@/assets/icons/arrow-right.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { FrontierListItem } from '@/apis/frontiter.api'
import { frontierStoreActions, useFrontierStore } from '@/stores/frontier.store'
import { message, Spin } from 'antd'

// interface FrontierItem {
//   name: string
//   img: string
//   desc: string
//   active: () => void
// }

const FixedFrontierRouteMap: { [key: string]: string } = {
  Crypto: '/app/crypto',
  Fashion: '/app/frontier/fashion',
  Healthcare: 'https://healthcare.codatta.io'
}

const Frontiers = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const { frontierList } = useFrontierStore()

  const FixedfrontiersList: FrontierListItem[] = [
    {
      creator_id: '',
      description: {
        frontier_desc:
          'Collecting data on wallet addresses and transaction flows enhances transparency in the crypto ecosystem. This transparency enables AI models to detect fraud, improve compliance, and promote a safer environment for all participants, fostering trust in decentralized finance.'
      },
      frontier_id: '',
      logo_url: 'https://static.codatta.io/static/images/38864bef4afa6e626236662e8b309e41494e51cc.png',
      reputation_permission: 0,
      status: '',
      title: 'Crypto'
    },
    {
      creator_id: '',
      description: {
        frontier_desc:
          'Codatta Fashion is more than just a data collection platform-it is an open, collaborative network that connects data providers, AI developers, and brands in the e-commerce and fashion industries. By aggregating data from diverse sources, such as social media trends, consumer feedback, and e-commerce sales, Codatta offers high-quality, easily accessible data.'
      },
      frontier_id: '',
      logo_url: 'https://static.codatta.io/static/images/c9c55fb1cc2c2635026dc46bd19186d0d5167580.png',
      reputation_permission: 0,
      status: '',
      title: 'Fashion'
    },
    {
      creator_id: '',
      description: {
        frontier_desc:
          'Healthcare data collection is crucial for developing accurate predictive models, which analyze patient records and health metrics. This data-driven approach aids in early diagnosis, personalized treatment plans, and supports advancements in medical research, ultimately improving patient outcomes.'
      },
      frontier_id: '',
      logo_url: 'https://static.codatta.io/static/images/a7610fc644a5362018139079aac301b53a0c817f.png',
      reputation_permission: 0,
      status: '',
      title: 'Healthcare'
    }
  ]

  const frontiers = useMemo(() => {
    return [...frontierList, ...FixedfrontiersList]
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
    if (frontier.frontier_id === '') {
      const url = FixedFrontierRouteMap[frontier.title]
      if (url.includes('http')) window.open(url)
      else navigate(url)
    } else {
      navigate(`/app/frontier/${frontier.frontier_id}`)
    }
  }

  useEffect(() => {
    getFrontiers()
  }, [])

  return (
    <div className="mt-12">
      <h2 className="mb-3 text-lg font-bold">Recent Frontiers</h2>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {frontiers.map((item) => (
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
