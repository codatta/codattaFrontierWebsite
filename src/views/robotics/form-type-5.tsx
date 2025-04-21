import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

import frontiterApi, { CMUDataRequirements } from '@/apis/frontiter.api'
import Form5Component from '@/components/robotics/form-5'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import PageError from '@/components/robotics/page-error'
import GuideComponent from '@/components/robotics/label-annotation/guide'
import PageHead from '@/components/common/page-head'
import AuthChecker from '@/components/app/auth-checker'

export default function FormType5(props: { templateId: string }) {
  const { templateId } = props
  const { taskId } = useParams()
  const [_loading, setLoading] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [error, setError] = useState()
  const [rewardPoints, setRewardPoints] = useState(0)
  const [data_requirements, setDataRequirements] = useState<CMUDataRequirements | null>(null)
  const [showGuide, setShowGuide] = useState(localStorage.getItem('task-guide-showed') !== 'true')

  async function getTaskDetail(taskId: string, templateId: string) {
    setLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      if (res.data.data_display.template_id !== templateId) {
        throw new Error('Template not match!')
      }
      setDataRequirements(res.data.data_requirements as CMUDataRequirements)
      const totalRewards = res.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      console.log(totalRewards, 'totalRewards')
      setRewardPoints(totalRewards)
    } catch (err) {
      message.error(err.message)
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!taskId) return
    getTaskDetail(taskId!, templateId)
  }, [taskId, templateId])

  async function submitTaskData(data: object) {
    const res = await frontiterApi.submitTask(taskId!, {
      taskId: taskId!,
      templateId: templateId,
      data
    })
    setModalShow(true)
    return res
  }

  function onCloseGuide() {
    setShowGuide(false)
  }

  return (
    <AuthChecker>
      <div className="relative min-h-screen bg-[#1c1c26]">
        <PageHead>
          <a
            className="rounded-[36px] border border-[#FFFFFF] bg-transparent px-6 py-[10px] text-sm leading-[22px]"
            href="xxx"
            target="_blank"
          >
            Claim Reward
          </a>
        </PageHead>
        <div className="no-scrollbar mx-auto flex h-[calc(100vh-84px)] max-w-[1272px] flex-1 flex-col gap-10 overflow-scroll p-6 text-white lg:flex-row">
          {error && <PageError error={error}></PageError>}
          {!error && data_requirements && (
            <Form5Component
              data_requirements={data_requirements}
              onSubmit={submitTaskData}
              onShowGuide={() => setShowGuide(true)}
            />
          )}

          <SubmitSuccessModal points={rewardPoints} open={modalShow} type="cmu" onClose={() => window.history.back()} />
          <GuideComponent isOpen={showGuide} onClose={() => onCloseGuide()} />
        </div>
      </div>
    </AuthChecker>
  )
}
