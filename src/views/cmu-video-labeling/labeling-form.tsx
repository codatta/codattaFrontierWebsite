import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { message } from 'antd'

import frontiterApi, { CMUDataRequirements } from '@/apis/frontiter.api'
import Form5Component from '@/components/robotics/form-5'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import PageError from '@/components/robotics/page-error'
import GuideComponent from '@/components/robotics/label-annotation/guide'

export default function CMUVideoLabeling(props: { templateId: string }) {
  const { templateId } = props
  const { questId, taskId } = useParams()
  const task = useLocation().state as CMUDataRequirements
  const [modalShow, setModalShow] = useState(false)
  const [error, setError] = useState()
  const [rewardPoints, setRewardPoints] = useState(0)
  const [showGuide, setShowGuide] = useState(localStorage.getItem('task-guide-showed') !== 'true')

  async function submitTaskData(data: object) {
    const res = await frontiterApi.submitTask(taskId!, {
      num: questId,
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
    <div className="w-full flex-1">
      {error && <PageError error={error}></PageError>}
      {!error && task && (
        <Form5Component data_requirements={task} onSubmit={submitTaskData} onShowGuide={() => setShowGuide(true)} />
      )}

      <SubmitSuccessModal points={rewardPoints} open={modalShow} type="cmu" onClose={() => window.history.back()} />
      <GuideComponent isOpen={showGuide} onClose={() => onCloseGuide()} />
    </div>
  )
}
