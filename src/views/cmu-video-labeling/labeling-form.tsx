import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import frontiterApi, { CMUDataRequirements } from '@/apis/frontiter.api'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
// import PageError from '@/components/robotics/page-error'
import GuideComponent from '@/components/robotics/label-annotation/guide'
import { useCMUStore } from '@/stores/cmu.store'
import CMUVideoLabelingPart1, { Part1FormData } from '@/components/cmu/part-1'
import CMUVideoLabelingPart2 from '@/components/cmu/part-2'
import LightbulbLine from '@/assets/robotics/lightbulb-line.svg'
import { message, Spin } from 'antd'

export default function CMUVideoLabeling(props: { templateId: string }) {
  const { templateId } = props
  const { questId, taskId } = useParams()
  const [question, setQuestion] = useState<CMUDataRequirements>()
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, _setRewardPoints] = useState(200)
  const [showGuide, setShowGuide] = useState(localStorage.getItem('task-guide-showed') !== 'true')
  const cmuStore = useCMUStore()
  const [part1Data, setPart1Data] = useState<Part1FormData>()
  const [part2Data, setPart2Data] = useState<string[]>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  async function submitQuestion(questId: string, taskId: string, templateId: string, data: object) {
    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        num: questId,
        taskId: taskId!,
        templateId: templateId,
        data
      })
      setModalShow(true)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  function onCloseGuide() {
    setShowGuide(false)
  }

  const getQuestion = useCallback(
    (questId: string) => {
      const question = cmuStore.taskList.find((item) => item.num === questId)
      if (!question) {
        navigate(`/frontier/project/${templateId}/${taskId}`)
        return
      }
      if (question) {
        const mutableQuestion = JSON.parse(JSON.stringify(question)) as CMUDataRequirements
        setQuestion(mutableQuestion)
      }
    },
    [cmuStore.taskList, navigate, taskId, templateId]
  )

  useEffect(() => {
    if (!taskId || !questId) return
    getQuestion(questId)
  }, [taskId, questId, getQuestion])

  const onPart1Submit = async (data: Part1FormData) => {
    setPart1Data(data)
    setStep(2)
  }

  const onPart2Submit = async (data: string[]) => {
    setPart2Data(data)
  }

  useEffect(() => {
    if (!questId || !taskId || !templateId) return
    if (!part1Data || !part2Data) return
    submitQuestion(questId!, taskId!, templateId!, { part1: part1Data, part2: part2Data })
  }, [part2Data, part1Data, questId, taskId, templateId])

  return (
    <div className="w-full flex-1">
      {question && (
        <Spin spinning={loading}>
          <div className="flex-1">
            <div className="my-[48px] flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-4xl font-black leading-[48px] text-white">
                <span>Video Annotation</span>
                <img
                  className="mt-[6px] cursor-pointer"
                  src={LightbulbLine}
                  onClick={() => setShowGuide(true)}
                  alt=""
                />
              </h2>
              <div className="h-[38px] rounded-xl bg-[#BDA6FF] px-3 text-xl font-bold leading-[38px] text-gray">
                {step === 1 ? 'Part 1: Video Comparison' : 'Part 2: Single Video Analysis'}
              </div>
            </div>
            {step === 1 ? (
              <CMUVideoLabelingPart1 data_requirements={question!} onSubmit={onPart1Submit} />
            ) : (
              <CMUVideoLabelingPart2 data_requirements={question!} onSubmit={onPart2Submit} onBack={() => setStep(1)} />
            )}
          </div>
        </Spin>
      )}
      <SubmitSuccessModal points={rewardPoints} open={modalShow} type="cmu" onClose={() => window.history.back()} />
      <GuideComponent isOpen={showGuide} onClose={() => onCloseGuide()} />
    </div>
  )
}
