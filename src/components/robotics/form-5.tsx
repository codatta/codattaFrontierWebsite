import { Button, message, Input, Radio, Checkbox } from 'antd'
import { useState } from 'react'
import PlayCircle from '@/assets/robotics/play-circle.svg'
import InformationLine from '@/assets/robotics/information-line.svg'

interface Form5ComponentProps {
  onSubmit: (data: object) => Promise<unknown>
}

export default function Form5Component({ onSubmit }: Form5ComponentProps) {
  const [videoWatched, setVideoWatched] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [step, setStep] = useState(2)

  const handleSubmit = () => {
    console.log('submit')
  }

  return (
    <>
      {step === 1 ? (
        <div className="flex-1">
          <div className="my-[48px] flex items-center justify-between">
            <h2 className="text-4xl font-black leading-[48px] text-white">Video Annotation</h2>
            <div className="h-[38px] rounded-xl bg-[#BDA6FF] px-3 text-xl font-bold leading-[38px] text-gray">
              Part 1: Video Comparison
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {/* Video Comparison Card */}
            <div className="rounded-2xl bg-[#252532] p-6">
              {/* Question */}
              <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
                Question
              </div>
              <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">How to slice a mango?</h3>
              {/* Videos */}
              <div className="mb-6 flex gap-4">
                {/* Video A */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://via.placeholder.com/240x180"
                    alt="Mango cut pattern"
                    className="h-[180px] w-[240px] object-cover"
                  />
                  <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/30">
                    <img src={PlayCircle} alt="" />
                  </div>
                </div>
                {/* Video B */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src="https://via.placeholder.com/240x180"
                    alt="Mango slicing technique"
                    className="h-[180px] w-[240px] object-cover"
                  />
                  <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/30">
                    <img src={PlayCircle} alt="" />
                  </div>
                </div>
              </div>
              {/* Watch instruction */}
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <img src={InformationLine} alt="" />
                <div>
                  <p>Watch fully before making choice.</p>
                  <p>No right or wrong answers-be honest!</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 rounded-2xl bg-[#252532] p-6">
              {/* Watched confirmation */}
              <Checkbox
                checked={videoWatched}
                onChange={(e) => setVideoWatched(e.target.checked)}
                className="leading-[22px] text-white"
              >
                I have watched both videos completely.
              </Checkbox>
              {videoWatched && (
                <>
                  <div>
                    <h4 className="mb-4 text-base font-medium text-white">
                      Which video better answers the given question?
                    </h4>
                    <div className="mb-4 flex gap-4">
                      <Radio.Group
                        value={selectedVideo}
                        onChange={(e) => setSelectedVideo(e.target.value)}
                        className="flex gap-4"
                      >
                        <Radio value="A" className="leading-[17px] text-white">
                          Video A
                        </Radio>
                        <Radio value="B" className="leading-[17px] text-white">
                          Video B
                        </Radio>
                        <Radio value="neutral" className="leading-[17px] text-white">
                          Neutral
                        </Radio>
                      </Radio.Group>
                    </div>
                    <div>
                      <input
                        placeholder="Why is the video you selected a better choice?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full rounded-lg border border-[#FFFFFF1F] bg-transparent p-3 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <img src={InformationLine} alt="" />
                    <p>No right or wrong answer-be honest!</p>
                  </div>
                </>
              )}
            </div>
            {/* Submit Button */}
            <div className="mb-[96px] flex justify-center">
              <Button
                type="primary"
                onClick={() => setStep(2)}
                className="h-12 w-[240px] rounded-full bg-[#8A5AEE] text-white"
              >
                Complete Part 1 to unlock Part 2
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div className="mb-6 mt-[48px] flex items-center justify-between">
            <h2 className="text-4xl font-black leading-[48px] text-white">Video Annotation</h2>
            <div className="h-[38px] rounded-xl bg-[#BDA6FF] px-3 text-xl font-bold leading-[38px] text-gray">
              Part 2: Single Video Analysis
            </div>
          </div>
          <div className="mb-[48px]">
            <p className="mb-4 text-sm text-white">Question 1 of 3</p>
            <div className="mb-3 w-full">
              <div className="w-full rounded-xl border-2 border-primary bg-transparent">
                <div className="h-1 w-1/3 rounded-xl rounded-r-none bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {/* Question Card */}
            <div className="rounded-2xl bg-[#252532] p-6">
              <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
                Question
              </div>
              <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">How to slice a mango?</h3>
              {/* Video */}
              <div className="relative h-[180px] w-[268px] overflow-hidden rounded-xl">
                <img
                  src="https://via.placeholder.com/240x180"
                  alt="Mango slicing technique"
                  className="size-full object-cover"
                />
                <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/30">
                  <img src={PlayCircle} alt="Play button" />
                </div>
              </div>
            </div>
            {/* Rating Card */}
            <div className="rounded-2xl bg-[#252532] p-6">
              <div className="mb-4 flex items-center gap-2">
                <h4 className="text-base font-medium text-white">Rate the video's process completeness</h4>
                <p className="text-sm text-gray-400">
                  Evaluate how completely the video shows all steps of the process.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Radio.Group className="flex flex-col gap-3">
                  <Radio value="1" className="text-white">
                    1: No process at all – Only shows the final product or random unrelated footage.
                  </Radio>
                  <Radio value="2" className="text-white">
                    2: Barely any process – The task is implied but missing major steps.
                  </Radio>
                  <Radio value="3" className="text-white">
                    3: Some process shown, but unclear or incomplete.
                  </Radio>
                  <Radio value="4" className="text-white">
                    4: Mostly complete process – Covers nearly all necessary steps.
                  </Radio>
                  <Radio value="5" className="text-white">
                    5: Fully correct process – Step-by-step from start to finish.
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            {/* Navigation Buttons */}
            <div className="mb-[96px] flex justify-center gap-4">
              <Button className="h-10 w-[240px] rounded-lg bg-white text-black" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="primary"
                className="h-10 w-[240px] rounded-lg bg-[#8A5AEE] text-white"
                onClick={handleSubmit}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
