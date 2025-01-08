import { useState } from 'react'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal, { type VideoItem } from '@/components/common/video-modal'

const videos: { img: string; url: string }[] = [
  {
    img: 'https://static.codatta.io/static/images/validation-20250108.jpg',
    url: 'https://static.codatta.io/static/video/validation-3.1-20250108.mp4'
  },
  {
    img: 'https://static.codatta.io/static/images/submission-3.1-20250108.jpg',
    url: 'https://static.codatta.io/static/video/submission-3.1-20250108.mp4'
  },
  {
    img: 'https://static.codatta.io/static/images/professional-3.1-20250108.jpg',
    url: 'https://static.codatta.io/static/video/professional-3.1-20250108.mp4'
  }
]

const Index = () => {
  const [video, setVideo] = useState<VideoItem>()
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
            <div className="group absolute top-0 flex size-full items-center justify-center bg-[#00000010] transition-all hover:bg-[#00000024]">
              <img src={playCircle} alt="" className="size-9 transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
        ))}
        {/* <div
          className="rounded-4 relative min-w-20 cursor-pointer overflow-hidden bg-cover   bg-center bg-left-top bg-no-repeat"
          style={{ backgroundImage: `url(${bounty}) ` }}
          onClick={() =>
            setVideo({
              img: bounty,
              url: 'https://static.codatta.io/static/video/84de23f8d5b86764ca5243bf7d434f3569b1f197.mp4',
            })
          }
        >
          <div className="hover:bg-[#000000]/36  group absolute top-0 flex h-full w-full items-center justify-center">
            <img src={playCircle} alt="" className="h-9 w-9 transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div> */}
      </div>
      <VideoModal onClose={() => setVideo({})} video={video} />
    </div>
  )
}

export default Index
