import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

import frontiterApi from '@/apis/frontiter.api'
import GifPlayer from '@/components/robotics/gif-player'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import PageError from '@/components/robotics/page-error'
import Form3 from '@/components/robotics/form-3'

export default function RoboticsSubmitPage(props: { templateId: string }) {
  const { templateId } = props
  const { taskId } = useParams()
  const [_frameCount, setFrameCount] = useState(0)
  const [gifFile, setGifFile] = useState<string>()
  const [_loading, setLoading] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [error, setError] = useState()
  const [rewardPoints, setRewardPoints] = useState(0)

  const onGifPlayerReady = useCallback((frameCount: number) => {
    setFrameCount(frameCount)
  }, [])

  async function getTaskDetail(taskId: string, templateId: string) {
    setLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      if (res.data.data_display.template_id !== templateId) {
        throw new Error('Template not match!')
      }
      const totalRewards = res.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINT'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)
      setRewardPoints(totalRewards)
      setGifFile(res.data.data_display.gif_resource)
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
    <div className="mx-auto flex h-[calc(100vh-84px)] max-w-[1500px] flex-1 flex-col gap-10 overflow-scroll p-10 text-white lg:flex-row">
      {error && <PageError error={error}></PageError>}
      {!error && (
        <>
          <div className="top-0 flex w-full flex-col lg:sticky lg:z-10 lg:max-w-[500px]">
            <GifPlayer src={gifFile!} onReady={onGifPlayerReady} />
          </div>
          <Form3 onSubmit={submitTaskData} />
        </>
      )}

      <SubmitSuccessModal
        points={rewardPoints}
        open={modalShow}
        onClose={() => window.history.back()}
      />
    </div>
  )
}
