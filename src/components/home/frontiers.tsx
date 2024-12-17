import crypto from '@/assets/home/crypto.png'
import arrowRight from '@/assets/icons/arrow-right.svg'
import { useNavigate } from 'react-router-dom'
import fashion from '@/assets/home/fashion.png'
import medical from '@/assets/home/medical.png'
import robotics from '@/assets/home/robotics.png'

const Frontiers = () => {
  const navigate = useNavigate()
  const frontiersList = [
    {
      name: 'Crypto',
      img: crypto,
      desc: 'Collecting data on wallet addresses and transaction flows enhances transparency in the crypto ecosystem. This transparency enables AI models to detect fraud, improve compliance, and promote a safer environment for all participants, fostering trust in decentralized finance.',
      active: () => navigate('/app/crypto')
    },
    {
      name: 'Fashion',
      img: fashion,
      desc: 'Codatta Fashion is more than just a data collection platform-it is an open, collaborative network that connects data providers, AI developers, and brands in the e-commerce and fashion industries. By aggregating data from diverse sources, such as social media trends, consumer feedback, and e-commerce sales, Codatta offers high-quality, easily accessible data.',
      active: () => navigate('/app/fashion')
    },
    {
      name: 'Healthcare',
      img: medical,
      desc: `Healthcare data collection is crucial for developing accurate predictive models, which analyze patient records and health metrics. This data-driven approach aids in early diagnosis, personalized treatment plans, and supports advancements in medical research, ultimately improving patient outcomes.`,
      active: () => window.open('https://healthcare.codatta.io/', '_blank')
    },
    {
      name: 'Robotics',
      img: robotics,
      desc: 'Visual data annotation is essential for training large AI models in robotics, especially for object recognition and spatial awareness. High-quality labeled data helps improve the accuracy of robotic vision, enabling robots to perform complex tasks with greater precision and adaptability.',
      active: () => navigate('/app/robotics')
    }
  ]

  return (
    <div className="mt-12">
      <h2 className="mb-3 text-lg font-bold">Recent Frontiers</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {frontiersList.map((item) => (
          <div
            className="group relative aspect-[269/243] w-full cursor-pointer overflow-hidden rounded-2xl"
            onClick={item.active}
          >
            <img
              src={item.img}
              alt=""
              className="size-full object-cover transition-all group-hover:scale-[1.2]"
            />
            <div
              className="absolute top-0 flex size-full flex-col justify-end gap-3 p-4"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0) 21.88%, #000000 100%)'
              }}
            >
              <div>
                <h2 className="mb-2 text-base font-bold">{item.name}</h2>
                <div className="line-clamp-2 text-[#A4A4A8]">{item.desc}</div>
              </div>
              <div className="flex h-8 w-[104px] flex-none cursor-pointer flex-row items-center justify-center rounded-full bg-primary">
                <span>Start</span>
                <img src={arrowRight} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Frontiers
