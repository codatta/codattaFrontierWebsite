import React, { useState, useEffect, useRef } from 'react'
import { Button, Slider, message } from 'antd'
import { Frame, loadGifFrames } from '@/utils/gif'
import FullscreenProgressBar from './fullscreen-progress-bar'
import playIcon from '@/assets/common/play-circle.png'
import pauseIcon from '@/assets/robotics/pause-circle.png'
import { cn } from '@udecode/cn'
import { setFrameToLabel } from '@/stores/image-label-store'

interface GifPlayerProps {
  onReady?: (frameCount: number) => void
  src: string
}

function Player(props: {
  frames: Frame[]
  frame: number
  size: { width: number; height: number }
  onClick: (e: React.MouseEvent<HTMLCanvasElement>) => void
}) {
  const { size, frames, frame } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function renderFrame(frame: Frame, context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, frame.width, frame.height)
    const imageData = new ImageData(frame.data, frame.width, frame.height)
    context.putImageData(imageData, 0, 0)
  }

  useEffect(() => {
    if (!canvasRef.current) return
    if (!frames || frames.length === 0) return
    const ctxContext = canvasRef.current?.getContext('2d')
    if (!ctxContext) return
    renderFrame(frames[frame], ctxContext)
  }, [frames, canvasRef, frame])

  return (
    <canvas
      onClick={props.onClick}
      ref={canvasRef}
      width={size.width}
      height={size.height}
      className="mb-4 w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-300 transition duration-300 ease-in-out"
    ></canvas>
  )
}

const GifPlayer: React.FC<GifPlayerProps> = ({ onReady, src }) => {
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [ready, setReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(0.5)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 640,
    height: 480
  })
  const [frames, setFrames] = useState<Frame[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  async function loadGif(src: string, onReady?: (frameCount: number) => void) {
    try {
      const frames = await loadGifFrames(src, function onProgress(progress) {
        const percent = Math.round(progress * 100)
        setLoadingPercent(percent)
      })
      setSize({ width: frames[0].width, height: frames[0].height })
      setFrames(frames)
      setFrameToLabel(frames[0])
      setReady(true)
      onReady?.(frames.length)
    } catch (e) {
      console.log(e)
      message.error('Gif source load failed!')
    }
  }

  useEffect(() => {
    if (!src) return
    loadGif(src, onReady)
  }, [onReady, src])

  const handleTogglePlay = () => {
    if (!ready) return
    setIsPlaying((isPlaying) => !isPlaying)
  }

  const toggleSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)
  }

  const handleFrameChange = (val: number) => {
    setCurrentFrameIndex(val)
  }

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(
        () => {
          setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
        },
        1000 / (speed * 15)
      )
      return () => clearInterval(timerRef.current!)
    } else {
      clearInterval(timerRef.current!)
    }
  }, [isPlaying, speed, frames])

  useEffect(() => {
    if (currentFrameIndex >= frames.length - 1) {
      setIsPlaying(false)
    }
  }, [currentFrameIndex, frames])

  return (
    <div className="box-content flex w-full flex-col items-center text-white">
      <Player frames={frames} frame={currentFrameIndex} size={size} onClick={handleTogglePlay}></Player>
      <div className="mb-4 flex h-10 w-full items-center gap-4">
        <Button type="text" onClick={handleTogglePlay} shape="circle">
          <object data={isPlaying ? pauseIcon : playIcon} type="image/png" className="size-6" />
        </Button>
        <div className="min-w-[40px] text-center text-xs">
          {currentFrameIndex + 1}/{frames.length}
        </div>
        <Slider
          className="flex-1"
          defaultValue={0}
          min={0}
          max={frames.length - 1}
          disabled={!ready}
          value={currentFrameIndex}
          onChange={handleFrameChange}
          tooltip={{
            formatter: (value) => value,
            open: !ready ? false : undefined
          }}
          styles={{
            track: {
              background: '#875DFF80'
            }
          }}
        />
        <div className="flex gap-2">
          <div
            className={cn(
              'h-5 w-10 cursor-pointer rounded-[4px] bg-white bg-opacity-35 text-center text-xs leading-5 text-white/40 transition-all',
              speed === 1 && 'bg-[#875DFF] bg-opacity-100 text-white text-opacity-100'
            )}
            onClick={() => toggleSpeed(1)}
          >
            1.0x
          </div>

          <div
            className={cn(
              'h-5 w-10 cursor-pointer rounded-[4px] bg-white bg-opacity-35 text-center text-xs leading-5 text-white text-opacity-40 transition-all',
              speed === 0.5 && 'bg-[#875DFF] bg-opacity-100 text-white text-opacity-100'
            )}
            onClick={() => toggleSpeed(0.5)}
          >
            0.5x
          </div>

          <div
            className={cn(
              'h-5 w-10 cursor-pointer rounded-[4px] bg-white bg-opacity-35 text-center text-xs leading-5 text-white text-opacity-40 transition-all',
              speed === 0.2 && 'bg-[#875DFF] bg-opacity-100 text-white text-opacity-100'
            )}
            onClick={() => toggleSpeed(0.2)}
          >
            0.2x
          </div>
        </div>
      </div>
      <FullscreenProgressBar progress={loadingPercent} isVisible={!ready} />
    </div>
  )
}

export default GifPlayer
