import { Button, message, Modal } from 'antd'
import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/frontier/frontier-header'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ApprovedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/pc-reject-icon.svg?react'
import PendingIcon from '@/assets/frontier/crypto/pc-pending-icon.svg?react'

function TaskSuccessModal(props: { open: boolean; onClose: () => void }) {
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

function TaskFailedModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <RejectIcon className="mb-4 size-20" />
        <h1 className="mb-1 text-lg font-bold">Verification Failed</h1>
        <p className="mb-6 text-center text-white/70">Verification failed, please try again.</p>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="min-w-40">
          Got it
        </Button>
      </div>
    </Modal>
  )
}

function TaskPendingModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <PendingIcon className="mb-4 size-20" />
        <h1 className="mb-1 text-lg font-bold">Verifying...</h1>
        <p className="mb-6 text-center text-white/70">Task verification in progress. Please check back later.</p>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="min-w-40">
          Got it
        </Button>
      </div>
    </Modal>
  )
}

export default function TwitterFollow(props: { templateId: string }) {
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailedModal, setShowFailedModal] = useState(false)
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [taskLink, setTaskLink] = useState<string>('')
  const { taskId } = useParams()
  const { templateId } = props
  const navigate = useNavigate()

  async function checkIsTaskFinished(taskId: string) {
    setLoading(true)
    try {
      const taskHistory = await frontiterApi.getSubmissionList({ task_ids: taskId, page_num: 1, page_size: 1 })
      if (taskHistory.data.length > 0) {
        const status = taskHistory.data[0].status
        if (status === 'ADOPT') {
          setShowSuccessModal(true)
        } else if (status === 'PENDING' || status === 'SUBMITTED') {
          setShowPendingModal(true)
        } else if (status === 'REFUSED') {
          setShowFailedModal(true)
        }
        return true
      } else {
        return false
      }
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompleteClick() {
    setLoading(true)
    try {
      if (!taskId) throw new Error('Task ID not found')
      const res = await getTaskDetail(taskId)
      const taskLink = res.data_display?.link
      if (!taskLink) throw new Error('Task link not found')
      setTaskLink(taskLink)
      window.open(taskLink, '_blank')
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function handleVerifyClick() {
    setVerifying(true)
    try {
      if (!taskId) throw new Error('Task ID not found')
      await submitTask()
      setShowPendingModal(true)
    } catch (err) {
      message.error(err.message)
    }
    setVerifying(false)
  }

  async function submitTask() {
    if (!taskId) throw new Error('Task ID not found')
    if (!templateId) throw new Error('Template ID not found')

    await frontiterApi.submitTask(taskId, {
      templateId,
      taskId,
      data: {
        site: 'X',
        opt: 'following',
        link: taskLink
      }
    })
  }

  function handleModalClose() {
    navigate(-1)
  }

  async function getTaskDetail(taskId: string) {
    const res = await frontiterApi.getTaskDetail(taskId)
    return res.data
  }

  useEffect(() => {
    if (!taskId) return
    checkIsTaskFinished(taskId)
  }, [taskId])

  return (
    <AuthChecker>
      <FrontierHeader title="Follow on Twitter" className="mb-16"></FrontierHeader>
      <div className="m-auto flex max-w-[600px] flex-col gap-12 rounded-2xl bg-[#252532] p-10">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 1</span>
          <span className="text-base">Click the button below to follow the X account.</span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={handleCompleteClick}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin"></Loader2> : 'Complete'}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 2</span>
          <span className="text-base">Click "Verify" to complete this task.</span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={handleVerifyClick}
            disabled={verifying || !taskLink}
          >
            {verifying ? <Loader2 className="animate-spin"></Loader2> : 'Verify'}
          </Button>
        </div>
      </div>
      <TaskSuccessModal open={showSuccessModal} onClose={handleModalClose}></TaskSuccessModal>
      <TaskFailedModal open={showFailedModal} onClose={() => setShowFailedModal(false)}></TaskFailedModal>
      <TaskPendingModal open={showPendingModal} onClose={handleModalClose}></TaskPendingModal>
    </AuthChecker>
  )
}
