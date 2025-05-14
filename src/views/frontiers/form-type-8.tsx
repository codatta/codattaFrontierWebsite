import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

import frontiterApi from '@/apis/frontiter.api'
import Form8 from '@/components/robotics/form-8'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import PageError from '@/components/robotics/page-error'

export default function FoodScienceSubmitPage(props: { templateId: string }) {
  const { templateId } = props
  const { taskId } = useParams()
  const [_loading, setLoading] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [error, setError] = useState()
  const [rewardPoints, setRewardPoints] = useState(0)

  async function getTaskDetail(taskId: string, templateId: string) {
    setLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      if (res.data.data_display.template_id !== templateId) {
        throw new Error('Template not match!')
      }
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

  return (
    <div className="no-scrollbar mx-auto flex h-[calc(100vh-84px)] max-w-[1272px] flex-1 flex-col gap-10 overflow-scroll p-6 text-white lg:flex-row">
      {error && <PageError error={error}></PageError>}
      {/* {!error && <Form8 />} */}
      {!error && <Form8 onSubmit={submitTaskData} />}

      <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
    </div>
  )
}
