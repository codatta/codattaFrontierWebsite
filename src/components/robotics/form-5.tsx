import { Button, Radio, Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import PlayCircle from '@/assets/robotics/play-circle.svg'
import InformationLine from '@/assets/robotics/information-line.svg'
import { TaskDetail } from '@/apis/frontiter.api'
import VideoModal from '@/components/robotics/video-modal'
import LightbulbLine from '@/assets/robotics/lightbulb-line.svg'

interface Form5ComponentProps {
  data_requirements: TaskDetail['data_requirements']
  onShowGuide: () => void
  onSubmit: (data: object) => Promise<unknown>
}

export default function Form5Component({ data_requirements, onShowGuide, onSubmit }: Form5ComponentProps) {
  const [videoWatched, setVideoWatched] = useState(false)
  const [step, setStep] = useState(1)
  const [currentVideo, setCurrentVideo] = useState<{ img: string; url: string } | null>(null)
  const [part1Form, setPart1Form] = useState<{
    aVsBStatus: string
    reason: string
  }>({
    aVsBStatus: 'A',
    reason: ''
  })
  const [part2Form, setPart2Form] = useState<Array<string>>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleSubmit = () => {
    if (currentQuestionIndex >= data_requirements?.part2?.questions?.length - 1) {
      onSubmit({
        part1: part1Form,
        part2: part2Form
      })
      return
    }
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  useEffect(() => {
    const length = data_requirements?.part2?.questions?.length
    if (length > 0) {
      setPart2Form(new Array(length).fill(''))
    }
  }, [data_requirements])

  return (
    <div className="flex-1">
      <div className="my-[48px] flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-4xl font-black leading-[48px] text-white">
          <span>Video Annotation</span>
          <img className="mt-[6px] cursor-pointer" src={LightbulbLine} onClick={() => onShowGuide()} alt="" />
        </h2>
        <div className="h-[38px] rounded-xl bg-[#BDA6FF] px-3 text-xl font-bold leading-[38px] text-gray">
          {step === 1 ? 'Part 1: Video Comparison' : 'Part 2: Single Video Analysis'}
        </div>
      </div>
      {step === 1 ? (
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl bg-[#252532] p-6">
            <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
              Question
            </div>
            <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">How to slice a mango?</h3>
            <div className="mb-6 flex gap-4">
              {(data_requirements as TaskDetail['data_requirements'])?.part1?.videos?.map((video, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl"
                  onClick={() => {
                    setCurrentVideo({
                      img: video?.image_url || '',
                      url: video?.video_url || ''
                    })
                  }}
                >
                  <img src={video?.image_url} alt="Mango cut pattern" className="h-[180px] w-[240px] object-cover" />
                  <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/30">
                    <img src={PlayCircle} alt="" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <img src={InformationLine} alt="" />
              <div>
                <p>Watch fully before making choice.</p>
                <p>No right or wrong answers-be honest!</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-2xl bg-[#252532] p-6">
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
                      value={part1Form.aVsBStatus}
                      onChange={(e) => setPart1Form({ ...part1Form, aVsBStatus: e.target.value })}
                      className="flex gap-4"
                    >
                      <Radio value="1" className="leading-[17px] text-white">
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
                      value={part1Form.reason}
                      onChange={(e) => setPart1Form({ ...part1Form, reason: e.target.value })}
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
          <div className="mb-[96px] flex justify-center">
            <Button
              disabled={!part1Form.aVsBStatus || !part1Form.reason}
              type="primary"
              onClick={() => {
                setCurrentQuestionIndex(0)
                setStep(2)
              }}
              className="h-12 w-[240px] rounded-full bg-[#8A5AEE] text-white"
            >
              Complete Part 1 to unlock Part 2
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-[48px]">
            <p className="mb-4 text-sm text-white">
              Question {currentQuestionIndex + 1} of {data_requirements?.part2?.questions?.length}
            </p>
            <div className="mb-3 w-full">
              <div className="w-full rounded-xl border-2 border-primary bg-transparent">
                <div
                  className="h-1 rounded-xl rounded-r-none bg-primary"
                  style={{
                    width: `${((currentQuestionIndex + 1) / (data_requirements?.part2?.questions?.length || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="rounded-2xl bg-[#252532] p-6">
              <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
                Question
              </div>
              <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">How to slice a mango?</h3>
              <div className="flex items-center gap-4">
                {(data_requirements as TaskDetail['data_requirements'])?.part2?.videos?.map((video, index) => (
                  <div
                    key={index}
                    className="relative h-[180px] w-[268px] overflow-hidden rounded-xl"
                    onClick={() => setCurrentVideo({ img: video.image_url || '', url: video.video_url || '' })}
                  >
                    <img src={video.image_url} alt="Mango slicing technique" className="size-full object-cover" />
                    <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/30">
                      <img src={PlayCircle} alt="Play button" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#252532] p-6">
              <div className="mb-4 flex items-center gap-2">
                <h4 className="text-base font-medium text-white">
                  {data_requirements?.part2?.questions?.[currentQuestionIndex]?.title}
                </h4>
                {/* <h4 className="text-base font-medium text-white">Rate the video's process completeness</h4>
                <p className="text-sm text-gray-400">
                  Evaluate how completely the video shows all steps of the process.
                </p> */}
              </div>
              <div className="flex flex-col gap-3">
                <Radio.Group
                  className="flex flex-col gap-3"
                  onChange={(e) =>
                    setPart2Form((prev) => {
                      console.log(e.target.value)
                      return prev.map((_, i) => {
                        return i === currentQuestionIndex ? e.target.value : _
                      })
                    })
                  }
                  value={part2Form[currentQuestionIndex]}
                >
                  {data_requirements?.part2?.questions?.[currentQuestionIndex]?.options?.map((option, index) => (
                    <Radio value={index} className="text-white" key={index}>
                      {option?.label}. {option?.content}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
            <div className="mb-[96px] flex justify-center gap-4">
              <Button className="h-10 w-[240px] rounded-lg bg-white text-black" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="primary"
                className="h-10 w-[240px] rounded-lg bg-[#8A5AEE] text-white"
                onClick={handleSubmit}
              >
                {currentQuestionIndex + 1 >= (data_requirements?.part2?.questions?.length || 0) ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <VideoModal onClose={() => setCurrentVideo(null)} video={currentVideo!} />
    </div>
  )
}
