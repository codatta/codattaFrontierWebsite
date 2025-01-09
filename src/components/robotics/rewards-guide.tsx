import { useState } from 'react'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal from './video-modal'

interface VideoInt {
  img?: string
  url?: string
}

const videos: { img: string; url: string }[] = [
  {
    img: 'https://static.codatta.io/static/images/robotics-l1-20250109-100820.jpeg',
    url: 'https://static.codatta.io/static/video/robotics-l1-20250108-114248.mp4'
  },
  {
    img: 'https://static.codatta.io/static/images/robotics-l3-20250109-100839.jpeg',
    url: 'https://static.codatta.io/static/video/robotics-l3-20250108-114304.mp4'
  }
]
const RoboticsRewordGuide = () => {
  const [video, setVideo] = useState<VideoInt>()
  return (
    <div>
      <div className="mb-3 text-lg font-bold">How to earn rewards?</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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
            <div className="group absolute top-0 flex size-full items-center justify-center bg-[#000000]/15 transition-all hover:bg-[#000000]/35">
              <img src={playCircle} alt="" className="size-9 transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
        ))}
      </div>
      <VideoModal onClose={() => setVideo({})} video={video!} />
    </div>
  )
}

export default RoboticsRewordGuide
