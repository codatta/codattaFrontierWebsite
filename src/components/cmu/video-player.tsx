import { useRef, useEffect, useState } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  posterUrl?: string
  className?: string
  controls?: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, posterUrl, className = 'w-full', controls = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(posterUrl)

  useEffect(() => {
    if (posterUrl) return

    const tempVideo = document.createElement('video')
    tempVideo.crossOrigin = 'anonymous'
    tempVideo.src = videoUrl
    tempVideo.muted = true
    tempVideo.preload = 'metadata'

    tempVideo.onloadeddata = () => {
      const canvas = document.createElement('canvas')
      canvas.width = tempVideo.videoWidth
      canvas.height = tempVideo.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setThumbnailUrl(dataUrl)
      }
      tempVideo.pause()
      tempVideo.src = ''
      tempVideo.load()
    }

    tempVideo.load()
    tempVideo.currentTime = 0.01
  }, [videoUrl, posterUrl])

  return (
    <video ref={videoRef} controls={controls} className={className} poster={thumbnailUrl}>
      <source src={videoUrl} type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
  )
}

export default VideoPlayer
