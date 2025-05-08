import { CMUDataRequirements } from '@/apis/frontiter.api'
import surveyFlow from '@/components/cmu/survey_flow.json'
import { useMemo, useState } from 'react'
import VideoPlayer from '@/components/cmu/video-player'
import { Radio } from 'antd'
import { Button } from 'antd'

function Progress(props: { total: number; current: number; title: string }) {
  const { total, current, title } = props

  return (
    <div>
      <p className="mb-4 text-sm text-white">
        {title}: Question {current + 1} of {total}
      </p>
      <div className="mb-3 w-full">
        <div className="w-full rounded-xl border-2 border-primary bg-transparent">
          <div
            className="h-1 rounded-xl rounded-r-none bg-primary transition-all"
            style={{
              width: `${((current + 1) / total) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default function CMUVideoLabelingPart2(props: {
  data_requirements: CMUDataRequirements
  onSubmit: (data: string[]) => void
  onBack: () => void
}) {
  const { data_requirements, onSubmit, onBack } = props
  const [current, setCurrent] = useState(0)
  const [part2Form, setPart2Form] = useState<string[]>([])

  const total = surveyFlow.length

  const currentQuestion = useMemo(() => {
    return surveyFlow[current]
  }, [current])

  const handleBackClick = () => {
    if (current === 0) onBack()
    setCurrent(current - 1)
  }

  const handleSubmit = () => {
    if (current + 1 >= total) onSubmit(part2Form)
    else setCurrent(current + 1)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <Progress total={total} current={current} title={currentQuestion.section_text} />

        <div className="rounded-2xl bg-[#252532] p-6">
          <div className="mb-3 inline-block rounded-xl bg-[rgb(48,44,73)] px-2 text-sm font-semibold leading-[22px] text-[#875DFF]">
            Question
          </div>
          <h3 className="mb-6 text-2xl font-bold leading-[36px] text-white">{data_requirements.querytext}</h3>
          <div className="grid grid-cols-2 items-center gap-4">
            {data_requirements?.part2?.videos?.map((video) => (
              <div key={video.video_id}>
                <VideoPlayer className="rounded-xl" videoUrl={video.video_url}></VideoPlayer>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#252532] p-6">
          <div className="mb-4 flex items-center gap-2">
            <h4 className="text-base font-medium text-white">{currentQuestion.question_text}</h4>
          </div>
          <div className="flex flex-col gap-3">
            <Radio.Group
              className="flex flex-col gap-3"
              onChange={(e) => {
                setPart2Form((prev) => {
                  const newForm = [...prev]
                  newForm[current] = e.target.value
                  return newForm
                })
              }}
              value={part2Form[current]}
            >
              {currentQuestion.options.map((option) => (
                <Radio value={option.key} className="text-white" key={option.key}>
                  {option.value}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="mb-[96px] flex justify-center gap-4">
          <Button size="large" className="w-[240px] rounded-lg bg-white text-black" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            type="primary"
            className="w-[240px] rounded-lg bg-[#8A5AEE] text-white"
            size="large"
            disabled={!part2Form[current]}
            onClick={handleSubmit}
          >
            {current + 1 >= total ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
