import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal from '@/components/common/video-modal'
import fashionData from '@/assets/fashion/fashion-data.jpeg'

interface VideoInt {
  img?: string
  url?: string
}

const videos: { img: string; url: string }[] = [
  {
    img: 'https://static.codatta.io/static/images/fashion-20250108-114316.jpeg',
    url: 'https://static.codatta.io/static/video/fashion-20250108-114324.mp4'
  }
]
export default function FashionHome() {
  const navigate = useNavigate()
  const [video, setVideo] = useState<VideoInt>()

  return (
    <TransitionEffect>
      <div className="">
        {/* back */}
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft size={14} onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1>Back</h1>
        </div>
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xl font-bold">Fashion</div>
            {/* <div>
              <div className="flex gap-2">
                <img src={goldCoin} alt="" className="h-10 w-10" />
                <div>
                  <div className="font-700 -mb-1 text-base">{balance}</div>
                  <div className="text-gray-5 text-xs">Your Reward</div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="text-white/60">
            Codatta Fashion is more than just a data collection platform—it is an open, collaborative network that
            connects data providers, AI developers, and brands in the e-commerce and fashion industries. By aggregating
            data from diverse sources, such as social media trends, consumer feedback, and e-commerce sales, Codatta
            offers high-quality, easily accessible data.
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-6">
          <div>
            <div className="mb-3 text-lg font-bold">How to earn rewards?</div>
            <div className="grid grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div
                  key={video.url + index}
                  className="relative min-w-20 cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() =>
                    setVideo({
                      img: video.img,
                      url: video.url
                    })
                  }
                >
                  <img src={video.img} alt="" />
                  <div className="group absolute top-0 flex size-full items-center justify-center hover:bg-[#000000]/35">
                    <img
                      src={playCircle}
                      alt=""
                      className="size-9 transition-transform duration-200 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 text-lg font-bold">Start earning rewards!</div>
            <div className="grid grid-cols-3 gap-4">
              <div onClick={() => (window.location.href = 'https://tally.so/r/nr0MX2')} className="h-full">
                <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
                  <div className="p-4 pb-3">
                    <div className="w-full overflow-hidden rounded-xl">
                      <div className="top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24]">
                        <img className="max-h-full max-w-full object-contain" src={fashionData} alt="" />
                      </div>
                    </div>
                    <div className="mb-4 mt-3 flex">
                      <div className="flex-auto font-semibold">Collect Fashion Data</div>
                      <div className="ml-2 h-[26px] flex-none rounded-2xl bg-[#875DFF]/20 px-2 py-[2px] text-[#875DFF]">
                        20 Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <VideoModal onClose={() => setVideo({})} video={video} />
      </div>
    </TransitionEffect>
  )
}
