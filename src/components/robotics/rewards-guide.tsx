import { useState } from 'react'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal from './video-modal'

interface VideoInt {
  img?: string
  url?: string
}

const RoboticsRewordGuide = () => {
  const [video, setVideo] = useState<VideoInt>()
  return (
    <div>
      <div className="mb-3 text-lg font-bold">How to earn rewards?</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div
          className="relative min-w-20 cursor-pointer overflow-hidden rounded-2xl"
          onClick={() =>
            setVideo({
              img: 'https://static.codatta.io/robotics/e12b25a5e944ea237854d30b2917845d791b002d.png',
              url: 'https://static.codatta.io/robotics/783aa9bf88f924930e51cd279b64da970f86c7a0.mp4'
            })
          }
        >
          <img src="https://static.codatta.io/robotics/e12b25a5e944ea237854d30b2917845d791b002d.png" alt="" />
          <div className="group absolute top-0 flex size-full items-center justify-center bg-[#000000]/15 transition-all hover:bg-[#000000]/35">
            <img src={playCircle} alt="" className="size-9 transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div>
      </div>

      <VideoModal onClose={() => setVideo({})} video={video!} />
    </div>
  )
}

export default RoboticsRewordGuide
