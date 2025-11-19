import { Button, Input, message, Modal } from 'antd'
import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/frontier/frontier-header'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ApprovedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'

function TaskResultModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <ApprovedIcon className="mb-4 size-20" />
        <h1 className="mb-3 text-lg font-bold">Task Completed</h1>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="min-w-40">
          Got it
        </Button>
      </div>
    </Modal>
  )
}

export default function TwitterBind(props: { templateId: string }) {
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [verifyLink, setVerifyLink] = useState('')
  const { taskId } = useParams()
  const { templateId } = props
  const navigate = useNavigate()

  async function checkTaskStatus(taskId: string) {
    setLoading(true)
    try {
      const taskHistory = await frontiterApi.getSubmissionList({ task_ids: [taskId].join(), page_num: 1, page_size: 1 })
      if (taskHistory.data.length > 0) {
        setShowSuccessModal(true)
      }
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function verifyXBind() {
    setVerifying(true)
    try {
      const { data } = await frontiterApi.verifyXBind(verifyLink)
      await submitTask(data)
      setShowSuccessModal(true)
    } catch (err) {
      message.error(err.message)
    }
    setVerifying(false)
  }

  async function submitTask(bindResult: { task_open_id: string; task_user_name: string }) {
    if (!taskId) return
    if (!templateId) return

    await frontiterApi.submitTask(taskId, {
      templateId: templateId,
      taskId: taskId,
      data: {
        site: 'X',
        opt: 'bind',
        ...bindResult
      }
    })
  }

  async function handleBindXClick() {
    setLoading(true)
    try {
      const { data } = await frontiterApi.getXBindLink()
      window.open(data.link, '_blank')
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  function handleVerifyLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVerifyLink(e.target.value)
  }

  function handleModalClose() {
    navigate(-1)
  }

  useEffect(() => {
    if (!taskId) return
    checkTaskStatus(taskId)
  }, [taskId])

  return (
    <AuthChecker>
      <FrontierHeader title="Bind X Account" className="mb-16"></FrontierHeader>
      <div className="m-auto flex max-w-[600px] flex-col gap-12 rounded-2xl bg-[#252532] p-10">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 1</span>
          <span className="text-base">Click the button below to post a tweet and bind your X account. </span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={handleBindXClick}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin"></Loader2> : 'Bind X Account'}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 2</span>
          <span className="text-base">Submit the link to your tweet and click "Verify" to complete this task. </span>
          <Input size="large" placeholder="Enter the link" onChange={handleVerifyLinkChange}></Input>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={verifyXBind}
            disabled={!verifyLink || verifying}
          >
            {verifying ? <Loader2 className="animate-spin"></Loader2> : 'Verify'}
          </Button>
        </div>
      </div>
      <TaskResultModal open={showSuccessModal} onClose={handleModalClose}></TaskResultModal>
    </AuthChecker>
  )
}
