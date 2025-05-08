import { useState } from 'react'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal from './video-modal'
import { VideoItem } from '@/apis/frontiter.api'

interface VideoInt {
  img?: string
  url?: string
}

const defaultVideos: VideoItem[] = [
  {
    image_url: 'https://static.codatta.io/static/images/robotics-l1-20250109-100820.jpeg',
    video_url: 'https://static.codatta.io/static/video/Robotics-L1-20250108-114248_v2.mp4',
    video_id: 'Robotics-L1-20250108-114248_v2'
  },
  {
    image_url: 'https://static.codatta.io/static/images/robotics-l3-20250109-100839.jpeg',
    video_url: 'https://static.codatta.io/static/video/Robotics-L3-20250108-114304_v2.mp4',
    video_id: 'Robotics-L3-20250108-114304_v2'
  }
]
const RoboticsRewordGuide = ({ videos = defaultVideos }: { videos?: Array<VideoItem> }) => {
  const [video, setVideo] = useState<VideoInt>()
  return (
    <div>
      <div className="mb-3 text-lg font-bold">How to earn rewards?</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {videos.map((video, index) => (
          <div
            key={video?.video_url ?? '' + index}
            className="relative h-[165px] w-[264px] min-w-20 cursor-pointer overflow-hidden rounded-2xl"
            onClick={() =>
              setVideo({
                img: video?.image_url,
                url: video?.video_url
              })
            }
          >
            {video.image_url && <img className="h-[165px] w-[264px]" src={video.image_url} alt="" />}
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
