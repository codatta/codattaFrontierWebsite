import { useState } from 'react'
import playCircle from '@/assets/common/play-circle.png'
import VideoModal, { type VideoItem } from '@/components/common/video-modal'

const Index = () => {
  const [video, setVideo] = useState<VideoItem>()
  return (
    <div>
      <div className="mb-3 text-lg font-bold">How to earn rewards?</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div
          className="relative min-w-20 cursor-pointer overflow-hidden rounded-2xl"
          onClick={() =>
            setVideo({
              img: 'https://static.codatta.io/static/images/ae8c866f59ee8af114ac27339c6f2bd3a1a105dc.jpg',
              url: 'https://static.codatta.io/static/video/ece60d1413c315b2559f0cf6cab3033b5de2a4ad.mp4'
            })
          }
        >
          <img
            src={
              'https://static.codatta.io/static/images/ae8c866f59ee8af114ac27339c6f2bd3a1a105dc.jpg'
            }
            alt=""
          />
          <div className="group absolute top-0 flex size-full items-center justify-center bg-[#00000010] transition-all hover:bg-[#00000024]">
            <img
              src={playCircle}
              alt=""
              className="size-9 transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        </div>
        <div
          className="relative min-w-20 cursor-pointer overflow-hidden rounded-2xl"
          onClick={() =>
            setVideo({
              img: 'https://static.codatta.io/static/images/fd8b92a3699de141f8a61072fa2f2098db77b9e3.jpg',
              url: 'https://static.codatta.io/static/video/c1100f58eab024e2da991e8f1d497af65514bc5c.mp4'
            })
          }
        >
          <img
            src={
              'https://static.codatta.io/static/images/fd8b92a3699de141f8a61072fa2f2098db77b9e3.jpg'
            }
            alt=""
          />
          <div className="group absolute top-0 flex size-full items-center justify-center bg-[#00000010] transition-all hover:bg-[#00000024]">
            <img
              src={playCircle}
              alt=""
              className="size-9 transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        </div>
        <div
          className="relative min-w-20 cursor-pointer overflow-hidden rounded-2xl"
          onClick={() =>
            setVideo({
              img: 'https://static.codatta.io/static/images/94d56b66c8f31669b97a303a9e3aa06a1f34be6d.jpg',
              url: 'https://static.codatta.io/static/video/40484bde670280395735e2ead984d71a67a2abc8.mp4'
            })
          }
        >
          <img
            src={
              'https://static.codatta.io/static/images/94d56b66c8f31669b97a303a9e3aa06a1f34be6d.jpg'
            }
            alt=""
          />
          <div className="group absolute top-0 flex size-full items-center justify-center bg-[#00000010] transition-all hover:bg-[#00000024]">
            <img
              src={playCircle}
              alt=""
              className="size-9 transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        </div>
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
