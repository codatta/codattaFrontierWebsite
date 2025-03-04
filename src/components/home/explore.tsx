import calorieAi from '@/assets/home/calorie-ai.png'
import vault from '@/assets/home/vault.png'
import { useEffect, useState } from 'react'
import { getFrontiers } from '@/stores/home.store'
import { FrontierItem } from '@/apis/frontiter.api'
import arrowRight from '@/assets/icons/arrow-right.svg'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

const Frontiers = () => {
  const navigate = useNavigate()
  const [frontiersArray, setFrontiersArray] = useState<Array<FrontierItem>>([])
  const [loading, setLoading] = useState(true)
  const explorelist = [
    // {
    //   title: 'Robotics',
    //   logo_url: robotics,
    //   description: 'Visual data annotation is essential for training large AI models in robotics, especially for object recognition and spatial awareness. High-quality labeled data helps improve the accuracy of robotic vision, enabling robots to perform complex tasks with greater precision and adaptability.',
    // },
    {
      title: 'Food Science',
      logo_url: calorieAi,
      description:
        'From a fitness perspective, Food Science AI personalizes nutritional intake recommendations in recipes. It helps users manage their nutritional balance and dietary composition to promote a healthier lifetstyle.'
    },
    {
      title: 'Vault',
      logo_url: vault,
      description:
        'Vault focuses on securely managing users, valuable personal data, ensuring privacy while unlocking its potential value. Users can control and monetize their data safely, maintaining complete ownership and control over their personal information.'
    }
    // {
    //   title: 'Fashion',
    //   logo_url: fashion,
    //   description: 'We are committed to collecting fashion data through multiple channels, including social media trends, consumer feedback, and e-commerce sales analysis, to help brands gain deeper insights into market dynamics and consumer preferences. By analyzing this data, we can identify emerging trends and popular styles, providing strong decision-making support for brands. Whether optimizing product lines, adjusting marketing strategies, or enhancing customer experiences, precise data insights empower brands to stand out in a competitive landscape.',
    // },
  ]

  useEffect(() => {
    getFrontiers().then((res) => {
      setFrontiersArray(res.errorCode === 0 ? res.data || [] : [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="mt-6">
      <Spin spinning={loading}>
        <h2 className="mb-3 text-lg font-bold">{frontiersArray.length > 0 ? 'More Frontiers' : 'Explore More'}</h2>
        {frontiersArray.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {frontiersArray.map((item) => (
              <div
                key={item.frontier_id}
                className="group relative aspect-[269/243] w-full cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => {
                  navigate(`/app/frontier/${item.frontier_id}`, { state: { name: item.title, desc: item.description } })
                }}
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
                    <div className="line-clamp-2 text-[#A4A4A8]">{item.description}</div>
                  </div>
                  <div className="flex h-8 w-[104px] flex-none cursor-pointer flex-row items-center justify-center rounded-full bg-primary">
                    <span>Start</span>
                    <img src={arrowRight} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              {explorelist.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-2xl bg-[#252532] hover:border-primary hover:shadow-primary sm:flex"
                >
                  <div className="flex-none overflow-hidden rounded-2xl sm:w-[260px]">
                    <img src={item.logo_url} alt="" className="aspect-[260/148] object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col overflow-hidden p-6">
                    <h2 className="text-base font-bold">{item.title}</h2>
                    <div className="mt-3 text-sm text-white/50 sm:line-clamp-3">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Spin>
    </div>
  )
}

export default Frontiers
