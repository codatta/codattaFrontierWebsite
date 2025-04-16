import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import PlayCircle from '@/assets/robotics/play-circle.svg'
import InformationLine from '@/assets/robotics/information-line.svg'

interface GuideComponenntProps {
  isOpen: boolean
  onClose: () => void
}

const GuideComponent: React.FC<GuideComponenntProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoRef3 = useRef<HTMLVideoElement>(null)

  function onCloseGuide() {
    if (dontShowAgain) {
      localStorage.setItem('task-guide-showed', 'true')
      onClose()
      return
    }
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer)
            setButtonEnabled(true)
            return 0
          }
          return prevCount - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-[#1C1C26B8]">
      <div className="relative w-[840px] rounded-2xl bg-[#252532] text-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#FFFFFF1F] px-6 pb-3 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold leading-[30px]">Welcome to the Video Evaluation Task</h2>
            <p className="text-sm leading-[22px] text-gray-700">Your feedback improves AI-generated video quality!</p>
          </div>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white" aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-6 border-b border-[#FFFFFF1F] p-6">
          <div className="rounded-lg bg-[#BDA6FF] px-3 font-bold leading-[32px] text-gray">
            Example: How to slice a mango?
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <span className="text-base font-bold leading-[24px] text-white">Part 1</span>
              <span className="text-sm leading-[20px] text-gray-700">(Compare 2 videos side-by-side.)</span>
            </div>
            <div className="flex gap-6 rounded-lg bg-[rgb(46,46,57)] p-4">
              <div className="flex gap-3">
                {/* Video A */}
                <div className="relative h-[128px] w-[160px] overflow-hidden rounded-xl bg-black">
                  <div
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      if (videoRef1.current) {
                        videoRef1.current.play()
                      }
                    }}
                  >
                    <img src={PlayCircle} alt="Play video" />
                  </div>
                  <video
                    ref={videoRef1}
                    width="100%"
                    poster=""
                    className="size-full object-cover"
                    onPlay={() => {
                      const playButton = videoRef1.current?.parentElement?.querySelector('div')
                      if (playButton) {
                        playButton.style.display = 'none'
                      }
                    }}
                    onPause={() => {
                      const playButton = videoRef1.current?.parentElement?.querySelector('div')
                      if (playButton) {
                        playButton.style.display = 'flex'
                      }
                    }}
                  >
                    <source src="https://via.placeholder.com/200x160" type="video/mp4" />
                  </video>
                </div>
                {/* Video B */}
                <div className="relative h-[128px] w-[160px] overflow-hidden rounded-xl bg-black">
                  <div
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      if (videoRef2.current) {
                        videoRef2.current.play()
                      }
                    }}
                  >
                    <img src={PlayCircle} alt="Play video" />
                  </div>
                  <video
                    ref={videoRef2}
                    width="100%"
                    poster=""
                    className="size-full object-cover"
                    onPlay={() => {
                      const playButton = videoRef2.current?.parentElement?.querySelector('div')
                      if (playButton) {
                        playButton.style.display = 'none'
                      }
                    }}
                    onPause={() => {
                      const playButton = videoRef2.current?.parentElement?.querySelector('div')
                      if (playButton) {
                        playButton.style.display = 'flex'
                      }
                    }}
                  >
                    <source src="https://via.placeholder.com/200x160" type="video/mp4" />
                  </video>
                </div>
              </div>
              {/* Question */}
              <div className="flex-1">
                <h4 className="mb-5 w-[194px] text-sm font-semibold leading-[22px] text-white">
                  Which video better answers the given question?
                </h4>
                <div className="mb-3 flex gap-8">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice1" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[17px] text-white">Video A</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice1" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[17px] text-white">Video B</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice1" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[17px] text-white">Neutral</span>
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    disabled
                    placeholder="Why is the video you selected a better choice?"
                    className="h-[32px] w-full rounded-lg border border-[#FFFFFF1F] bg-[#252532] p-3 text-xs text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <span className="text-base font-bold leading-[24px] text-white">Part 2</span>
              <span className="text-sm leading-[20px] text-gray-700">(Rate simple videos (1-5 scale).)</span>
            </div>
            <div className="flex rounded-lg bg-[rgb(46,46,57)] p-4">
              <div className="relative h-[148px] w-[185px] overflow-hidden rounded-xl bg-black">
                <div
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    if (videoRef3.current) {
                      videoRef3.current.play()
                    }
                  }}
                >
                  <img src={PlayCircle} alt="Play video" />
                </div>
                <video
                  ref={videoRef3}
                  width="100%"
                  poster=""
                  className="size-full object-cover"
                  onPlay={() => {
                    const playButton = videoRef3.current?.parentElement?.querySelector('div')
                    if (playButton) {
                      playButton.style.display = 'none'
                    }
                  }}
                  onPause={() => {
                    const playButton = videoRef3.current?.parentElement?.querySelector('div')
                    if (playButton) {
                      playButton.style.display = 'flex'
                    }
                  }}
                >
                  <source src="https://via.placeholder.com/200x160" type="video/mp4" />
                </video>
              </div>

              {/* Question */}
              <div className="ml-5 flex-1">
                <h4 className="mb-[10px] text-sm font-semibold leading-[22px] text-white">
                  Rate how well the video shows the process.
                </h4>
                <div className="mb-3 flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[100%] text-white">
                      1: No process at all - Only shows the final product or random unrelated footage.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[100%] text-white">
                      2: Barely any process - The task is implied but missing major steps.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[100%] text-white">
                      3: Some process shown, but unclear or incomplete.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[100%] text-white">
                      4: Mostly complete process – Covers nearly all necessary steps.
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="videoChoice" className="size-4 accent-[#8A5AEE]" />
                    <span className="text-sm leading-[100%] text-white">
                      5: Fully correct process – Step-by-step from start to finish.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <img src={InformationLine} alt="" />
            <span className="text-sm leading-[20px] text-gray-700">Complete both parts to earn compensation</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#FFFFFF1F] p-6" id="footer">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="size-4 accent-[#8A5AEE]"
              checked={dontShowAgain}
              onChange={() => setDontShowAgain(!dontShowAgain)}
            />
            <span className="text-sm text-white">Don't show this guide again</span>
          </label>
          <button
            className={`rounded-[36px] px-6 py-3 text-sm font-medium ${buttonEnabled ? 'cursor-pointer bg-[#8A5AEE] text-white' : 'cursor-not-allowed bg-[#8A5AEE]/50 text-white/70'}`}
            disabled={!buttonEnabled}
            onClick={onCloseGuide}
          >
            I Understand {countdown > 0 ? `(${countdown}s)` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuideComponent
