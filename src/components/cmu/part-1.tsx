import { CMUDataRequirements } from '@/apis/frontiter.api'
import VideoPlayer from '@/components/cmu/video-player'
import InformationLine from '@/assets/robotics/information-line.svg'
import { Button, Checkbox, Radio } from 'antd'
import { useMemo, useState } from 'react'

export interface Part1FormData {
  aVsBStatus: string
  reason: string
}

export default function CMUVideoLabelingPart1(props: {
  data_requirements: CMUDataRequirements
  onSubmit: (data: Part1FormData) => Promise<unknown>
}) {
  const { data_requirements, onSubmit } = props
  const [videoWatched, setVideoWatched] = useState(false)
  const [part1Form, setPart1Form] = useState<Part1FormData>({
    aVsBStatus: '',
    reason: ''
  })

  function handleSubmit() {
    onSubmit(part1Form)
  }

  const canSubmit = useMemo(() => {
    return part1Form.aVsBStatus && part1Form.reason
  }, [part1Form])

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl bg-[#252532] p-6">
        <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
          Question
        </div>
        <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">{data_requirements.querytext}</h3>
        <div className="mb-6 grid grid-cols-2 gap-4">
          {data_requirements?.part1?.videos?.map((video, index) => (
            <div key={`video-${index}`} className="w-full">
              <VideoPlayer className="w-full rounded-xl" videoUrl={video.video_url} />
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
              <h4 className="mb-4 text-base font-medium text-white">Which video better answers the given question?</h4>
              <div className="mb-4 flex gap-4">
                <Radio.Group
                  value={part1Form.aVsBStatus}
                  onChange={(e) => setPart1Form({ ...part1Form, aVsBStatus: e.target.value })}
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
          disabled={!canSubmit}
          type="primary"
          size="large"
          onClick={() => handleSubmit()}
          className="rounded-full bg-[#8A5AEE] px-6 py-2 text-white"
        >
          Complete Part 1 to unlock Part 2
        </Button>
      </div>
    </div>
  )
}
