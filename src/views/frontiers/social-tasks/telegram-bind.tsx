import { Button, message, Modal } from 'antd'
import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import FrontierHeader from '@/components/frontier/frontier-header'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ApprovedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/pc-reject-icon.svg?react'

interface TelegramAuthResult {
  auth_date: number
  first_name: string
  hash: string
  id: number
  last_name: string
}

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

export default function TelegramBind(props: { templateId: string }) {
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

  async function startTelegramBind(botId: string) {
    return new Promise<TelegramAuthResult>((resolve) => {
      window.Telegram.Login.auth({ bot_id: botId, request_access: true }, (data: unknown) => {
        resolve(data as TelegramAuthResult)
      })
    })
  }

  async function handleBindTelegramClick() {
    setLoading(true)
    try {
      if (!taskId) throw new Error('Task ID not found')
      const taskDetail = await getTaskDetail(taskId)
      const botId = taskDetail?.data_display.bot_id
      if (!botId) throw new Error('Bot ID not found')
      const data = await startTelegramBind(botId)
      console.log('telegram bind data:', data)
      await submitTask(data)
      setShowSuccessModal(true)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function submitTask(bindResult: TelegramAuthResult) {
    if (!taskId) return
    if (!templateId) return

    await frontiterApi.submitTask(taskId, {
      templateId,
      taskId,
      data: {
        site: 'Telegram',
        opt: 'bind',
        task_open_id: bindResult.id.toString(),
        task_user_name: bindResult.first_name + '#' + bindResult.last_name
      }
    })
  }

  function handleModalClose() {
    navigate(-1)
  }

  async function getTaskDetail(taskId: string) {
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      return res.data
    } catch (err) {
      message.error(err.message)
    }
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
          <span className="text-base">Click the button below to post a tweet and bind your Telegram account. </span>
          <Button
            size="large"
            type="primary"
            className="w-[240px] rounded-full"
            onClick={handleBindTelegramClick}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin"></Loader2> : 'Bind Telegram Account'}
          </Button>
        </div>
      </div>
      <TaskSuccessModal open={showSuccessModal} onClose={handleModalClose}></TaskSuccessModal>
      <TaskFailedModal open={showFailedModal} onClose={() => setShowFailedModal(false)}></TaskFailedModal>
    </AuthChecker>
  )
}
