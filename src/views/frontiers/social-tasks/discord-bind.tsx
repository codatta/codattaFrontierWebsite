import { Button, message, Modal } from 'antd'
import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/frontier/frontier-header'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ApprovedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/pc-reject-icon.svg?react'

function TaskSuccessModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <ApprovedIcon className="mb-4 size-20" />
        <h1 className="mb-3 text-lg font-bold">Task Completed!!</h1>
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
        <h1 className="mb-3 text-lg font-bold">Verification Failed!!</h1>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="min-w-40">
          Got it
        </Button>
      </div>
    </Modal>
  )
}

export default function DiscordBind(props: { templateId: string }) {
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailedModal, setShowFailedModal] = useState(false)
  const { taskId } = useParams()
  const { templateId } = props
  const navigate = useNavigate()

  // async function check

  async function checkIsTaskFinished(taskId: string) {
    setLoading(true)
    try {
      const taskHistory = await frontiterApi.getSubmissionList({ task_ids: taskId, page_num: 1, page_size: 1 })
      setLoading(false)
      if (taskHistory.data.length > 0) {
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

  async function verifyDiscordBind() {
    setLoading(true)
    try {
      if (!taskId) return
      const result = await checkIsTaskFinished(taskId)
      if (result) {
        setShowSuccessModal(true)
      } else {
        setShowFailedModal(true)
      }
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function handleBindDiscordClick() {
    setLoading(true)
    try {
      const { data } = await frontiterApi.getSocailLink({ type: 'Discord' })
      const url = new URL(data.link)
      url.searchParams.append(
        'state',
        btoa(JSON.stringify({ key: 'discord-bind-task', params: { taskId, templateId } }))
      )
      window.open(url.toString(), '_blank')
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  function handleModalClose() {
    navigate(-1)
  }

  useEffect(() => {
    if (!taskId) return
    checkIsTaskFinished(taskId).then((result) => {
      if (result) setShowSuccessModal(true)
    })
  }, [taskId])

  return (
    <AuthChecker>
      <FrontierHeader title="Bind Discord Account" className="mb-16"></FrontierHeader>
      <div className="m-auto flex max-w-[600px] flex-col gap-12 rounded-2xl bg-[#252532] p-10">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 1</span>
          <span className="text-base">Click the button below to post a tweet and bind your X account. </span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={handleBindDiscordClick}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin"></Loader2> : 'Bind X Account'}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Step 2</span>
          <span className="text-base">Submit the link to your tweet and click "Verify" to complete this task. </span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={verifyDiscordBind}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin"></Loader2> : 'Verify'}
          </Button>
        </div>
      </div>
      <TaskSuccessModal open={showSuccessModal} onClose={handleModalClose}></TaskSuccessModal>
      <TaskFailedModal open={showFailedModal} onClose={() => setShowFailedModal(false)}></TaskFailedModal>
    </AuthChecker>
  )
}
